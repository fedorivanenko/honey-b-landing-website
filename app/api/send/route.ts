import { NextResponse } from "next/server";
import { Resend } from "resend";

import { ContactNotificationEmail } from "@/components/email/contact-notification-email";
import { contactPayloadSchema, ContactPayload } from "@/lib/contact";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export class SendEmailError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
  }
}

function getRecipients(rawList: string | undefined) {
  if (!rawList) {
    throw new SendEmailError("MAILING_LIST env missing");
  }

  const recipients = rawList
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);

  if (!recipients.length) {
    throw new SendEmailError("MAILING_LIST env provided no recipients");
  }

  return recipients;
}

interface SendOptions {
  idempotencyKey?: string;
}

export async function sendContactNotification(
  payload: ContactPayload,
  options?: SendOptions,
) {
  if (!resend) {
    throw new SendEmailError("RESEND_API_KEY env missing");
  }

  const sendingEmail = process.env.SENDING_EMAIL;

  if (!sendingEmail) {
    throw new SendEmailError("SENDING_EMAIL env missing");
  }

  const recipients = getRecipients(process.env.MAILING_LIST);
  const trimmedMessage = payload.message?.trim() ? payload.message.trim() : null;

  const emailPayload = {
    from: `HoneyB alert <${sendingEmail}>`,
    to: recipients,
    subject: `New inquiry from ${payload.fullName}`,
    react: ContactNotificationEmail({
      ...payload,
      message: trimmedMessage,
    }),
  };

  const requestOptions = options?.idempotencyKey
    ? { idempotencyKey: options.idempotencyKey }
    : undefined;

  const { error } = await resend.emails.send(emailPayload, requestOptions);

  if (error) {
    throw new SendEmailError("Failed to send notification");
  }
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

    await sendContactNotification(parsed.data);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (error instanceof SendEmailError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Sending email failed", error);

    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 },
    );
  }
}
