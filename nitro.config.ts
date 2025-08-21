import { defineNitroConfig } from "nitropack/config";
import path from "path";

export default defineNitroConfig({
  compatibilityDate: "latest",
  srcDir: "./server",
  imports: false,
  alias: {
    db: path.resolve(__dirname, "server", "db"),
    schema: path.resolve(__dirname, "server", "schema"),
    services: path.resolve(__dirname, "server", "services"),
    api: path.resolve(__dirname, "server", "api"),
    middleware: path.resolve(__dirname, "server", "middleware"),
    validation: path.resolve(__dirname, "server", "validation"),
  },
});
