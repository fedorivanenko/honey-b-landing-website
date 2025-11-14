interface ContactNotificationEmailProps {
  fullName: string;
  email: string;
  organization?: string | null;
  message?: string | null;
}

export function ContactNotificationEmail({
  fullName,
  email,
  organization,
  message,
}: ContactNotificationEmailProps) {
  return (
    <div>
      <h1>New contact form submission</h1>
      <p>
        <strong>Name:</strong> {fullName}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Organization:</strong> {organization ?? "Not provided"}
      </p>
      {message ? (
        <div>
          <p>
            <strong>Message:</strong>
          </p>
          <p>{message}</p>
        </div>
      ) : (
        <p>No message was provided.</p>
      )}
    </div>
  );
}
