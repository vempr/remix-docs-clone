import { useLocation } from "@remix-run/react";

export const useAuthPath = () => {
  const location = useLocation();
  const url = location.pathname;

  return {
    isLoginUrl: url.endsWith("/log-in"),
    isSignupUrl: url.endsWith("/sign-up"),
    isForgotPasswordUrl: url.endsWith("/forgot-password"),
  };
};
