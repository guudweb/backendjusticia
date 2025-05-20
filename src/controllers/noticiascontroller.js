import { db } from "../db/connection.js";
import { noticias } from "../db/schema.js";
import { eq } from "drizzle-orm";

// Obtener todas las noticias
export const obtenerNoticias = async (req, res) => {
  try {
    const todasLasNoticias = await db
      .select()
      .from(noticias)
      .orderBy(noticias.createdAt);
    res.json(todasLasNoticias);
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    res.status(500).json({ mensaje: "Error al obtener noticias" });
  }
};

export const obtenerNoticiaPorSlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const noticia = await db
      .select()
      .from(noticias)
      .where(eq(noticias.slug, slug))
      .limit(1);

    if (noticia.length === 0) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    res.status(200).json({
      mensaje: "Noticia obtenida exitosamente",
      noticia: noticia[0],
    });
  } catch (error) {
    console.error("Error al obtener noticia:", error);
    res.status(500).json({ mensaje: "Error al obtener noticia" });
  }
};

// Obtener una noticia por ID
export const obtenerNoticiaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const noticia = await db
      .select()
      .from(noticias)
      .where(eq(noticias.id, parseInt(id)))
      .limit(1);

    if (noticia.length === 0) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    res.json(noticia[0]);
  } catch (error) {
    console.error("Error al obtener noticia por ID:", error);
    res.status(500).json({ mensaje: "Error al obtener noticia" });
  }
};

// Helper para generar slugs
const generateSlug = (titulo) => {
  return titulo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
};

// Crear una nueva noticia
export const crearNoticia = async (req, res) => {
  const { titulo, subtitulo, contenido, autor, imagen } = req.body;

  if (!titulo || !contenido || !autor) {
    return res.status(400).json({
      mensaje:
        "Todos los campos son obligatorios excepto la imagen y subtítulo",
    });
  }

  try {
    // Generar el slug
    const baseSlug = generateSlug(titulo);
    let finalSlug = baseSlug;
    let attempt = 1;

    // Verificar si el slug ya existe - FORMA CORRECTA para Drizzle ORM
    while (attempt <= 5) {
      const existing = await db
        .select()
        .from(noticias)
        .where(eq(noticias.slug, finalSlug))
        .limit(1);

      if (existing.length === 0) break;
      finalSlug = `${baseSlug}-${attempt}`;
      attempt++;
    }

    if (attempt > 5) {
      return res.status(400).json({
        mensaje: "No se pudo generar un slug único después de varios intentos",
      });
    }

    // Crear la noticia
    const nuevaNoticia = await db
      .insert(noticias)
      .values({
        titulo,
        subtitulo: subtitulo || null,
        slug: finalSlug,
        contenido,
        autor,
        imagen: imagen || null,
      })
      .returning();

    res.status(201).json({
      mensaje: "Noticia creada exitosamente",
      noticia: nuevaNoticia[0],
    });
  } catch (error) {
    console.error("Error al crear noticia:", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear noticia", error: error.message });
  }
};

// Actualizar una noticia
export const actualizarNoticia = async (req, res) => {
  const { id } = req.params;
  const { titulo, subtitulo, contenido, imagen } = req.body;

  try {
    // Verificar si la noticia existe
    const noticiaExistente = await db
      .select()
      .from(noticias)
      .where(eq(noticias.id, id))
      .limit(1);

    if (noticiaExistente.length === 0) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    // Generar nuevo slug solo si cambió el título
    let slug = noticiaExistente[0].slug;
    if (titulo && titulo !== noticiaExistente[0].titulo) {
      const baseSlug = generateSlug(titulo);
      let finalSlug = baseSlug;
      let attempt = 1;

      while (attempt <= 5) {
        const existing = await db
          .select()
          .from(noticias)
          .where(and(eq(noticias.slug, finalSlug), ne(noticias.id, id)))
          .limit(1);

        if (existing.length === 0) break;
        finalSlug = `${baseSlug}-${attempt}`;
        attempt++;
      }

      if (attempt > 5) {
        return res.status(400).json({
          mensaje:
            "No se pudo generar un slug único después de varios intentos",
        });
      }
      slug = finalSlug;
    }

    // Actualizar la noticia
    const noticiaActualizada = await db
      .update(noticias)
      .set({
        titulo: titulo || noticiaExistente[0].titulo,
        subtitulo:
          subtitulo !== undefined ? subtitulo : noticiaExistente[0].subtitulo,
        contenido: contenido || noticiaExistente[0].contenido,
        imagen: imagen !== undefined ? imagen : noticiaExistente[0].imagen,
        slug,
        updatedAt: sql`CURRENT_TIMESTAMP`,
      })
      .where(eq(noticias.id, id))
      .returning();

    res.status(200).json({
      mensaje: "Noticia actualizada exitosamente",
      noticia: noticiaActualizada[0],
    });
  } catch (error) {
    console.error("Error al actualizar noticia:", error);
    res.status(500).json({ mensaje: "Error al actualizar noticia" });
  }
};

// Eliminar una noticia
export const eliminarNoticia = async (req, res) => {
  const { id } = req.params;

  try {
    // Verificar si la noticia existe
    const noticiaExistente = await db
      .select()
      .from(noticias)
      .where(eq(noticias.id, parseInt(id)))
      .limit(1);

    if (noticiaExistente.length === 0) {
      return res.status(404).json({ mensaje: "Noticia no encontrada" });
    }

    await db.delete(noticias).where(eq(noticias.id, parseInt(id)));

    res.json({ mensaje: "Noticia eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar noticia:", error);
    res.status(500).json({ mensaje: "Error al eliminar noticia" });
  }
};
