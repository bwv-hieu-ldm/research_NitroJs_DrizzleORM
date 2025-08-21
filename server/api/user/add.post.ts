import { defineEventHandler, readBody, createError } from "h3";
import { UserService } from "../../services/user.service";
import { createUserSchema } from "../../validation/schemas";
import * as yup from "yup";

export default defineEventHandler(async (event) => {
  try {
    const data = await readBody(event);

    // Validate request body
    await createUserSchema.validate(data, { abortEarly: false });

    return await UserService.create(data);
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
