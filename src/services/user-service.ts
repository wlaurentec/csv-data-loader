import bcrypt from "bcrypt";
import { User, UserParams } from "../models/user";
import * as userDB from "../data/user-data";
import { ApiError } from "../middlewares/error";
import { LoginParams } from "../models/login";
import { pool } from "../db";

export async function getUser(id: number): Promise<User | undefined> {
  return await userDB.getUser(id);
}

export async function createUser(data: UserParams): Promise<User> {
  const { name, email, age, role } = data;

  const user = await userDB.getUserByEmail(email);

  if (user) {
    throw new ApiError("El correo ya está registrado", 400);
  }

  const newUser = await userDB.createUser(name, email, age, role);
  return newUser;
}

export async function validateCredentials(
  credentials: LoginParams
): Promise<User> {
  const { email, password } = credentials;
  const user = await userDB.getUserByEmail(email);


  const admin = (await pool.query('SELECT * FROM admin WHERE user_id = $1', [user?.id])).rows[0];
  
  const isValid = await bcrypt.compare(password, admin?.password || "");

  if (!user || !isValid) {
    throw new ApiError("Credenciales incorrectas", 400);
  }


  return user;
}

