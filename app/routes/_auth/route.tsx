import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useAuthPath } from "./useAuthPath.ts";
import Heading from "~/components/Heading.tsx";
import { authenticator } from "~/services/auth.server.ts";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: "/",
  });
};

export default function AuthLayout() {
  const { isLoginUrl, isSignupUrl, isForgotPasswordUrl } = useAuthPath();

  return (
    <div>
      {isLoginUrl && <Heading title="Log In" />}
      {isSignupUrl && <Heading title="Sign Up" />}
      {isForgotPasswordUrl && <Heading title="Forgot Password" />}
      <Outlet />
    </div>
  );
}
