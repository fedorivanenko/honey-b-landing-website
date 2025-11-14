import * as z from "zod";

import { contactFormSchema } from "@/db/zod";

export const contactPayloadSchema = contactFormSchema.pick({
  fullName: true,
  email: true,
  organization: true,
  message: true,
});

export type ContactPayload = z.infer<typeof contactPayloadSchema>;
