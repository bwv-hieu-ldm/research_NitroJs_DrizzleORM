export enum UserRole {
  USER = "user",
  MODERATOR = "moderator",
  ADMIN = "admin",
}

export const getAllUserRoles = (): string[] => Object.values(UserRole);

export const isValidUserRole = (role: string): role is UserRole =>
  Object.values(UserRole).includes(role as UserRole);

export const getDefaultUserRole = (): UserRole => UserRole.USER;
