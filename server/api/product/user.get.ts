import { ProductService } from "../../services/product.service";
import { userIdQuerySchema } from "../../validation/schemas";
import { withValidation } from "../../utils/validation-wrapper";

export default withValidation(
  { query: userIdQuerySchema },
  async (event, validatedData) => {
    return await ProductService.getByUserId(validatedData.query.userId);
  }
);
