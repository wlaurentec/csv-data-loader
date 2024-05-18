import { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { ZodError } from 'zod';
import { pool } from '../db';
import { userSchema } from '../models/user';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' });

interface User {
  id?: number;
  name: string;
  email: string;
  age?: number;
  role: string;
}

async function processCSV(filePath: string): Promise<{ success: User[]; errors: any[] }> {
  const success: User[] = [];
  const errors: any[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row) => {
        try {
          const userData = userSchema.parse(row);
          const result = await pool.query(
            'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
            [userData.name, userData.email, userData.age]
          );
          success.push(result.rows[0]);
        } catch (err: Error | any) {
          if (err instanceof ZodError) {
            errors.push({ row: row, details: err.errors });
          } else {
            errors.push({ row: row, details: err.message });
          }
        }
      })
      .on('end', () => {
        resolve({ success, errors });
      })  
      .on('error', (err) => {
        reject(err);
      });
  });
}

export const uploadCSV = [
  upload.single('data.csv'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return; // Add this line to ensure the function returns a value
      }

      const { success, errors } = await processCSV(req.file.path);
      res.json({
        ok: true,
        data: {
          success,
          errors,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },
];