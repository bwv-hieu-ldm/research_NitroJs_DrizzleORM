import { createError, getRouterParam, H3Event } from "h3";
import { UserRole } from "../../schema/user";
import { AuthenticatedUser } from "./auth.middleware";

export function requireRole(allowedRoles: UserRole[]) {
  return (
    handler: (event: H3Event, user: AuthenticatedUser) => Promise<any>
  ) => {
    return async (event: H3Event, user: AuthenticatedUser) => {
      if (!allowedRoles.includes(user.role)) {
        throw createError({
          statusCode: 403,
          statusMessage: "Insufficient permissions",
        });
      }
      return handler(event, user);
    };
  };
}

export function requireAdmin(
  handler: (event: H3Event, user: AuthenticatedUser) => Promise<any>
) {
  return requireRole(["admin"])(handler);
}

export function requireModerator(
  handler: (event: H3Event, user: AuthenticatedUser) => Promise<any>
) {
  return requireRole(["admin", "moderator"])(handler);
}

export function requireUser(
  handler: (event: H3Event, user: AuthenticatedUser) => Promise<any>
) {
  return requireRole(["admin", "moderator", "user"])(handler);
}

// Resource ownership check middleware
export function requireOwnership<T>(
  resourceGetter: (id: number) => Promise<T | null>,
  resourceUserIdField: keyof T
) {
  return (
    handler: (
      event: H3Event,
      user: AuthenticatedUser,
      resource: T
    ) => Promise<any>
  ) => {
    return async (event: H3Event, user: AuthenticatedUser) => {
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

      // Check if user owns the resource or is admin
      if (
        user.role !== "admin" &&
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
