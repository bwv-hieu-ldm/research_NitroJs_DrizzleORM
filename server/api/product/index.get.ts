import { defineEventHandler } from "h3";
import { ProductService } from "../../services/product.service";

export default defineEventHandler(async (event) => {
  return await ProductService.getAll();
});
