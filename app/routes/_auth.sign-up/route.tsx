import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { useRouteError } from "@remix-run/react";
import AuthForm from "~/components/AuthForm.tsx";
import { authenticator } from "~/services/auth.server";

interface AuthError extends Error {
  data: { message: string };
}

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
  return await authenticator.authenticate("form-sign-up", request, {
    successRedirect: "/",
  });
};

export default function SignUp() {
  return <AuthForm isLoginPage={false} />;
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
