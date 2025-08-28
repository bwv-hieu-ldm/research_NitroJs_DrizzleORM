import { createError, defineEventHandler, getRouterParam } from "h3";
import { UserService } from "../../services/user.service";
import { requireAuth } from "../../utils/middleware/auth.middleware";
import { requireUser } from "../../utils/middleware/authorization.middleware";

export default defineEventHandler(
  requireAuth(
    requireUser(async (event, user) => {
      const id = getRouterParam(event, "id");
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: "User ID is required",
        });
      }

      const result = await UserService.getById(parseInt(id));

      if (!result) {
        throw createError({
          statusCode: 404,
          statusMessage: "User not found",
        });
      }

      return {
        success: true,
        data: result,
      };
    })
  )
);
