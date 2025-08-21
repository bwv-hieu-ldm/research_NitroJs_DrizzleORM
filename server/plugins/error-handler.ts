// server/plugins/error-handler.ts
import { defineNitroPlugin } from "nitropack/runtime";

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook(
    "error",
    async (error: { statusCode?: number; message?: string }, { event }) => {
      if (event) {
        event.node.res.statusCode = 500;
        event.node.res.statusMessage = "Server Error";
        event.node.res.setHeader("Content-Type", "application/json");

        const errorBody = {
          error: true,
          statusCode: error.statusCode || 400,
          statusMessage: "Server Error",
          errorMessage: error.message || "An unexpected error occurred",
        };

        event.node.res.end(JSON.stringify(errorBody));
      }
    }
  );
});
