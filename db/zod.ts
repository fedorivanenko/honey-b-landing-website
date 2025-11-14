import { createInsertSchema } from "drizzle-zod"
import { contacts } from "@/db/schema"

const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const contactFormSchema = createInsertSchema(contacts, {
    fullName: (f) =>
        f
            .min(1, { message: "Required" })
            .max(255, { message: "Too long" }),

    email: (f) =>
        f
            .min(1, { message: "Required" })
            .max(255, { message: "Too long" })
            .regex(emailRegex, { message: "Invalid email" }),

    organization: (f) =>
        f
            .min(1, { message: "Required" })
            .max(255, { message: "Too long" }),

    message: (f) =>
        f.max(2000, { message: "Too long" }),
})
