import { defineEventHandler, getRouterParam, createError } from "h3";
import { UserService } from "../../services/user.service";
import { userIdSchema } from "../../validation/schemas";
import * as yup from "yup";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    // Validate route parameters
    const params = { id: id ? Number(id) : undefined };
    await userIdSchema.validate(params, { abortEarly: false });

    return await UserService.delete(Number(id));
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation Error",
        data: {
          message: "Invalid request parameters",
          errors: error.errors,
        },
      });
    }
    throw error;
  }
});
