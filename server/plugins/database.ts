import { defineNitroPlugin } from "nitropack/runtime/plugin";
import { dbContext } from "../db/context";

export default defineNitroPlugin(async () => {
  try {
    await dbContext.initialize();
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Failed to establish database connection:", error);
    process.exit(1);
  }
});
