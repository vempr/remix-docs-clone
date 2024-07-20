import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Form, Link } from "@remix-run/react";
import { useRemixForm } from "remix-hook-form";
import {
  RegisterArgs,
  registerSchema,
} from "~/routes/_auth.sign-up/signup-schema";
import { LoginArgs, loginSchema } from "~/routes/_auth.log-in/login-schema";

type AuthFormProps = {
  isLoginPage: boolean;
  children?: React.ReactNode;
};

export default function AuthForm({ isLoginPage, children }: AuthFormProps) {
  const [passwordShow, setPasswordShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRemixForm<RegisterArgs | LoginArgs>({
    mode: "onSubmit",
    resolver: zodResolver(isLoginPage ? loginSchema : registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form
      className="flex w-64 flex-col gap-y-4 sm:w-96 lg:w-[30rem]"
      action={isLoginPage ? "/log-in" : "/sign-up"}
      method="POST"
      onSubmit={handleSubmit}
    >
      <label className="flex flex-col">
        <p className="font-geist-medium">Email</p>
        <input
          className="font-geist-regular rounded-md border border-gray-400 px-3 py-3 focus:outline-2 focus:outline-sky-500"
          placeholder="youremail@company.co"
          autoComplete="off"
          {...register("email")}
        />
        <p className="font-geist-regular mt-1 text-red-500">
          {errors?.email?.message}
        </p>
      </label>
      <label className="flex flex-col">
        <p className="font-geist-medium">Password</p>
        <div className="flex">
          <input
            className="font-geist-regular border-gray-40 w-full rounded-md border border-gray-400 px-3 py-3 focus:outline-2 focus:outline-sky-500"
            type={passwordShow ? "text" : "password"}
            placeholder="********"
            autoComplete="off"
            {...register("password")}
          />
          <button
            type="button"
            className="-ml-10"
            onClick={() => setPasswordShow(!passwordShow)}
          >
            {passwordShow ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        <p className="font-geist-regular mt-1 text-red-500">
          {errors?.password?.message}
        </p>
      </label>
      <div className="font-geist-regular flex justify-between text-sm text-sky-600 underline">
        {isLoginPage ? (
          <>
            <Link to="/sign-up">Don't have an account?</Link>
            <Link to="/forgot-password">Forgot your password?</Link>
          </>
        ) : (
          <Link to="/log-in">Already have an account?</Link>
        )}
      </div>
      {children && (
        <strong className="font-geist-regular text-sm text-red-600">
          {children}
        </strong>
      )}
      <button
        className="font-geist-medium my-2 flex justify-center rounded-2xl border-4 border-slate-300 bg-sky-400 py-3 text-2xl text-white transition-all hover:bg-sky-500 hover:shadow-2xl"
        type="submit"
      >
        {isLoginPage ? "Log In" : "Sign Up"}
      </button>
    </Form>
  );
}
