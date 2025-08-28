import { createError, defineEventHandler, getRouterParam } from "h3";
import { UserService } from "../../services/user.service";
import { requireAuth } from "../../utils/middleware/auth.middleware";
import { requireAdmin } from "../../utils/middleware/authorization.middleware";

export default defineEventHandler(
  requireAuth(
    requireAdmin(async (event, user) => {
      const id = getRouterParam(event, "id");
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: "User ID is required",
        });
      }

      await UserService.delete(parseInt(id));

      return {
        success: true,
        message: "User deleted successfully",
      };
    })
  )
);
