import { createError, defineEventHandler, readBody } from "h3";
import { AuthService, LoginCredentials } from "../../services/auth.service";
import { object, string } from "yup";

const loginSchema = object({
  email: string().email().required(),
  password: string().min(6).required(),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const validatedData = await loginSchema.validate(body);

    const authService = new AuthService();
    const result = await authService.login(validatedData as LoginCredentials);

    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    if (error.name === "ValidationError") {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation error",
        message: error.message,
      });
    }

    throw error;
  }
});
