import { config } from "dotenv";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

// Configurar variables de entornos
config();

//Puerto
const PORT = process.env.PORT || 3000;

//Llamada
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor conectado correctamente en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    setTimeout(startServer, 5000);
  }
}
startServer();
