import { defineEventHandler, getQuery, createError } from "h3";
import { ProductService } from "../../services/product.service";
import { userIdQuerySchema } from "../../validation/schemas";
import * as yup from "yup";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // Validate query parameters
    const transformedQuery = {
      userId: query.userId ? Number(query.userId) : undefined,
    };
    await userIdQuerySchema.validate(transformedQuery, { abortEarly: false });

    return await ProductService.getByUserId(Number(query.userId));
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation Error",
        data: {
          message: "Invalid query parameters",
          errors: error.errors,
        },
      });
    }
    throw error;
  }
});
