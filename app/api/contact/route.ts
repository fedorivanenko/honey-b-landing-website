import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { contacts } from "@/db/schema";
import { contactPayloadSchema } from "@/lib/contact";
import {
  sendContactNotification,
  SendEmailError,
} from "@/app/api/send/route";

const MAX_NOTIFICATION_ATTEMPTS = 3;
const NOTIFICATION_RETRY_DELAY_MS = 1_000;
const MAX_DB_ATTEMPTS = 3;
const DB_RETRY_DELAY_MS = 500;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendNotificationWithRetry(
  payload: Parameters<typeof sendContactNotification>[0],
  idempotencyKey: string,
) {
  for (let attempt = 1; attempt <= MAX_NOTIFICATION_ATTEMPTS; attempt++) {
    try {
      await sendContactNotification(payload, { idempotencyKey });
      return;
    } catch (error) {
      const canRetry =
        error instanceof SendEmailError && attempt < MAX_NOTIFICATION_ATTEMPTS;

      if (!canRetry) {
        throw error;
      }

      await wait(NOTIFICATION_RETRY_DELAY_MS * attempt);
    }
  }
}

function isDatabaseError(error: unknown): error is { code?: string } {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
  );
}

async function findContactByIdempotencyKey(idempotencyKey: string) {
  const [existing] = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(eq(contacts.idempotencyKey, idempotencyKey))
    .limit(1);

  return existing;
}

type ContactInsertValues = {
  fullName: string;
  email: string;
  organization: string | null;
  message: string | null;
  idempotencyKey: string;
};

async function saveContactWithRetry(values: ContactInsertValues) {
  for (let attempt = 1; attempt <= MAX_DB_ATTEMPTS; attempt++) {
    try {
      const [record] = await db
        .insert(contacts)
        .values(values)
        .returning({ id: contacts.id });

      return record;
    } catch (error) {
      if (isDatabaseError(error) && error.code === "23505") {
        const existing = await findContactByIdempotencyKey(
          values.idempotencyKey,
        );

        if (existing) {
          return existing;
        }

        throw error;
      }

      const canRetry = attempt < MAX_DB_ATTEMPTS;

      if (!canRetry) throw error;

      await wait(DB_RETRY_DELAY_MS * attempt);
    }
  }

  throw new Error("Unable to save contact");
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);

    if (!payload) {
      return NextResponse.json(
        { error: "Unable to parse JSON payload" },
        { status: 400 },
      );
    }

    const parsed = contactPayloadSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { fullName, email, organization, message } = parsed.data;
    const trimmedMessage = message?.trim() ? message.trim() : null;
    const idempotencyKey = randomUUID();

    const record = await saveContactWithRetry({
      fullName,
      email,
      organization: organization ?? null,
      message: trimmedMessage,
      idempotencyKey,
    });

    const notificationPayload: Parameters<
      typeof sendContactNotification
    >[0] = {
      fullName,
      email,
      organization: organization ?? null,
      message: trimmedMessage ?? null,
    };

    sendNotificationWithRetry(notificationPayload, idempotencyKey).catch(
      (error) => {
        console.error("All notification attempts failed", error);
      },
    );

    return NextResponse.json({ id: record.id }, { status: 201 });
  } catch (error) {
    if (error instanceof SendEmailError) {
      console.error("Notification send failed", error);

      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Contact submission failed", error);

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
