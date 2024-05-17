import bcrypt from "bcrypt";
import { User, UserParams } from "../models/user";
import * as userDB from "../data/user-data";
import { ApiError } from "../middlewares/error";

export async function getUser(id: number): Promise<User | undefined> {
  return await userDB.getUser(id);
}

export async function createUser(data: UserParams): Promise<User> {
  const { name, email, password, age, role } = data;
  // Logica del negocio
  // Emails unicos
  const user = await userDB.getUserByEmail(email);

  if (user) {
    throw new ApiError("El correo ya está registrado", 400);
  }
  // Hash password
  const costFactor = 10;
  const hashedPassword = await bcrypt.hash(password, costFactor); // $2b$10$MyQ.FEMQaufYmDrtS36Lkub9S8WGCMXjtpE/o7G754xUYwbgOjkmi
  const newUser = await userDB.createUser(name, email, hashedPassword, age, role);
  return newUser;
}

export async function validateCredentials(
  credentials: UserParams
): Promise<User> {
  const { email, password } = credentials;
  const user = await userDB.getUserByEmail(email);

  const isValid = await bcrypt.compare(password, user?.password || "");

  if (!user || !isValid) {
    throw new ApiError("Credenciales incorrectas", 400);
  }

  return user;
}
