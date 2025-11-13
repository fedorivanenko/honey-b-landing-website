import { EmailTemplate } from "@/components/email/email-template";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST() {
    try {
        const sendingEmail = process.env.SENDING_EMAIL;
        const listStr = process.env.MAILING_LIST;

        if (!sendingEmail) {
            return Response.json({ error: "SENDING_EMAIL env missing" }, { status: 500 });
        }
        if (!listStr) {
            return Response.json({ error: "MAILING_LIST env missing" }, { status: 500 });
        }

        const recipients = listStr.split(",").map((e) => e.trim());

        const { data, error } = await resend.emails.send({
            from: `HoneyB alert <${sendingEmail}>`,
            to: recipients,
            subject: "New Inquiry",
            react: EmailTemplate({ firstName: "John" }),
        });

        if (error) return Response.json({ error }, { status: 500 });

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}
