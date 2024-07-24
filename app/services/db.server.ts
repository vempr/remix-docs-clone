import pg from "pg";

import "dotenv/config";

export type Contact = {
  id: string;
  email: string;
  password: string;
  created_at: Date;
  first_name: string | undefined;
  last_name: string | undefined;
  avatar_url: string | undefined;
  twitter_url: string | undefined;
  about_me_description: string | undefined;
  email_confirmed: boolean;
};

const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "contacts",
  password: process.env.VITE_PG_PASSWORD,
  port: 5432,
});

const q = (
  query: string,
  params?: (string | number)[],
): Promise<Contact[] | Partial<Contact>[] | []> =>
  pool.query(query, params).then((response) => response.rows);
export default q;

export const singleQuery = async (
  query: string,
  params?: string[],
): Promise<Contact | Partial<Contact> | null> => {
  const result = await q(query, params);
  if (result.length < 1) {
    return null;
  } else {
    return result[0];
  }
};
