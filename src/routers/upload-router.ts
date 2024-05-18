import { Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { ZodError } from 'zod';
import { pool } from '../db';
import { userSchema } from '../models/user';
import fs from 'fs';
import { pipeline } from 'stream/promises';

const upload = multer({ dest: 'uploads' });

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

  let rowIndex = 0;

  const processRow = async (row: any) => {
    rowIndex++;
    try {
      // Convert age to a number if it exists
      if (row.age) {
        row.age = Number(row.age);
      }
      const userData = userSchema.parse(row);
      const result = await pool.query(
        'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
        [userData.name, userData.email, userData.age]
      );
      success.push(result.rows[0]);
    } catch (err: any) {
      if (err instanceof ZodError) {
        const errorDetails = err.errors.reduce((acc: any, error) => {
          acc[error.path[0]] = error.message;
          return acc;
        }, {});
        errors.push({ row: rowIndex, details: errorDetails });
      } else {
        errors.push({ row: rowIndex, details: { message: err.message } });
      }
    }
  };

  await pipeline(
    fs.createReadStream(filePath),
    csv(),
    async function* (source) {
      for await (const row of source) {
        await processRow(row);
        yield row;
      }
    }
  );

  return { success, errors };
}

export const uploadCSV = [
  upload.single('csv'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: 'No file uploaded' });
        return;
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
