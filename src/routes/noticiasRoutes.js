import express from "express";
import {
  obtenerNoticias,
  obtenerNoticiaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
  obtenerNoticiaPorSlug,
} from "../controllers/noticiascontroller.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", obtenerNoticias);
router.get("/:id", obtenerNoticiaPorId);

// Rutas protegidas (requieren autenticación)
router.post("/", verificarToken, crearNoticia);
router.put("/:id", verificarToken, actualizarNoticia);
router.get("/:slug", obtenerNoticiaPorSlug);
router.delete("/:id", verificarToken, eliminarNoticia);

export default router;
