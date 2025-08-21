import { UserService } from "../../services/user.service";
import { createUserSchema } from "../../validation/schemas";
import { withValidation } from "../../utils/validation-wrapper";

export default withValidation(
  { body: createUserSchema },
  async (event, validatedData) => {
    return await UserService.create(validatedData.body);
  }
);
