import { LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";
import q from "~/services/db.server";
import jwt, { JwtPayload } from "jsonwebtoken";

interface IJWTPayload extends JwtPayload {
  id: number;
}

const EMAIL_SECRET = process.env.VITE_EMAIL_SECRET as string;

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const token = params.token as string;
  try {
    const { user: id } = jwt.verify(token, EMAIL_SECRET) as IJWTPayload;
    await q(
      `
      UPDATE contacts
      SET email_confirmed = true
      WHERE id = $1;
    `,
      [id],
    );
    return null;
  } catch (err) {
    // jwt was tampered with OR an invalid token was typed in OR token is outdated
    // TODO: handle each case
    return redirect("/");
  }
};

export default function ConfirmationToken() {
  return (
    <div>
      <h1 className="font-geist-bold text-3xl">
        Thanks for confirming your email!
      </h1>
      <p className="font-geist-regular">You can now log in to your account.</p>
      <Link
        className="font-geist-semibold mt-5 flex justify-center rounded-2xl border-4 bg-sky-400 py-6 text-2xl text-white transition-all hover:bg-sky-500 hover:shadow-2xl"
        to="/log-in"
      >
        Log In
      </Link>
    </div>
  );
}
