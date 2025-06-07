import { text, pgTable, timestamp, pgEnum, integer } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", ["user", "admin"]);

export const user = pgTable("user", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull().unique(),
  password: text("password").notNull(),
  role: rolesEnum().default("user").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
});
