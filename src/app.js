import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authroutes.js";
import noticiasRoutes from "./routes/noticiasroutes.js";

import libroRoutes from "./routes/libroRoutes.js";

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

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: true,
      mensaje: `Error de subida: ${err.message}`,
    });
  }
  next(err);
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/noticias", noticiasRoutes);
app.use("/api/libros", libroRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ mensaje: "API de Justicia funcionando correctamente" });
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor en funcionamiento en el puerto ${PORT}`);
});
