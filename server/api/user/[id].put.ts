import { createError, defineEventHandler, readBody, getRouterParam } from "h3";
import { UserService } from "../../services/user.service";
import { object, string, ValidationError } from "yup";
import { requireAuth } from "../../utils/middleware/auth.middleware";
import { requireUser } from "../../utils/middleware/authorization.middleware";
import { getAllUserRoles } from "../../common/enums";

const updateUserSchema = object({
  name: string().min(2).max(255).optional(),
  email: string().email().optional(),
  role: string().oneOf(getAllUserRoles()).optional(),
});

export default defineEventHandler(
  requireAuth(
    requireUser(async (event, user) => {
      try {
        const id = getRouterParam(event, "id");
        if (!id) {
          throw createError({
            statusCode: 400,
            statusMessage: "User ID is required",
          });
        }

        const body = await readBody(event);

        const validatedData = await updateUserSchema.validate(body);

        await UserService.update(parseInt(id), validatedData);

        return {
          success: true,
          message: "User updated successfully",
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
    })
  )
);
