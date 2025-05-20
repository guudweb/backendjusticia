import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authroutes.js";
import noticiasRoutes from "./routes/noticiasRoutes.js";

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS para permitir conexiones desde cualquier IP
app.use(
  cors({
    origin: "*", // Permite todas las conexiones
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/noticias", noticiasRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "API de Noticias funcionando correctamente" });
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
