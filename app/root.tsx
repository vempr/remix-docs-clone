import { ChevronDown } from "lucide-react";
import { ReactNode, useState } from "react";

import { json } from "@remix-run/node";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";

import { authenticator } from "./services/auth.server.ts";
import q from "./services/db.server.ts";
import stylesheet from "./tailwind.css?url";

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const contacts = await q("SELECT id, first_name, last_name FROM contacts");
  const user = await authenticator.isAuthenticated(request);
  return json({ contacts, user });
};

function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col overflow-x-hidden lg:min-h-screen lg:flex-row">
        <header className="border-opacity-10 bg-slate-100 py-4 lg:min-h-screen lg:w-[20vw] lg:border-r-4 lg:border-slate-200">
          {children}
        </header>
        <main className="my-10 flex flex-grow items-center justify-center">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { contacts, user } = useLoaderData<typeof loader>();
  const [showContacts, setShowContacts] = useState(false);

  return (
    <Layout>
      <nav>
        <ul className="font-geist-light text-md flex gap-x-1">
          <li>
            <Link
              className="ml-6 hover:underline"
              to="/"
            >
              Home
            </Link>
          </li>
          {" | "}
          {user ? (
            <li>
              <Link
                className="hover:underline"
                to="/user"
              >
                Your Profile
              </Link>
            </li>
          ) : (
            <li>
              <Link
                className="hover:underline"
                to="/"
              >
                Log In
              </Link>
            </li>
          )}
        </ul>
      </nav>
      <button
        className="mb-4 flex w-screen items-center justify-between px-6 lg:flex-shrink-0 lg:hover:cursor-default"
        onClick={() => {
          if (document.documentElement.clientWidth < 1024)
            setShowContacts(!showContacts);
        }}
      >
        <p className="font-geist-black text-3xl">Contacts</p>
        <ChevronDown className="lg:hidden" />
      </button>
      <nav>
        <ul
          className={`flex flex-col px-6 lg:block ${showContacts ? "block" : "hidden"}`}
        >
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <li
                className="mb-1 flex"
                key={contact.id}
              >
                <Link
                  className="font-geist-regular hover:font-geist-medium flex w-full rounded-lg border-2 py-2 pl-4 transition-all hover:border-sky-500 hover:bg-sky-400 hover:text-white lg:py-3"
                  to={`/contacts/${contact.id}`}
                  onClick={() => setShowContacts(false)}
                >
                  {!!(contact.first_name || contact.last_name) ? (
                    `${contact.first_name} ${contact.last_name}`
                  ) : (
                    <span className="italic text-slate-500">No name</span>
                  )}
                </Link>
              </li>
            ))
          ) : (
            <li className="font-geist-light italic text-sky-500">
              No contacts
            </li>
          )}
        </ul>
      </nav>
    </Layout>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  console.log(error);
  return (
    <Layout>
      <div className="mx-6 my-2">
        <Link
          className="font-geist-light text-sm hover:underline"
          to="/"
        >
          Home
        </Link>
        <p className="font-geist-black mb-4 text-2xl">Contacts</p>
        <p className="font-geist-medium text-red-500">
          <b className="font-geist-bold underline">Server Error</b>{" "}
          {error.message}
        </p>
      </div>
    </Layout>
  );
}
