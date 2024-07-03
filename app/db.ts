import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "contacts",
  password: process.env.VITE_PG_PASSWORD,
  port: 5432,
});

const q = (query: string) =>
  pool.query(query).then((response) => response.rows);
export default q;

export type Contact = {
  id: string;
  first: string;
  last: string;
  avatar: string;
  twitter: string;
  notes: string;
  created_at: Date;
};
