import express from "express";
import { getUser } from "../services/user-service";
import { ApiError } from "../middlewares/error";
import jwt from "jsonwebtoken";

const jwtSecret = "ultra-secret";

const userRouter = express.Router();

userRouter.get("/", async (req, res, next) => {
  // const userId = req.session.userId; // ID usuario
  const token = req.headers.authorization?.split(" ")[1] || "";
  let userId;

  try {
    const payload = jwt.verify(token, jwtSecret) as {
      userId: number;
      iat: number;
      exp: number;
    }; // { userId: 5, iat: 1704896639, exp: 1704896699 }

    userId = payload.userId;
  } catch (error) {
    next(new ApiError("No autorizado", 401));
    return;
  }

  if (!userId) {
    next(new ApiError("No autorizado", 401));
    return;
  }

  const user = await getUser(userId);
  if (user) {
    res.json({ ok: true, message: "Obtuvimos los datos usuario", data: user });
  } else {
    next(new ApiError("No autorizado", 401));
  }
});
export default userRouter;
