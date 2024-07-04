import q from "./services/db.server.ts";
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
import { ReactNode, useState } from "react";
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "./tailwind.css?url";
import { ChevronDown } from "lucide-react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async () => {
  const contacts = await q("SELECT id, first_name, last_name FROM contacts");
  return json({ contacts });
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
      <body className="flex flex-col lg:h-screen lg:flex-row">
        <header className="mb-20 bg-slate-100 py-4 lg:m-0 lg:min-h-screen lg:w-[20vw]">
          {children}
        </header>
        <main className="flex flex-grow items-center justify-center">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();
  const [showContacts, setShowContacts] = useState(false);

  return (
    <Layout>
      <Link
        className="font-geist-light ml-6 text-sm hover:underline"
        to="/"
      >
        Home
      </Link>
      <button
        className="mb-4 flex w-screen items-center justify-between px-6 lg:flex-shrink-0 lg:hover:cursor-default"
        onClick={() => {
          if (document.documentElement.clientWidth < 1024)
            setShowContacts(!showContacts);
        }}
      >
        <p className="font-geist-black text-2xl">Contacts</p>
        <ChevronDown className="lg:hidden" />
      </button>
      <nav>
        <ul
          className={`flex flex-col px-6 lg:block ${showContacts ? "block" : "hidden"}`}
        >
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <li
                className="flex"
                key={contact.id}
              >
                <Link
                  className="font-geist-regular hover:font-geist-medium flex w-full rounded-lg border border-transparent py-2 underline transition-all hover:border-sky-500 hover:bg-sky-400 hover:text-white lg:py-3"
                  to={`/contacts/${contact.id}`}
                  onClick={() => setShowContacts(false)}
                >
                  {!!(contact.first_name || contact.last_name)
                    ? `${contact.first_name} ${contact.last_name}`
                    : "No name"}
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
