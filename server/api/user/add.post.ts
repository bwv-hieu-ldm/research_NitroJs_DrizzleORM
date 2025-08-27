import { createError, defineEventHandler, readBody } from "h3";
import { UserService } from "../../services/user.service";
import { object, string } from "yup";
import { requireAuth } from "../../utils/middleware/auth.middleware";
import { requireAdmin } from "../../utils/middleware/authorization.middleware";

const createUserSchema = object({
  name: string().min(2).max(255).required(),
  email: string().email().required(),
  password: string().min(6).required(),
  role: string().oneOf(["user", "moderator", "admin"]).default("user"),
});

export default defineEventHandler(
  requireAuth(
    requireAdmin(async (event, user) => {
      try {
        const body = await readBody(event);

        // Validate input
        const validatedData = await createUserSchema.validate(body);

        const result = await UserService.create(validatedData);

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
    })
  )
);
