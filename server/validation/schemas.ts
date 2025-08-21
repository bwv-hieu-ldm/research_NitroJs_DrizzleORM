import * as yup from "yup";

// User validation schemas
export const createUserSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const updateUserSchema = yup.object({
  name: yup.string().optional().min(2, "Name must be at least 2 characters"),
  email: yup.string().email("Invalid email format").optional(),
});

export const userIdSchema = yup.object({
  id: yup
    .number()
    .positive("ID must be a positive number")
    .required("ID is required"),
});

// Product validation schemas
export const createProductSchema = yup.object({
  name: yup
    .string()
    .required("Product name is required")
    .min(2, "Name must be at least 2 characters"),
  description: yup.string().optional(),
  price: yup
    .string()
    .required("Price is required")
    .matches(/^\d+(\.\d{1,2})?$/, "Price must be a valid decimal number"),
  userId: yup
    .number()
    .positive("User ID must be a positive number")
    .required("User ID is required"),
});

export const updateProductSchema = yup.object({
  name: yup.string().optional().min(2, "Name must be at least 2 characters"),
  description: yup.string().optional(),
  price: yup
    .string()
    .optional()
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
