import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="mx-4 mt-20 text-right lg:m-0">
      <h1 className="font-geist-bold text-5xl lg:text-7xl">
        {"!Hello world>"}
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
    </div>
  );
}
