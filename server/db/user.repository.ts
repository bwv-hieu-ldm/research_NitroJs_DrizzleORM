import { InsertUser, users } from "../schema/user";
import { db } from "../db";
import { eq } from "drizzle-orm";

export class UserRepository {
  async create(user: InsertUser) {
    const [result] = await db.insert(users).values(user);
    return result;
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
