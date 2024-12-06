import express, { json } from "express";
import cors from "cors";

const app = express();

//Middlewares globales
app.use(json());
app.use(cors());
//app.use(errorHandler);

//Rutas

//Rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;
