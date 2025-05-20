import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import dotenv from "dotenv";

dotenv.config();

// Conexión a Turso
const client = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Inicializar Drizzle con el cliente de Turso
export const db = drizzle(client);
