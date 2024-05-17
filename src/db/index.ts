import pg from "pg";
import dotenv from "dotenv";
dotenv.config();


const { Pool } = pg;

const dbConfig = {
  host: "localhost",
  port: 5432,
  database: "csv-loader",
  user: process.env["DB_USER"], //Tu usuario
  password: process.env["DB_PASS"], //Contraseña
};
export const pool = new Pool(dbConfig);

export const query = (text: string, params?: (string | number | boolean)[]) => {
  return pool.query(text, params);
};
