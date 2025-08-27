import { InsertUser, users, SelectUser } from "../schema/user";
import { and, eq } from "drizzle-orm";
import { createError, H3Error } from "h3";
import { CONFLICT_ERROR, NOT_FOUND_ERROR } from "../common/error";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository {
  async create(
    user: Omit<InsertUser, "id" | "createdAt" | "updatedAt">
  ): Promise<SelectUser> {
    try {
      const foundUser = await this.db
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1);
      if (foundUser.length) throw CONFLICT_ERROR("User already exists");

      const [result] = await this.db.insert(users).values(user);
      // Fetch the created user to return the full object
      const [createdUser] = await this.db
        .select()
        .from(users)
        .where(eq(users.id, result.insertId))
        .limit(1);
      return createdUser;
    } catch (error) {
      if (error instanceof H3Error) {
        throw error;
      }
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create user",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  async findById(id: number): Promise<SelectUser | null> {
    return this.executeQuery(async () => {
      const result = await this.db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return result[0] || null;
    }, "find user by ID");
  }

  async findByEmail(email: string): Promise<SelectUser | null> {
    return this.executeQuery(async () => {
      const result = await this.db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);
      return result[0] || null;
    }, "find user by email");
  }

  async findAll(): Promise<SelectUser[]> {
    return this.executeQuery(async () => {
      return await this.db.select().from(users);
    }, "find all users");
  }

  async update(id: number, user: Partial<InsertUser>): Promise<void> {
    // Check if user exists
    const foundUser = await this.findById(id);
    if (!foundUser) throw NOT_FOUND_ERROR("User not found");

    // Check for email conflict only if email is being updated
    if (user.email && user.email !== foundUser.email) {
      const existingUserWithEmail = await this.executeQuery(async () => {
        return this.db
          .select()
          .from(users)
          .where(eq(users.email, user.email!))
          .limit(1);
      }, "check email conflict");

      if (existingUserWithEmail.length > 0) {
        throw CONFLICT_ERROR("Email already exists");
      }
    }

    // Perform update
    return this.executeQuery(async () => {
      await this.db.update(users).set(user).where(eq(users.id, id));
    }, "update user");
  }

  async delete(id: number): Promise<void> {
    return this.executeQuery(async () => {
      await this.db.delete(users).where(eq(users.id, id));
    }, "delete user");
  }
}
