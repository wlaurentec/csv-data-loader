import bcrypt from 'bcrypt';
import { pool } from "../db";


async function createAdmin(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const userResult = await pool.query('INSERT INTO users (name, email, role) VALUES ($1, $2, $3) RETURNING id', ['admin', email, 'admin']);
  const userId = userResult.rows[0].id;
  await pool.query('INSERT INTO admin (user_id, password) VALUES ($1, $2)', [userId, hashedPassword]);
}

// Llamar a la función para crear un admin
createAdmin('admin@example.com', 'admin_password');
