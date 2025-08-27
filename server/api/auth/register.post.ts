import { createError, defineEventHandler, readBody } from "h3";
import { AuthService } from "../../services/auth.service";
import { object, string, ValidationError } from "yup";
import { UserRole, getAllUserRoles } from "../../common/enums";

const registerSchema = object({
  name: string().min(2).max(255).required(),
  email: string().email().required(),
  password: string().min(6).required(),
  role: string().oneOf(getAllUserRoles()).default(UserRole.USER),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    const validatedData = await registerSchema.validate(body);

    const authService = new AuthService();
    const result = await authService.register(validatedData);

    return {
      success: true,
      data: result,
    };
  } catch (error: unknown) {
    if (error instanceof ValidationError) {
      throw createError({
        statusCode: 400,
        statusMessage: "Validation error",
        message: error.message,
      });
    }

    throw error;
  }
});
