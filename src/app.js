import express, { json } from "express";
import morgan from "morgan";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

//Middlewares globales
app.use(morgan("dev"));
app.use(json());
app.use(cors());
app.use(cookieParser());

//Rutas
app.use("/auth", authRoutes);

//Rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

export default app;
