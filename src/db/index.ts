import pg from "pg";
import dotenv from "dotenv";
dotenv.config();


const { Pool } = pg;

const dbConfig = {
  host: process.env["PGHOST"],
  port: Number(process.env["PGPORT"]),
  database: process.env["PGDATABASE"],
  user: process.env["PGUSER"],
  password: process.env["PGPASSWORD"],
};
export const pool = new Pool(dbConfig);

export const query = (text: string, params?: (string | number | boolean)[]) => {
  return pool.query(text, params);
};
