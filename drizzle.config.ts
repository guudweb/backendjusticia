// drizzle.config.js
export default {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  driver: "turso",
  //dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_URL,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
};
