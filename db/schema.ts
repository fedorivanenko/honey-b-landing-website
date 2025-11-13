import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core"

export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  message: varchar("message", { length: 2000 }),
  createdAt: timestamp("created_at").defaultNow(),
})
