import { createError, defineEventHandler, readBody } from "h3";
import { ProductService } from "../../services/product.service";
import { object, string, ValidationError } from "yup";
import { requireAuth } from "../../utils/middleware/auth.middleware";
import { requireUser } from "../../utils/middleware/authorization.middleware";

const createProductSchema = object({
  name: string().min(2).max(255).required(),
  description: string().optional(),
  price: string().required(),
});

export default defineEventHandler(
  requireAuth(
    requireUser(async (event, user) => {
      try {
        const body = await readBody(event);

        const validatedData = await createProductSchema.validate(body);

        const result = await ProductService.create({
          ...validatedData,
          userId: user.userId,
        });

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
    })
  )
);
