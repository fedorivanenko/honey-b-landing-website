import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").defaultNow(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  organization: varchar("organization", { length: 255 }),
  message: varchar("message", { length: 2000 }),
  idempotencyKey: text("idempotency_key").notNull().unique(),
});
