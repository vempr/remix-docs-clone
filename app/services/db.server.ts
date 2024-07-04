import "dotenv/config";
import pg from "pg";

type Contact = {
  id: string;
  first_name: string | undefined;
  last_name: string | undefined;
  avatar_url: string | undefined;
  twitter_url: string | undefined;
  about_me_description: string | undefined;
  created_at: Date;
};

interface User extends Contact {
  email: string;
  password: string;
}

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
  params?: string[],
): Promise<User[] | Contact[] | []> =>
  pool.query(query, params).then((response) => response.rows);
export default q;
