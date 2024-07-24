import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import AuthForm from "~/components/AuthForm.tsx";
import { authenticator } from "~/services/auth.server";
import { Contact, singleQuery } from "~/services/db.server.ts";
import hashPassword from "~/utils/hash.ts";
import { getValidatedFormData } from "remix-hook-form";
import { fromError } from "zod-validation-error";

import { RegisterArgs, registerSchema } from "./signup-schema.ts";
import sendConfirmationEmail from "./confirm-email.server.ts";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign Up" },
    {
      name: "description",
      content: "Sign up for a remix-contacts account.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { errors, data: user } = await getValidatedFormData<RegisterArgs>(
    request,
    zodResolver(registerSchema),
  );
  if (errors) {
    return json({ message: fromError(errors).toString(), ok: false });
  }

  const existingUser = (await singleQuery(
    `SELECT * FROM contacts WHERE email = '${user.email}'`,
  )) as Contact | null;
  if (existingUser !== null) {
    return json({ message: "User already exists", ok: false });
  }

  const hashedPassword = await hashPassword(user.password);
  const newUser = (await singleQuery(
    `
    INSERT INTO contacts (email, password, first_name, last_name, avatar_url, twitter_url, about_me_description)
    VALUES ($1, $2, '', '', '', '', '')
    RETURNING *;`,
    [user.email, hashedPassword],
  )) as Contact;

  sendConfirmationEmail(newUser);

  return json({
    message: "Account created! Please check your inbox to confirm",
    ok: true,
  });
};

export default function SignUp() {
  const actionData = useActionData<typeof action>();
  return (
    <AuthForm
      isLoginPage={false}
      children={actionData?.message}
      success={actionData?.ok}
    />
  );
}
