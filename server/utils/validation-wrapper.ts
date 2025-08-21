import { defineEventHandler, createError } from "h3";
import * as yup from "yup";

export function withValidation(
  validationSchemas: {
    body?: yup.ObjectSchema<any>;
    params?: yup.ObjectSchema<any>;
    query?: yup.ObjectSchema<any>;
  },
  handler: (event: any, validatedData?: any) => Promise<any>
) {
  return defineEventHandler(async (event) => {
    try {
      const validatedData: any = {};

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
          statusCode: 400,
          statusMessage: "Validation Error",
          data: {
            message: "Invalid request data",
            errors: error.errors,
          },
        });
      }
      throw error;
    }
  });
}
