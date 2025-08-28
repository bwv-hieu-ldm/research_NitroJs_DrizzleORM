import { createError, defineEventHandler, getQuery } from "h3";
import { ProductService } from "../../services/product.service";
import { requireAuth } from "../../utils/middleware/auth.middleware";
import { requireUser } from "../../utils/middleware/authorization.middleware";

export default defineEventHandler(
  requireAuth(
    requireUser(async (event, user) => {
      const query = getQuery(event);
      const userId = query.userId;

      if (!userId) {
        throw createError({
          statusCode: 400,
          statusMessage: "User ID is required",
        });
      }

      const userIdNum = parseInt(userId as string);
      if (isNaN(userIdNum)) {
        throw createError({
          statusCode: 400,
          statusMessage: "Invalid user ID format",
        });
      }

      const result = await ProductService.getByUserId(userIdNum);

      return {
        success: true,
        data: result,
      };
    })
  )
);
