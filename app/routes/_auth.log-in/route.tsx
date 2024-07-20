import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { useRouteError } from "@remix-run/react";
import { authenticator } from "~/services/auth.server.ts";

import AuthForm from "~/components/AuthForm.tsx";

interface AuthError extends Error {
  data: { message: string };
}

export const meta: MetaFunction = () => {
  return [
    { title: "Log In" },
    {
      name: "description",
      content: "Log in to remix-contacts app.",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  return await authenticator.authenticate("form-log-in", request, {
    successRedirect: "/",
  });
};

export default function LogIn() {
  return <AuthForm isLoginPage />;
}

export function ErrorBoundary() {
  const error = useRouteError() as AuthError;
  console.log(error);
  return (
    <AuthForm
      isLoginPage
      children={error.data.message}
    />
  );
}
