import { InsertUser, users } from "../schema/user";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { createError, H3Error } from "h3";
import { CONFLICT_ERROR } from "../common/error";

export class UserRepository {
  async create(user: InsertUser) {
    try {
      const foundUser = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email))
        .limit(1);
      if (foundUser.length) throw CONFLICT_ERROR("User already exists");
      const [result] = await db.insert(users).values(user);
      return result;
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

  async findById(id: number) {
    return db.select().from(users).where(eq(users.id, id)).limit(1);
  }

  async findAll() {
    return db.select().from(users);
  }

  async update(id: number, user: Partial<InsertUser>) {
    return db.update(users).set(user).where(eq(users.id, id));
  }

  async delete(id: number) {
    return db.delete(users).where(eq(users.id, id));
  }
}
