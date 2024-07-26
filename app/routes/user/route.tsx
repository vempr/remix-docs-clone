import { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import Heading from "~/components/Heading";
import { authenticator } from "~/services/auth.server";
import { singleQuery } from "~/services/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Your Profile" },
    {
      name: "description",
      content: "Your remix-contacts contact profile.",
    },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionUser = await authenticator.isAuthenticated(request, {
    failureRedirect: "/log-in",
  });
  const user = await singleQuery(
    `SELECT first_name, last_name, avatar_public_id, twitter_handle, about_me_description FROM contacts
    WHERE id = $1`,
    [sessionUser.id],
  );
  return json({ user });
}

export default function UserDashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="flex w-96 flex-col gap-y-6">
      <Heading title="Your Profile" />
      <div className="flex gap-x-6">
        {user?.avatar_public_id?.length ? (
          <img
            className="h-48 w-48 rounded-2xl border-4 border-sky-300"
            src={`https://res.cloudinary.com/djpz0iokm/image/upload/q_70/${user.avatar_public_id}`}
          />
        ) : (
          <div className="font-geist-light flex h-48 w-48 items-center justify-center rounded-2xl bg-slate-300 italic opacity-70">
            No avatar
          </div>
        )}
        <div>
          {user?.first_name || user?.last_name ? (
            <h2 className="font-geist-bold text-2xl">
              {user.first_name + " "}
              {user.last_name}
            </h2>
          ) : (
            <h2 className="font-geist-bold text-2xl italic text-slate-400">
              No name
            </h2>
          )}
          {user?.twitter_handle ? (
            <a
              className="font-geist-regular text-sky-500 hover:underline"
              href={`https://www.x.com/${user.twitter_handle}`}
              target="_blank"
            >
              @{user.twitter_handle}
            </a>
          ) : (
            <p className="font-geist-regular">No twitter</p>
          )}
          {user?.about_me_description ? (
            <p className="font-geist-regular italic">
              {user.about_me_description}
            </p>
          ) : (
            <p className="font-geist-regular italic text-slate-400">
              No description
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-x-1">
        <Link
          to="/user/edit"
          className="font-geist-medium flex-1 flex-grow rounded-lg border-4 border-slate-300 bg-slate-500 py-3 text-center text-white transition-all hover:bg-slate-600 hover:shadow-lg"
        >
          Edit
        </Link>
        <Link
          to="/user/settings"
          className="font-geist-medium flex-1 flex-grow rounded-lg border-4 border-slate-300 bg-slate-500 py-3 text-center text-white transition-all hover:bg-slate-600 hover:shadow-lg"
        >
          Settings
        </Link>
      </div>
    </div>
  );
}
