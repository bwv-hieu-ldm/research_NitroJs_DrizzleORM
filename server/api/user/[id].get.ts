import { UserService } from "../../services/user.service";
import { userIdSchema } from "../../validation/schemas";
import { withValidation } from "../../utils/validation-wrapper";

export default withValidation(
  { params: userIdSchema },
  async (event, validatedData) => {
    return await UserService.getById(validatedData.params.id);
  }
);
