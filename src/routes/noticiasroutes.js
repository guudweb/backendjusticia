import express from "express";
import {
  obtenerNoticias,
  obtenerNoticiaPorId,
  crearNoticia,
  actualizarNoticia,
  eliminarNoticia,
  obtenerNoticiaPorSlug,
} from "../controllers/noticiascontroller.js";
import { verificarToken } from "../middleware/authmiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/", obtenerNoticias);
router.get("/:id", obtenerNoticiaPorId);
router.get("/:slug", obtenerNoticiaPorSlug);

// Rutas protegidas (requieren autenticación)
//router.post("/", crearNoticia);
router.put("/:id", verificarToken, actualizarNoticia);
router.delete("/:id", verificarToken, eliminarNoticia);

import { uploadNoticias } from "../middleware/multer.js";
router.post("/", uploadNoticias, crearNoticia);

export default router;
