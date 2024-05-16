import express from "express";
import cookieParser from "cookie-parser";

 
const app = express();
const port = 3000;
 
// Middlewares
app.use(cookieParser());
app.use(express.json());
// app.use(sessionHandler());

// Routers
app.use();
app.use("/");


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});