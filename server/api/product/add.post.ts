import { defineEventHandler, readBody, createError } from "h3";
import { ProductService } from "../../services/product.service";
import { createProductSchema } from "../../validation/schemas";
import * as yup from "yup";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    // Validate request body
    await createProductSchema.validate(data, { abortEarly: false });

    return await ProductService.create(data);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation Error",
        data: {
          message: "Invalid request body",
          errors: error.errors,
        },
      });
    }
    throw error;
  }
});
