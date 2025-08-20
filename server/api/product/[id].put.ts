import { defineEventHandler, getRouterParam, readBody } from "h3";
import { ProductService } from "../../db/product.service";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const data = await readBody(event);
  return await ProductService.update(Number(id), data);
});
