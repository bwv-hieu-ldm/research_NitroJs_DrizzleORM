import { UserService } from "../../services/user.service";
import { userIdSchema, updateUserSchema } from "../../validation/schemas";
import { withValidation } from "../../utils/validation-wrapper";

export default withValidation(
  { params: userIdSchema, body: updateUserSchema },
  async (event, validatedData) => {
    return await UserService.update(
      validatedData.params.id,
      validatedData.body
    );
  }
);
