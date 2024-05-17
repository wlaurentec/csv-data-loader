import bcrypt from "bcrypt";
import { User } from "../models/user";
import * as userDB from "../data/user-data";
import { ApiError } from "../middlewares/error";
import { LoginParams } from "../models/login";
import { pool } from "../db";
// import { adminSchema } from "../models/admin";

export async function getUser(id: number): Promise<User | undefined> {
  return await userDB.getUser(id);
}

// export async function createUser(data: UserParams): Promise<User> {
//   const { name, email, age, role } = data;
//   // Logica del negocio
//   // Emails unicos
//   const user = await userDB.getUserByEmail(email);

//   if (user) {
//     throw new ApiError("El correo ya está registrado", 400);
//   }
//   // Hash password
//   // const costFactor = 10;
//   // const hashedPassword = await bcrypt.hash(password, costFactor); // $2b$10$MyQ.FEMQaufYmDrtS36Lkub9S8WGCMXjtpE/o7G754xUYwbgOjkmi
//   const newUser = await userDB.createUser(name, email, age, role);
//   return newUser;
// }

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


// async function createAdmin(email: string, password: string) {
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const userResult = await pool.query('INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id', ['lechuga', email, 'admin']);
//   const userId = userResult.rows[0].id;
//   await pool.query('INSERT INTO admin (user_id, password) VALUES ($1, $2)', [userId, hashedPassword]);
// }

// // Llamar a la función para crear un admin
// createAdmin('lechuga@gmail.com', '123456');