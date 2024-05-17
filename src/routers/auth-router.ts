import express from "express";
import { createUser, validateCredentials } from "../services/user-service";
import { validationHandler } from "../middlewares/validation";
import { userSchema } from "../models/user";
import jwt from "jsonwebtoken";

const jwtSecret = "ultra-secret";

const authRouter = express.Router();

authRouter.post(
  "/signup",
  validationHandler(userSchema),
  async (req, res, next) => {
    try {
      const newUser = await createUser(req.body);
      res
        .status(201)
        .json({ ok: true, message: "Usuario creado", data: newUser });
    } catch (error) {
      next(error);
    }
  }
);
authRouter.post("/login", async (req, res, next) => {
  try {
    const user = await validateCredentials(req.body);
    console.log(req.session);
    // req.session.userId = user.id; // ID usuario
    const payload = { userId: user.id, userRole: user.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "5m" });
    res.json({ ok: true, message: "Login exitoso", data: { token } });
  } catch (error) {
    next(error);
  }
});

authRouter.post("/logout", (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.clearCookie("connect.sid");
      res.json({ ok: true, message: "Logout exitoso" });
    }
  });
});

export default authRouter;
