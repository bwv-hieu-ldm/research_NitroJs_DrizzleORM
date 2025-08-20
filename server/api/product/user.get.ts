import { defineEventHandler, getQuery } from "h3";
import { ProductService } from "../../db/product.service";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const userId = query.userId as string;
  return await ProductService.getByUserId(Number(userId));
});
