import { defineEventHandler } from "h3";
import { UserService } from "../../db/user.service";

export default defineEventHandler(async (event) => {
  return await UserService.getAll();
});
