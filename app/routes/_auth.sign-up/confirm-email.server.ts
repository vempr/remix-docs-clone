import { createTransport } from "nodemailer";
import jwt from "jsonwebtoken";
import { Contact } from "../../services/db.server.ts";

const EMAIL_SECRET = process.env.VITE_EMAIL_SECRET as string;
const GMAIL_ACCOUNT = process.env.VITE_GMAIL_ACCOUNT as string;
const GMAIL_APP_PASSWORD = process.env.VITE_GMAIL_APP_PASSWORD as string;

const transporter = createTransport({
  tls: {
    rejectUnauthorized: false,
  },
  host: "smtp.gmail.com",
  service: "Gmail",
  port: 465,
  secure: true,
  auth: {
    user: GMAIL_ACCOUNT,
    pass: GMAIL_APP_PASSWORD,
  },
});

export default function sendConfirmationEmail(user: Contact): void {
  jwt.sign(
    { user: user.id },
    EMAIL_SECRET,
    { expiresIn: "1d" },
    (_err, emailToken) => {
      const url = `http://localhost:5173/confirmation/${emailToken}`;

      transporter.sendMail({
        to: user.email,
        subject: "remix-contacts | Email Confirmation",
        html: `
          <h1>remix-contacts</h1>
          <p>
            An account with the email [${user.email}] has been registered to remix-contacts. To complete your registration, please confirm your email address by clicking the link below:
          </p>
          <br></br>
          <a href="${url}" target="_blank">${url}</a>
          <br></br><br></br>
          <p style="font-style: italic;">
            This link will expire in 24 hours. If you did not create an account with remix-contacts, please ignore this email.
          </p>
        `,
      });
    },
  );
}
