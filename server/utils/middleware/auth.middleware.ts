import { createError, getHeader, H3Event } from "h3";
import { AuthService, JwtPayload } from "../../services/auth.service";

export interface AuthenticatedUser extends JwtPayload {}

export async function authenticateUser(
  event: H3Event
): Promise<AuthenticatedUser> {
  const authHeader = getHeader(event, "authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw createError({
      statusCode: 401,
      statusMessage: "Missing or invalid authorization header",
    });
  }

  const token = authHeader.substring(7); // Remove "Bearer " prefix
  const authService = new AuthService();

  try {
    const payload = authService.verifyToken(token);
    return payload;
  } catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: "Invalid or expired token",
    });
  }
}

export function requireAuth(
  handler: (event: H3Event, user: AuthenticatedUser) => Promise<any>
) {
  return async (event: H3Event) => {
    const user = await authenticateUser(event);
    return handler(event, user);
  };
}
