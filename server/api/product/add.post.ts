import { defineEventHandler, readBody } from "h3";
import { ProductService } from "../../db/product.service";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  return await ProductService.create(data);
});
