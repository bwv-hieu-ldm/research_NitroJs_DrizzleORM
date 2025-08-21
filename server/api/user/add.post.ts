import { defineEventHandler, readBody } from "h3";
import { UserService } from "../../services/user.service";

export default defineEventHandler(async (event) => {
  const data = await readBody(event);
  return await UserService.create(data);
});
