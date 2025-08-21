import { ProductService } from "../../services/product.service";
import { productIdSchema } from "../../validation/schemas";
import { withValidation } from "../../utils/validation-wrapper";

export default withValidation(
  { params: productIdSchema },
  async (event, validatedData) => {
    return await ProductService.delete(validatedData.params.id);
  }
);
