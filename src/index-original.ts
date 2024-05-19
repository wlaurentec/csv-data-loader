import express from "express";
import cookieParser from "cookie-parser";
import { authenticateHandler } from "./middlewares/authenticate";
import { authorize } from "./middlewares/authorize";
import authRouter from "./routers/auth-router";
import userRouter from "./routers/user-router";
import sessionHandler from "./middlewares/session";
import errorHandler from "./middlewares/error";
import { uploadCSV } from "./routers/upload-router";
import fs from 'fs';
import path from 'path';

 
const app = express();
const port = 3000;
 
// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(sessionHandler());

// Verificar y crear la carpeta 'uploads' si no existe
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Routers

app.use(authRouter);
app.use("/user", userRouter);

// Solo los usuarios con el rol "admin" pueden acceder a esta ruta
app.post("/upload", authenticateHandler, authorize("admin"), uploadCSV);

// Error handler

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});