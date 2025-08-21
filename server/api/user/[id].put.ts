import { defineEventHandler, getRouterParam, readBody, createError } from "h3";
import { UserService } from "../../services/user.service";
import { userIdSchema, updateUserSchema } from "../../validation/schemas";
import * as yup from "yup";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    const data = await readBody(event);

    // Validate route parameters
    const params = { id: id ? Number(id) : undefined };
    await userIdSchema.validate(params, { abortEarly: false });

    // Validate request body
    await updateUserSchema.validate(data, { abortEarly: false });

    return await UserService.update(Number(id), data);
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation Error",
        data: {
          message: "Invalid request data",
          errors: error.errors,
        },
      });
    }
    throw error;
  }
});
