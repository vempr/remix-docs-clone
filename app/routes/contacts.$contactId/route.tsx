import { json, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { useLoaderData, useRouteError } from "@remix-run/react";
import { singleQuery } from "~/services/db.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  let display: string = "Error";
  if (data) {
    if (data.contact.first_name || data.contact.last_name) {
      display = `${data?.contact.first_name} ${data?.contact.last_name}`;
    } else {
      display = `${data?.contact.id}`;
    }
  }

  return [
    { title: `Contact | ${display}` },
    {
      name: "description",
      content: `Profile of user "${display}"`,
    },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  if (isNaN(params.contactId as any))
    throw new Error(`Invalid ID: "${params.contactId}"`);
  const contact = await singleQuery(
    "SELECT id, first_name, last_name, avatar_public_id, twitter_handle, about_me_description, created_at FROM contacts WHERE id = $1",
    [params.contactId as string],
  );
  if (contact === null)
    throw new Error(`Contact with ID ${params.contactId} not found!`);
  return json({ contact });
};

export default function Contact() {
  const { contact } = useLoaderData<typeof loader>();

  return (
    <div className="flex w-96 gap-x-6">
      {contact.avatar_public_id?.length ? (
        <img
          className="h-48 w-48 rounded-2xl border-4 border-sky-300"
          src={`https://res.cloudinary.com/djpz0iokm/image/upload/q_70/${contact.avatar_public_id}`}
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
        {contact?.twitter_handle ? (
          <a
            className="font-geist-regular text-sky-500 hover:underline"
            href={`https://www.x.com/${contact.twitter_handle}`}
            target="_blank"
          >
            @{contact.twitter_handle}
          </a>
        ) : (
          <p className="font-geist-regular">No twitter</p>
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

export function ErrorBoundary() {
  const error = useRouteError() as Error;

  return (
    <div className="text-center">
      <h1 className="font-geist-black text-6xl text-sky-500">
        <span className="text-black">{"<"}</span>Error
        <span className="text-black">{" />"}</span>
      </h1>
      <strong className="font-geist-regular font-normal">
        {error.message}
      </strong>
    </div>
  );
}
