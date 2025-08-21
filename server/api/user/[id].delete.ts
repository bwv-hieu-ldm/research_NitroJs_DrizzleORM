import { defineEventHandler, getRouterParam } from "h3";
import { UserService } from "../../services/user.service";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  return await UserService.delete(Number(id));
});
