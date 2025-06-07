import { text, pgTable, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";
import { Role } from "@/lib/enums";

function enumToPgEnum<T extends Record<string, unknown>>(myEnum: T): [T[keyof T], ...T[keyof T][]] {
  return Object.values(myEnum).map((value: unknown) => `${value}`) as [T[keyof T], ...T[keyof T][]];
}

export const rolesEnum = pgEnum("roles", enumToPgEnum(Role));

export const user = pgTable("user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  password: text("password").notNull(),
  role: rolesEnum().default(Role.USER).notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  last_login_at: timestamp("last_login_at", { withTimezone: true }),
});
