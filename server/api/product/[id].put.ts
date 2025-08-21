import { ProductService } from "../../services/product.service";
import { productIdSchema, updateProductSchema } from "../../validation/schemas";
import { withValidation } from "../../utils/validation-wrapper";

export default withValidation(
  { params: productIdSchema, body: updateProductSchema },
  async (event, validatedData) => {
    return await ProductService.update(
      validatedData.params.id,
      validatedData.body
    );
  }
);
