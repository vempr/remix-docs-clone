import { LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { useAuthPath } from "./useAuthPath.ts";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
// auth redirect blabla
// };

export default function AuthLayout() {
  const { isLoginUrl, isSignupUrl, isForgotPasswordUrl } = useAuthPath();

  return (
    <div>
      <h1 className="font-geist-bold mb-6 text-3xl text-slate-900">
        {isLoginUrl && (
          <p>
            <span className="text-sky-500">{"<"}</span>Log In
            <span className="text-sky-500">{" />"}</span>
          </p>
        )}
        {isSignupUrl && (
          <p>
            <span className="text-sky-500">{"<"}</span>Sign Up
            <span className="text-sky-500">{" />"}</span>
          </p>
        )}
        {isForgotPasswordUrl && (
          <p>
            <span className="text-sky-500">{"<"}</span>Forgot Password
            <span className="text-sky-500">{" />"}</span>
          </p>
        )}
      </h1>
      <Outlet />
    </div>
  );
}
