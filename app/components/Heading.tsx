export default function Heading({ title }: { title: string }) {
  return (
    <h1 className="font-geist-bold text-3xl text-slate-900">
      <span className="text-sky-500">{"<"}</span>
      {title}
      <span className="text-sky-500">{" />"}</span>
    </h1>
  );
}
