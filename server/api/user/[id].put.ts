import { defineEventHandler, getRouterParam, readBody } from "h3";
import { UserService } from "../../services/user.service";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const data = await readBody(event);
  return await UserService.update(Number(id), data);
});
