import {
  defineEventHandler,
  readBody,
  getRouterParam,
  getQuery,
  createError,
} from "h3";
import * as yup from "yup";

export function validateBody(schema: yup.ObjectSchema<any>) {
  return defineEventHandler(async (event) => {
    try {
      const body = await readBody(event);
      await schema.validate(body, { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw createError({
          statusCode: 400,
          statusMessage: "Validation Error",
          data: {
            message: "Invalid request body",
            errors: error.errors,
          },
        });
      }
      throw error;
    }
  });
}

export function validateParams(schema: yup.ObjectSchema<any>) {
  return defineEventHandler(async (event) => {
    try {
      const params = {
        id: getRouterParam(event, "id")
          ? Number(getRouterParam(event, "id"))
          : undefined,
      };
      await schema.validate(params, { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw createError({
          statusCode: 400,
          statusMessage: "Validation Error",
          data: {
            message: "Invalid request parameters",
            errors: error.errors,
          },
        });
      }
      throw error;
    }
  });
}

export function validateQuery(schema: yup.ObjectSchema<any>) {
  return defineEventHandler(async (event) => {
    try {
      const query = getQuery(event);
      const transformedQuery = {
        ...query,
        userId: query.userId ? Number(query.userId) : undefined,
      };
      await schema.validate(transformedQuery, { abortEarly: false });
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        throw createError({
          statusCode: 400,
          statusMessage: "Validation Error",
          data: {
            message: "Invalid query parameters",
            errors: error.errors,
          },
        });
      }
      throw error;
    }
  });
}
