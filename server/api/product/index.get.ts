import { defineEventHandler } from "h3";
import { ProductService } from "../../db/product.service";

export default defineEventHandler(async (event) => {
  return await ProductService.getAll();
});
