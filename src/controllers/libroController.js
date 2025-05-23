// controllers/libroController.js
import { db } from "../db/connection.js";
import { libros } from "../db/schema.js";
import { eq } from "drizzle-orm";
import cloudinary from "../utils/cloudinary.js";

const generateUniqueSlug = (titulo) => {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Obtener todos los libros
export const obtenerLibros = async (req, res) => {
  try {
    const todasLosLibros = await db
      .select()
      .from(libros)
      .orderBy(libros.createdAt);
    res.json(todasLosLibros);
  } catch (error) {
    console.error("Error al obtener libros:", error);
    res.status(500).json({ mensaje: "Error al obtener libros" });
  }
};

export const obtenerlibroPorSlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const libro = await db
      .select()
      .from(libros)
      .where(eq(libros.slug, slug))
      .limit(1);

    if (libro.length === 0) {
      return res.status(404).json({ mensaje: "libro no encontrada" });
    }

    res.status(200).json({
      mensaje: "libro obtenida exitosamente",
      libro: libro[0],
    });
  } catch (error) {
    console.error("Error al obtener libro:", error);
    res.status(500).json({ mensaje: "Error al obtener libro" });
  }
};

// Obtener una libro por ID
export const obtenerlibroPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const libro = await db
      .select()
      .from(libros)
      .where(eq(libros.id, parseInt(id)))
      .limit(1);

    if (libro.length === 0) {
      return res.status(404).json({ mensaje: "libro no encontrada" });
    }

    res.json(libro[0]);
  } catch (error) {
    console.error("Error al obtener libro por ID:", error);
    res.status(500).json({ mensaje: "Error al obtener libro" });
  }
};

// Crear Libro
export const crearLibro = async (req, res) => {
  const { titulo, descripcion, autor, tags } = req.body;

  try {
    // Subir ambos archivos
    const [portadaResult, archivoResult] = await Promise.all([
      req.files.portada?.[0]
        ? cloudinary.uploader.upload(req.files.portada[0].path)
        : null,
      req.files.archivo?.[0]
        ? cloudinary.uploader.upload(req.files.archivo[0].path, {
            resource_type: "raw",
          })
        : null,
    ]);

    const nuevoLibro = await db
      .insert(libros)
      .values({
        titulo,
        descripcion,
        autor,
        tags,
        portada: portadaResult?.secure_url || null,
        archivo: archivoResult?.secure_url || null,
        slug: await generateUniqueSlug(titulo),
      })
      .returning();

    res.status(201).json({
      mensaje: "Libro creado exitosamente",
      libro: nuevoLibro[0],
    });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

// Actualizar Libro
export const actualizarLibro = async (req, res) => {
  const { id } = req.params;

  try {
    const [portadaResult, archivoResult] = await Promise.all([
      req.files.portada?.[0]
        ? cloudinary.uploader.upload(req.files.portada[0].path)
        : null,
      req.files.archivo?.[0]
        ? cloudinary.uploader.upload(req.files.archivo[0].path, {
            resource_type: "raw",
          })
        : null,
    ]);

    const libroActualizado = await db
      .update(libros)
      .set({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion,
        autor: req.body.autor,
        tags: req.body.tags,
        portada: portadaResult?.secure_url || req.body.portada,
        archivo: archivoResult?.secure_url || req.body.archivo,
      })
      .where(eq(libros.id, id))
      .returning();

    res.json(libroActualizado[0]);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};
