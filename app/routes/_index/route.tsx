import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticator } from "~/services/auth.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Home" },
    {
      name: "description",
      content:
        "This app is a clone of Remix's intro project w/ authentication and a working database!",
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  return json({ user });
};

export default function Index() {
  const user = useLoaderData<typeof loader>();

  return (
    <div className="mx-8 text-right lg:m-0">
      <h1 className="font-geist-bold text-5xl lg:text-7xl">
        !Hello world<span className="text-sky-500">{">"}</span>
      </h1>
      <p className="font-geist-light">
        This is a clone of remix-run's introductory app. You can find the source
        code{" "}
        <a
          className="text-sky-600 underline"
          href="https://github.com/vempr/remix-docs-clone"
          target="_blank"
        >
          here
        </a>
        !
      </p>
      <Link
        className="font-geist-semibold mt-5 flex justify-center rounded-2xl border-4 bg-sky-400 py-6 text-2xl text-white transition-all hover:bg-sky-500 hover:shadow-2xl"
        to={user ? "/user" : "/log-in"}
      >
        {user ? "Your Profile" : "Log In"}
      </Link>
    </div>
  );
}
