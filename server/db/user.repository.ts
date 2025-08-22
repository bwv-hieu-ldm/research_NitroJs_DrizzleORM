import { InsertUser, users, SelectUser } from "../schema/user";
import { db, getDb } from "../db";
import { and, eq } from "drizzle-orm";
import { createError, H3Error } from "h3";
import { CONFLICT_ERROR, NOT_FOUND_ERROR } from "../common/error";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository {
  async create(
    user: Omit<InsertUser, "id" | "createdAt" | "updatedAt">
  ): Promise<SelectUser> {
    try {
      const db = getDb();
      const foundUser = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1);
      if (foundUser.length) throw CONFLICT_ERROR("User already exists");

      const [result] = await db.insert(users).values(user);
      // Fetch the created user to return the full object
      const [createdUser] = await db
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
      const db = getDb();
      const result = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return result[0] || null;
    }, "find user by ID");
  }

  async findAll(): Promise<SelectUser[]> {
    return this.executeQuery(async () => {
      const db = getDb();
      return await db.select().from(users);
    }, "find all users");
  }

  async update(id: number, user: Partial<InsertUser>): Promise<void> {
    // Check if user exists
    const foundUser = await this.findById(id);
    if (!foundUser) throw NOT_FOUND_ERROR("User not found");

    // Check for email conflict only if email is being updated
    if (user.email && user.email !== foundUser.email) {
      const existingUserWithEmail = await this.executeQuery(async () => {
        const db = getDb();
        return db
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
      const db = getDb();
      await db.update(users).set(user).where(eq(users.id, id));
    }, "update user");
  }

  async delete(id: number): Promise<void> {
    return this.executeQuery(async () => {
      const db = getDb();
      await db.delete(users).where(eq(users.id, id));
    }, "delete user");
  }
}
