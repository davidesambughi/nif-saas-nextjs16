import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Mirror of auth.users — stores app-specific profile data.
 * The `id` is a FK to Supabase's auth.users table.
 * Populated via a Supabase trigger on auth.users INSERT.
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // FK to auth.users.id
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
