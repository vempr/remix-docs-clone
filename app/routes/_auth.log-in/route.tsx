import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { LoginArgs, loginSchema } from "./login-schema.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Form, Link } from "@remix-run/react";
import { json, ActionFunctionArgs } from "@remix-run/node";

export default function LogIn() {
  const [passwordShow, setPasswordShow] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRemixForm<LoginArgs>({
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form
      className="flex w-64 flex-col gap-y-4 sm:w-96 lg:w-[30rem]"
      action="POST"
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
            placeholder="super-duper-secret-password-1234"
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
        <Link to="/sign-up">Don't have an account?</Link>
        <Link to="/forgot-password">Forgot your password?</Link>
      </div>
      <button
        className="font-geist-medium my-2 flex justify-center rounded-2xl border-4 border-white bg-sky-400 py-3 text-2xl text-white transition-all hover:bg-sky-500 hover:shadow-2xl"
        type="submit"
      >
        Log In
      </button>
    </Form>
  );
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const { errors, data, receivedValues } =
    await getValidatedFormData<LoginArgs>(request, zodResolver(loginSchema));
  if (errors) return json({ errors, receivedValues });

  console.log(data);
  return json({ data });
};
