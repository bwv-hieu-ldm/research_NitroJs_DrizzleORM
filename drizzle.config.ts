// drizzle.config.ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle', // Directory for generated migrations
  schema: './server/db/schema.ts', // Path to your Drizzle schema file
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});