import { configDotenv } from "dotenv";
import { app } from "./app";
import { pool } from "./db";

configDotenv();

const port = process.env["PORT"] || 3000;

// Manejar cierre de la aplicación
const gracefulShutdown = () => {
  pool.end(() => {
    console.log("\nApplication ended gracefully");
    process.exit(0);
  });
};
// Eventos de cierre para que no se queden conexiones abiertas
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

app.listen(port, () => console.log(`Escuchando al puerto ${port}`));
