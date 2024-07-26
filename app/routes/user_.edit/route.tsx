import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Heading from "~/components/Heading";
import { authenticator } from "~/services/auth.server.ts";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ActionFunctionArgs,
  json,
  LoaderFunctionArgs,
  MetaFunction,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";

import { profileSchema, ProfileValidation } from "./profileSchema.ts";
import uploadHandler from "./uploadHandler.server.ts";
import { singleQuery } from "~/services/db.server.ts";

export const meta: MetaFunction = () => {
  return [
    { title: "Edit Profile" },
    {
      name: "description",
      content: "Edit your remix-contacts contact profile.",
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

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/log-in",
  });

  try {
    const uploadFormData = await unstable_parseMultipartFormData(
      request,
      uploadHandler,
    );

    const firstName = uploadFormData.get("firstName") as string;
    const lastName = uploadFormData.get("lastName") as string;
    const twitterHandle = uploadFormData.get("twitterHandle") as string;
    const aboutMeDescription = uploadFormData.get(
      "aboutMeDescription",
    ) as string;
    const avatarPublicId = uploadFormData.get("profilePicture") as
      | string
      | null;

    profileSchema.parse({
      firstName,
      lastName,
      twitterHandle,
      aboutMeDescription,
    });

    if (avatarPublicId) {
      await singleQuery(
        `
        UPDATE contacts
        SET first_name = $1, last_name = $2, twitter_handle = $3, about_me_description = $4, avatar_public_id = $5
        WHERE id = $6
        `,
        // prettier-ignore
        [firstName, lastName, twitterHandle, aboutMeDescription, avatarPublicId, user.id],
      );
    } else {
      await singleQuery(
        `
        UPDATE contacts
        SET first_name = $1, last_name = $2, twitter_handle = $3, about_me_description = $4
        WHERE id = $5
        `,
        [firstName, lastName, twitterHandle, aboutMeDescription, user.id],
      );
    }

    return json({ message: "Profile successfully updated!", ok: true });
  } catch (err) {
    if (err instanceof Error) {
      return json({ message: err.message, ok: false });
    } else {
      return json({ message: JSON.stringify(err), ok: false });
    }
  }
}

export default function EditProfile() {
  const fetcher = useFetcher<typeof action>();
  const { user } = useLoaderData<typeof loader>();
  const actionData = fetcher.data;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValidation>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.first_name,
      lastName: user?.last_name,
      twitterHandle: user?.twitter_handle,
      aboutMeDescription: user?.about_me_description,
    },
  });
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  const onSubmit: SubmitHandler<ProfileValidation> = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    fetcher.submit(formData, {
      method: "POST",
      encType: "multipart/form-data",
    });
  };

  return (
    <div className="flex flex-col items-center gap-y-4">
      <Link
        to="/user"
        className="font-geist-medium flex justify-center rounded-2xl border-2 border-slate-300 bg-sky-300 px-6 py-2 text-white transition-all hover:bg-sky-400 hover:shadow-sm"
      >
        Back to Your Profile
      </Link>
      <Heading title="Edit Profile" />
      <fetcher.Form
        className="flex flex-col gap-y-2"
        method="PUT"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="md:flex md:gap-x-4">
          <label className="flex flex-col">
            <p className="font-geist-medium">First Name</p>
            <input
              className="font-geist-regular rounded-md border border-gray-400 px-3 py-3 focus:outline-2 focus:outline-sky-500"
              autoComplete="off"
              type="text"
              {...register("firstName")}
            />
            <p className="font-geist-regular mt-1 text-red-500">
              {errors?.firstName?.message}
            </p>
          </label>
          <label className="flex flex-col">
            <p className="font-geist-medium">Last Name</p>
            <input
              className="font-geist-regular rounded-md border border-gray-400 px-3 py-3 focus:outline-2 focus:outline-sky-500"
              autoComplete="off"
              type="text"
              {...register("lastName")}
            />
            <p className="font-geist-regular mt-1 text-red-500">
              {errors?.lastName?.message}
            </p>
          </label>
        </div>
        <label className="flex flex-col">
          <p className="font-geist-medium">Twitter Handle</p>
          <input
            className="font-geist-regular rounded-md border border-gray-400 px-3 py-3 focus:outline-2 focus:outline-sky-500"
            autoComplete="off"
            type="text"
            {...register("twitterHandle")}
          />
          <p className="font-geist-regular mt-1 text-red-500">
            {errors?.twitterHandle?.message}
          </p>
        </label>
        <label className="flex flex-col">
          <p className="font-geist-medium">About you</p>
          <textarea
            className="font-geist-regular h-40 rounded-md border border-gray-400 px-3 py-3 focus:outline-2 focus:outline-sky-500"
            autoComplete="off"
            {...register("aboutMeDescription")}
          ></textarea>
          <p className="font-geist-regular mt-1 text-red-500">
            {errors?.aboutMeDescription?.message}
          </p>
        </label>
        <label className="flex flex-col">
          <p className="font-geist-medium">Profile Picture ({"<5MB"})</p>
          <div className="relative flex flex-row items-center">
            <input
              className="font-geist-regular flex-1 rounded-md border border-gray-400 px-3 py-3 focus:outline-2 focus:outline-sky-500"
              autoComplete="off"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) setProfilePicture(e.target.files[0]);
              }}
            />
            {user?.avatar_public_id?.length ? (
              <img
                className="absolute right-2 h-10 w-10 rounded-md border border-sky-500"
                src={`https://res.cloudinary.com/djpz0iokm/image/upload/q_70/${user.avatar_public_id}`}
              />
            ) : (
              <div className="font-geist-light absolute right-2 flex h-10 w-10 items-center justify-center rounded-sm bg-slate-300 text-center text-xs italic opacity-70">
                No avatar
              </div>
            )}
          </div>
        </label>
        {actionData?.message && (
          <strong
            className={`font-geist-regular text-sm ${actionData.ok ? "text-green-600" : "text-red-600"}`}
          >
            {actionData.message}
          </strong>
        )}
        <button
          className="font-geist-medium my-2 flex justify-center rounded-2xl border-4 border-slate-300 bg-sky-400 py-3 text-2xl text-white transition-all hover:bg-sky-500 hover:shadow-xl"
          type="submit"
        >
          Save
        </button>
      </fetcher.Form>
    </div>
  );
}
