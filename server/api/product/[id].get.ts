import { createError, defineEventHandler, getRouterParam } from "h3";
import { ProductService } from "../../services/product.service";
import { requireAuth } from "../../utils/middleware/auth.middleware";
import { requireUser } from "../../utils/middleware/authorization.middleware";

export default defineEventHandler(
  requireAuth(
    requireUser(async (event, user) => {
      const id = getRouterParam(event, "id");
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: "Product ID is required",
        });
      }

      const result = await ProductService.getById(parseInt(id));

      if (!result || result.length === 0) {
        throw createError({
          statusCode: 404,
          statusMessage: "Product not found",
        });
      }

      return {
        success: true,
        data: result[0],
      };
    })
  )
);
