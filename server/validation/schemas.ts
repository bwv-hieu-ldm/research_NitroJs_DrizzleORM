import * as yup from "yup";
import { VALIDATION_CONSTANTS } from "../common/constants";

export const createUserSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(
      VALIDATION_CONSTANTS.MIN_NAME_LENGTH,
      `Name must be at least ${VALIDATION_CONSTANTS.MIN_NAME_LENGTH} characters`
    )
    .max(
      VALIDATION_CONSTANTS.MAX_NAME_LENGTH,
      `Name must not exceed ${VALIDATION_CONSTANTS.MAX_NAME_LENGTH} characters`
    ),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required")
    .max(
      VALIDATION_CONSTANTS.MAX_EMAIL_LENGTH,
      `Email must not exceed ${VALIDATION_CONSTANTS.MAX_EMAIL_LENGTH} characters`
    ),
});

export const updateUserSchema = yup.object({
  name: yup
    .string()
    .optional()
    .min(
      VALIDATION_CONSTANTS.MIN_NAME_LENGTH,
      `Name must be at least ${VALIDATION_CONSTANTS.MIN_NAME_LENGTH} characters`
    )
    .max(
      VALIDATION_CONSTANTS.MAX_NAME_LENGTH,
      `Name must not exceed ${VALIDATION_CONSTANTS.MAX_NAME_LENGTH} characters`
    ),
  email: yup
    .string()
    .email("Invalid email format")
    .optional()
    .max(
      VALIDATION_CONSTANTS.MAX_EMAIL_LENGTH,
      `Email must not exceed ${VALIDATION_CONSTANTS.MAX_EMAIL_LENGTH} characters`
    ),
});

export const userIdSchema = yup.object({
  id: yup
    .number()
    .positive("ID must be a positive number")
    .required("ID is required"),
});

export const createProductSchema = yup.object({
  name: yup
    .string()
    .required("Product name is required")
    .min(
      VALIDATION_CONSTANTS.MIN_NAME_LENGTH,
      `Name must be at least ${VALIDATION_CONSTANTS.MIN_NAME_LENGTH} characters`
    )
    .max(
      VALIDATION_CONSTANTS.MAX_NAME_LENGTH,
      `Name must not exceed ${VALIDATION_CONSTANTS.MAX_NAME_LENGTH} characters`
    ),
  description: yup.string().optional(),
  price: yup
    .string()
    .required("Price is required")
    .max(
      VALIDATION_CONSTANTS.MAX_PRICE_LENGTH,
      `Price must not exceed ${VALIDATION_CONSTANTS.MAX_PRICE_LENGTH} characters`
    )
    .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number"),
  userId: yup
    .number()
    .positive("User ID must be a positive number")
    .required("User ID is required"),
});

export const updateProductSchema = yup.object({
  name: yup
    .string()
    .optional()
    .min(
      VALIDATION_CONSTANTS.MIN_NAME_LENGTH,
      `Name must be at least ${VALIDATION_CONSTANTS.MIN_NAME_LENGTH} characters`
    )
    .max(
      VALIDATION_CONSTANTS.MAX_NAME_LENGTH,
      `Name must not exceed ${VALIDATION_CONSTANTS.MAX_NAME_LENGTH} characters`
    ),
  description: yup.string().optional(),
  price: yup
    .string()
    .optional()
    .max(
      VALIDATION_CONSTANTS.MAX_PRICE_LENGTH,
      `Price must not exceed ${VALIDATION_CONSTANTS.MAX_PRICE_LENGTH} characters`
    )
    .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number"),
  userId: yup.number().positive("User ID must be a positive number").optional(),
});

export const productIdSchema = yup.object({
  id: yup
    .number()
    .positive("ID must be a positive number")
    .required("ID is required"),
});

export const userIdQuerySchema = yup.object({
  userId: yup
    .number()
    .positive("User ID must be a positive number")
    .required("User ID is required"),
});
