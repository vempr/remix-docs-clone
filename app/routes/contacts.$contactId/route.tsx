import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import q from "~/services/db.server";
import invariant from "tiny-invariant";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  const display = data?.contact.first_name
    ? `${data?.contact.first_name} ${data?.contact.last_name}`
    : data?.contact.id;

  return [
    { title: `Contact | ${display}` },
    {
      name: "description",
      content: `Profile of user "${display}"`,
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing 'contactId' param");
  const contact = await q(
    "SELECT first_name, last_name, avatar_url, twitter_url, about_me_description, created_at FROM contacts WHERE id = $1",
    [params.contactId],
  );
  if (!contact.length) throw new Response("Contact not found", { status: 404 });
  return json({ contact: contact[0] });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <div className="flex gap-x-6">
      {contact.avatar_url?.length ? (
        <img
          className="h-48 w-48 rounded-2xl border-4 border-sky-500"
          src={contact.avatar_url}
        />
      ) : (
        <div className="font-geist-light flex h-48 w-48 items-center justify-center rounded-2xl bg-slate-300 italic opacity-70">
          No avatar
        </div>
      )}
      <div>
        {contact.first_name || contact.last_name ? (
          <h1 className="font-geist-bold text-2xl">
            {contact.first_name} {contact.last_name}
          </h1>
        ) : (
          <h1 className="font-geist-bold text-2xl italic text-slate-400">
            No name
          </h1>
        )}
        {contact.twitter_url ? (
          <a
            className="font-geist-regular text-sky-500 hover:underline"
            href={contact.twitter_url}
            target="_blank"
          >
            {contact.twitter_url}
          </a>
        ) : (
          <a className="font-geist-regular">No twitter</a>
        )}
        {contact.about_me_description ? (
          <p className="font-geist-regular italic">
            {contact.about_me_description}
          </p>
        ) : (
          <p className="font-geist-regular italic text-slate-400">
            No description
          </p>
        )}
      </div>
    </div>
  );
}
