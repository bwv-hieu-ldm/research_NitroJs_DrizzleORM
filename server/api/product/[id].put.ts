import { ProductService } from "../../services/product.service";
import { object, string } from "yup";
import { requireAuth } from "../../utils/middleware/auth.middleware";
import { requireOwnership } from "../../utils/middleware/authorization.middleware";
import { SelectProduct } from "../../schema/product";
import { createError, defineEventHandler, readBody } from "h3";

const updateProductSchema = object({
  name: string().min(2).max(255).optional(),
  description: string().optional(),
  price: string().optional(),
});

export default defineEventHandler(
  requireAuth(
    requireOwnership(async (id: number) => {
      const product = await ProductService.getById(id);
      return product[0] || null;
    }, "userId")(async (event, user, product: SelectProduct) => {
      try {
        const body = await readBody(event);

        const validatedData = await updateProductSchema.validate(body);

        await ProductService.update(product.id, validatedData);

        return {
          success: true,
          message: "Product updated successfully",
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
