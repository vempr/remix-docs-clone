/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node/globals" />

interface Env extends z.infer<typeof serverSchema> {
  VITE_PG_PASSWORD: string;
}
