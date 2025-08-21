import { ProductService } from "../../services/product.service";
import { createProductSchema } from "../../validation/schemas";
import { withValidation } from "../../utils/validation-wrapper";

export default withValidation(
  { body: createProductSchema },
  async (event, validatedData) => {
    return await ProductService.create(validatedData.body);
  }
);
