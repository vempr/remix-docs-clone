import q, { Contact } from "./db.ts";
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
import type { LinksFunction } from "@remix-run/node";
import stylesheet from "./tailwind.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export const loader = async () => {
  const contacts: Contact[] = await q("SELECT * FROM contacts");
  return json({ contacts });
};

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();

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
        <header>
          <nav className="bg-slate-100 px-6 py-4 lg:min-h-screen lg:w-[20vw]">
            <p className="font-geist-black my-2 text-2xl lg:mb-4">Contacts</p>
            {contacts.length ? (
              <ul className="flex flex-col">
                {contacts.map((contact) => (
                  <li
                    key={contact.id}
                    className="font-geist-regular hover:font-geist-medium rounded-lg border border-transparent px-4 py-2 underline transition-all hover:border-sky-500 hover:bg-sky-400 hover:text-white lg:py-3"
                  >
                    <Link
                      className="block h-full w-full"
                      to={`/contacts/${contact.id}`}
                    >
                      {contact.first} {contact.last}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              "No contacts yet!"
            )}
          </nav>
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

export function ErrorBoundary() {
  const error = useRouteError() as Error;
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
      <body>
        <nav className="font-geist-black">
          Error fetching contacts! ({error.message})
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
