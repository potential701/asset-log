import { text, pgTable, timestamp, pgEnum, integer, boolean } from "drizzle-orm/pg-core";
import { AssetCondition, AssetStatus, AssetType, Role } from "@/lib/enums";
import { relations } from "drizzle-orm";

function enumToPgEnum<T extends Record<string, unknown>>(myEnum: T): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: unknown) => `${value}`) as [T[keyof T], ...T[keyof T][]];
}

export const rolesEnum = pgEnum("roles", enumToPgEnum(Role));
export const assetTypesEnum = pgEnum("asset_types", enumToPgEnum(AssetType));
export const assetStatusesEnum = pgEnum("asset_statuses", enumToPgEnum(AssetStatus));
export const assetConditionsEnum = pgEnum("asset_conditions", enumToPgEnum(AssetCondition));

export const user = pgTable("user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  password: text("password").notNull(),
  role: rolesEnum().default(Role.USER).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  last_login_at: timestamp("last_login_at", { withTimezone: true }),
});

export const userRelations = relations(user, ({ many }) => ({
  log: many(log),
}));

export const asset = pgTable("asset", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  type: assetTypesEnum().notNull(),
  serial_number: text("serial_number").notNull().unique(),
  status: assetStatusesEnum().default(AssetStatus.AVAILABLE).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp("updated_at", { withTimezone: true }),
});

export const assetRelations = relations(asset, ({ many }) => ({
  issue: many(issue),
  log: many(log),
}));

export const log = pgTable("log", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  asset_id: integer("asset_id")
    .references(() => asset.id)
    .notNull(),
  user_id: integer("user_id")
    .references(() => user.id)
    .notNull(),
  checked_out_at: timestamp("checked_out_at", { withTimezone: true }).notNull().defaultNow(),
  checked_in_at: timestamp("checked_in_at", { withTimezone: true }),
  return_condition: assetConditionsEnum(),
});

export const logRelations = relations(log, ({ one }) => ({
  asset: one(asset, {
    fields: [log.asset_id],
    references: [asset.id],
  }),
  user: one(user, {
    fields: [log.user_id],
    references: [user.id],
  }),
}));

export const issue = pgTable("issue", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  asset_id: integer("asset_id")
    .references(() => asset.id)
    .notNull(),
  user_id: integer("user_id")
    .references(() => user.id)
    .notNull(),
  reported_at: timestamp("reported_at", { withTimezone: true }).notNull().defaultNow(),
  description: text("description").notNull(),
  is_resolved: boolean("is_resolved").default(false).notNull(),
});

export const issueRelations = relations(issue, ({ one }) => ({
  asset: one(asset, {
    fields: [issue.asset_id],
    references: [asset.id],
  }),
}));
