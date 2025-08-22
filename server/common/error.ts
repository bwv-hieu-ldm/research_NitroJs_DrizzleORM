import { createError } from "h3";
import { HTTP_STATUS, ERROR_MESSAGES } from "./constants";

export const CONFLICT_ERROR = (message?: string) =>
  createError({
    statusCode: HTTP_STATUS.CONFLICT,
    statusMessage: "Conflict",
    message: message || ERROR_MESSAGES.USER_ALREADY_EXISTS,
  });

export const INTERNAL_SERVER_ERROR = (message?: string) =>
  createError({
    statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    statusMessage: "Internal Server Error",
    message: message || ERROR_MESSAGES.UNKNOWN_ERROR,
  });

export const BAD_REQUEST_ERROR = (message?: string) =>
  createError({
    statusCode: HTTP_STATUS.BAD_REQUEST,
    statusMessage: "Bad Request",
    message: message || "Invalid request",
  });

export const NOT_FOUND_ERROR = (message?: string) =>
  createError({
    statusCode: HTTP_STATUS.NOT_FOUND,
    statusMessage: "Not Found",
    message: message || "Not found",
  });
