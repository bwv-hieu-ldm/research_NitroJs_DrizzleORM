import { defineEventHandler } from "h3";
import { UserService } from "../../services/user.service";

export default defineEventHandler(async (event) => {
  return await UserService.getAll();
});
