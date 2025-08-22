import { defineEventHandler, createError, H3Event } from "h3";
import * as yup from "yup";
import { HTTP_STATUS, ERROR_MESSAGES } from "../common/constants";

interface ValidationSchemas {
  body?: yup.ObjectSchema<any>;
  params?: yup.ObjectSchema<any>;
  query?: yup.ObjectSchema<any>;
}

interface ValidatedData {
  body?: any;
  params?: any;
  query?: any;
}

type ValidationHandler<T = any> = (
  event: H3Event,
  validatedData: ValidatedData
) => Promise<T>;

export function withValidation<T = any>(
  validationSchemas: ValidationSchemas,
  handler: ValidationHandler<T>
) {
  return defineEventHandler(async (event: H3Event) => {
    try {
      const validatedData: ValidatedData = {};

      if (validationSchemas.body) {
        const { readBody } = await import("h3");
        const body = await readBody(event);
        validatedData.body = await validationSchemas.body.validate(body, {
          abortEarly: false,
        });
      }

      if (validationSchemas.params) {
        const { getRouterParam } = await import("h3");
        const id = getRouterParam(event, "id");
        const params = { id: id ? Number(id) : undefined };
        validatedData.params = await validationSchemas.params.validate(params, {
          abortEarly: false,
        });
      }

      if (validationSchemas.query) {
        const { getQuery } = await import("h3");
        const query = getQuery(event);
        const transformedQuery = {
          ...query,
          userId: query.userId ? Number(query.userId) : undefined,
        };
        validatedData.query = await validationSchemas.query.validate(
          transformedQuery,
          { abortEarly: false }
        );
      }

      return await handler(event, validatedData);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw createError({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          statusMessage: "Validation Error",
          data: {
            message: ERROR_MESSAGES.VALIDATION_ERROR,
            errors: error.errors,
          },
        });
      }
      throw error;
    }
  });
}
