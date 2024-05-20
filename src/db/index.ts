import { configDotenv } from "dotenv";
import { Client, Pool } from "pg";

if (process.env["NODE_ENV"] === "test") {
  configDotenv({ path: ".env.test" });
} else {
  configDotenv();
}

export const pool = new Pool({
  host: process.env["PGHOST"],
  port: Number(process.env["PGPORT"]),
  database: process.env["PGDATABASE"],
  user: process.env["PGUSER"],
  password: process.env["PGPASSWORD"],
});

export const query = async (
  text: string,
  params?: (string | number | boolean)[]
) => {
  // const initTime = Date.now();
  // console.log(text, params);
  const results = await pool.query(text, params);
  // const endTime = Date.now();
  // console.log("Query time: ", endTime - initTime, "ms");
  return results;
};

export const adminClient = new Client({
  host: process.env["PGHOST"],
  port: Number(process.env["PGPORT"]),
  database: process.env["PGADMINDATABASE"],
  user: process.env["PGUSER"],
  password: process.env["PGPASSWORD"],
});
