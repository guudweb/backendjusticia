import express from "express";
import {
  crearLibro,
  obtenerLibros,
  obtenerlibroPorId,
  obtenerlibroPorSlug,
} from "../controllers/libroController.js";
import { uploadLibros } from "../middleware/multer.js";

const router = express.Router();

router.get("/", obtenerLibros);
router.post("/", uploadLibros, crearLibro);
router.get("/:id", obtenerlibroPorId);
router.get("/:slug", obtenerlibroPorSlug);

export default router;
