import { defineNitroPlugin } from "nitropack/runtime/plugin";
import { setupDatabase } from "../db";

export default defineNitroPlugin(async () => {
  try {
    await setupDatabase();
    console.log("Database connection initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database connection:", error);
    throw error;
  }
});
