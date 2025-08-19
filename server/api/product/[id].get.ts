import { defineEventHandler, getRouterParam } from "h3";
import { ProductService } from "../../db/product.service";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return await ProductService.getById(Number(id));
});
