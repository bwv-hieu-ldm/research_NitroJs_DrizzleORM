import { defineEventHandler } from "h3";
import { SelectProduct } from "../../schema/product";
import { requireAuth } from "../../utils/middleware/auth.middleware";
import { requireOwnership } from "../../utils/middleware/authorization.middleware";
import { ProductService } from "../../services/product.service";

export default defineEventHandler(
  requireAuth(
    requireOwnership(async (id: number) => {
      const product = await ProductService.getById(id);
      return product[0] || null;
    }, "userId")(async (event, user, product: SelectProduct) => {
      await ProductService.delete(product.id);

      return {
        success: true,
        message: "Product deleted successfully",
      };
    })
  )
);
