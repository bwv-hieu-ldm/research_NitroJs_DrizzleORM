import { createError, getRouterParam, H3Event } from "h3";
import { UserRole } from "../../common/enums";
import { AuthenticatedUser } from "./auth.middleware";

export function requireRole<T = unknown>(allowedRoles: UserRole[]) {
  return (handler: (event: H3Event, user: AuthenticatedUser) => Promise<T>) => {
    return async (event: H3Event, user: AuthenticatedUser): Promise<T> => {
      if (!allowedRoles.includes(user.role as UserRole)) {
        throw createError({
          statusCode: 403,
          statusMessage: "Insufficient permissions",
        });
      }
      return handler(event, user);
    };
  };
}

export function requireAdmin<T = unknown>(
  handler: (event: H3Event, user: AuthenticatedUser) => Promise<T>
) {
  return requireRole<T>([UserRole.ADMIN])(handler);
}

export function requireModerator<T = unknown>(
  handler: (event: H3Event, user: AuthenticatedUser) => Promise<T>
) {
  return requireRole<T>([UserRole.ADMIN, UserRole.MODERATOR])(handler);
}

export function requireUser<T = unknown>(
  handler: (event: H3Event, user: AuthenticatedUser) => Promise<T>
) {
  return requireRole<T>([UserRole.ADMIN, UserRole.MODERATOR, UserRole.USER])(
    handler
  );
}

export function requireOwnership<T, R = unknown>(
  resourceGetter: (id: number) => Promise<T | null>,
  resourceUserIdField: keyof T
) {
  return (
    handler: (
      event: H3Event,
      user: AuthenticatedUser,
      resource: T
    ) => Promise<R>
  ) => {
    return async (event: H3Event, user: AuthenticatedUser): Promise<R> => {
      const id = getRouterParam(event, "id");
      if (!id) {
        throw createError({
          statusCode: 400,
          statusMessage: "Resource ID is required",
        });
      }

      const resource = await resourceGetter(parseInt(id));
      if (!resource) {
        throw createError({
          statusCode: 404,
          statusMessage: "Resource not found",
        });
      }

      if (
        user.role !== UserRole.ADMIN &&
        resource[resourceUserIdField] !== user.userId
      ) {
        throw createError({
          statusCode: 403,
          statusMessage: "Access denied to this resource",
        });
      }

      return handler(event, user, resource);
    };
  };
}
