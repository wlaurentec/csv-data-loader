import express from "express";
import cookieParser from "cookie-parser";
import { authenticateHandler } from "./middlewares/authenticate";
import { authorize } from "./middlewares/authorize";
import authRouter from "./routers/auth-router";
import userRouter from "./routers/user-router";
import sessionHandler from "./middlewares/session";

 
const app = express();
const port = 3000;
 
// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(sessionHandler());

// Routers

app.use(authRouter);
app.use("/user", userRouter);
// Solo los usuarios con el rol "admin" pueden acceder a esta ruta
app.get("/upload", authenticateHandler, authorize("admin"), (_req, res) => {
  res.json({ ok: true, message: "Bienvenido al panel de administración" });
});

// app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});