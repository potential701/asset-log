import { text, pgTable, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const rolesEnum = pgEnum("roles", ["user", "admin"]);

export const user = pgTable("user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  password: text("password").notNull(),
  role: rolesEnum().default("user").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  last_login_at: timestamp("last_login_at", { withTimezone: true }),
});
