// Database constants
export const DB_CONSTANTS = {
  CONNECTION_LIMIT: 10,
  ACQUIRE_TIMEOUT: 60000,
  TIMEOUT: 60000,
} as const;

// Validation constants
export const VALIDATION_CONSTANTS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 255,
  MAX_EMAIL_LENGTH: 255,
  MAX_PRICE_LENGTH: 20,
} as const;

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
} as const;

// Error messages
export const ERROR_MESSAGES = {
  USER_ALREADY_EXISTS: "User already exists",
  VALIDATION_ERROR: "Invalid request data",
  UNKNOWN_ERROR: "Unknown error",
  DB_NOT_INITIALIZED: "Database not initialized. Call initialize() first.",
} as const;
