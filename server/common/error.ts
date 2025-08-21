import { createError } from "h3";

export const CONFLICT_ERROR = (message?: string) =>
  createError({
    statusCode: 409,
    statusMessage: "Conflict",
    message: message || "Resource already exists",
  });

export const INTERNAL_SERVER_ERROR = (message?: string) =>
  createError({
    statusCode: 500,
    statusMessage: "Internal Server Error",
    message: message || "An unexpected error occurred",
  });
