// middleware/multer.js
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

// Configuración base para Cloudinary
const cloudinaryBaseConfig = {
  cloudinary: cloudinary,
  params: {
    resource_type: "auto",
    format: (req, file) => {
      if (file.mimetype.startsWith("image/")) return "webp";
      return "original"; // Mantener formato original para documentos
    },
  },
};

// 1. Configuración para Noticias (solo imágenes)
const noticiasStorage = new CloudinaryStorage({
  ...cloudinaryBaseConfig,
  params: {
    folder: "noticias",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
  },
});

export const uploadNoticias = multer({
  storage: noticiasStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Solo se permiten imágenes (JPEG, PNG, WEBP)"),
        false
      );
    }
    cb(null, true);
  },
}).single("imagen");

// 2. Configuración para Libros (portada + archivo)
const librosStorage = new CloudinaryStorage({
  ...cloudinaryBaseConfig,
  params: (req, file) => {
    const isPortada = file.fieldname === "portada";

    return {
      folder: isPortada ? "libros/portadas" : "libros/archivos",
      allowed_formats: isPortada
        ? ["jpg", "png", "jpeg", "webp"]
        : ["pdf", "epub", "docx", "odt", "txt"],
      public_id: `${Date.now()}-${file.originalname
        .split(".")[0]
        .replace(/\s/g, "_")}`,
      ...(isPortada && { transformation: [{ width: 800, crop: "scale" }] }),
    };
  },
});

export const uploadLibros = multer({
  storage: librosStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 2, // Máximo 2 archivos
  },
  fileFilter: (req, file, cb) => {
    // Validar portada
    if (file.fieldname === "portada") {
      const allowed = ["image/jpeg", "image/png", "image/webp"];
      if (!allowed.includes(file.mimetype)) {
        return cb(
          new Error("La portada debe ser una imagen (JPEG/PNG/WEBP)"),
          false
        );
      }
    }

    // Validar archivo
    if (file.fieldname === "archivo") {
      const allowed = [
        "application/pdf",
        "application/epub+zip",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.oasis.opendocument.text",
        "text/plain",
      ];

      if (!allowed.includes(file.mimetype)) {
        return cb(
          new Error(
            "Formato de documento no permitido (PDF/EPUB/DOCX/ODT/TXT)"
          ),
          false
        );
      }
    }

    cb(null, true);
  },
}).fields([
  { name: "portada", maxCount: 1 },
  { name: "archivo", maxCount: 1 },
]);

// Middleware de manejo de errores (opcional pero recomendado)
export const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: true,
      mensaje: `Error de subida: ${err.message}`,
    });
  }
  next(err);
};

export {};
