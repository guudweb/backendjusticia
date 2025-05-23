import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Esquema de usuarios
export const usuarios = sqliteTable("usuarios", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Esquema de noticias
export const noticias = sqliteTable("noticias", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  subtitulo: text("titulo"),
  slug: text("slug"),
  contenido: text("contenido").notNull(),
  autor: text("autor").notNull(),
  imagen: text("imagen"),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const libros = sqliteTable("libros", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").notNull(),
  autor: text("autor").notNull(),
  tags: text("tags"),
  portada: text("portada"), // URL de la imagen
  archivo: text("archivo"), // Nueva columna para el archivo del libro
  slug: text("slug").notNull().unique(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
