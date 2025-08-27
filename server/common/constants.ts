export const DB_CONSTANTS = {
  CONNECTION_LIMIT: 10,
  ACQUIRE_TIMEOUT: 60000,
  TIMEOUT: 60000,
} as const;

export const VALIDATION_CONSTANTS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 255,
  MAX_EMAIL_LENGTH: 255,
  MAX_PRICE_LENGTH: 20,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  DB_NOT_INITIALIZED: "Database not initialized",
  VALIDATION_ERROR: "Validation Error",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  USER_ALREADY_EXISTS: "User already exists",
  UNKNOWN_ERROR: "Unknown error",
} as const;
