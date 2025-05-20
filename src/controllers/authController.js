import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/connection.js";
import { usuarios } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const registro = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const usuarioExistente = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.username, username))
      .limit(1);

    if (usuarioExistente.length > 0) {
      return res
        .status(400)
        .json({ mensaje: "El nombre de usuario ya está en uso" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const nuevoUsuario = await db
      .insert(usuarios)
      .values({
        username,
        password: hashedPassword,
      })
      .returning({ id: usuarios.id, username: usuarios.username });

    // Generar token de autenticación
    const token = jwt.sign({ id: nuevoUsuario[0].id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      mensaje: "Usuario registrado exitosamente",
      token,
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario por nombre de usuario
    const usuario = await db
      .select()
      .from(usuarios)
      .where(eq(usuarios.username, username))
      .limit(1);

    if (usuario.length === 0) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    // Verificar contraseña
    const passwordValida = await bcrypt.compare(password, usuario[0].password);

    if (!passwordValida) {
      return res.status(400).json({ mensaje: "Credenciales inválidas" });
    }

    // Generar token
    const token = jwt.sign({ id: usuario[0].id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};
