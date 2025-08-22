import { getDb } from "../db";
import { products, InsertProduct, SelectProduct } from "../schema/product";
import { eq } from "drizzle-orm";
import { users, SelectUser } from "../schema/user";
import { BaseRepository } from "./base.repository";

export type ProductWithUser = SelectProduct & {
  user: SelectUser | null;
};

export class ProductRepository extends BaseRepository {
  async create(
    product: Omit<InsertProduct, "id" | "createdAt">
  ): Promise<SelectProduct> {
    return this.executeQuery(async () => {
      const db = getDb();
      const [result] = await db.insert(products).values(product);
      // Fetch the created product to return the full object
      const [createdProduct] = await db
        .select()
        .from(products)
        .where(eq(products.id, result.insertId))
        .limit(1);
      return createdProduct;
    }, "create product");
  }

  async findById(id: number): Promise<ProductWithUser[]> {
    return this.executeQuery(async () => {
      const db = getDb();
      const results = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          userId: products.userId,
          createdAt: products.createdAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          },
        })
        .from(products)
        .leftJoin(users, eq(products.userId, users.id))
        .where(eq(products.id, id))
        .limit(1);

      return results.map((result) => ({
        id: result.id,
        name: result.name,
        description: result.description,
        price: result.price,
        userId: result.userId,
        createdAt: result.createdAt,
        user: result.user,
      }));
    }, "find product by ID");
  }

  async findAll(): Promise<ProductWithUser[]> {
    return this.executeQuery(async () => {
      const db = getDb();
      const results = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          userId: products.userId,
          createdAt: products.createdAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          },
        })
        .from(products)
        .leftJoin(users, eq(products.userId, users.id));

      return results.map((result) => ({
        id: result.id,
        name: result.name,
        description: result.description,
        price: result.price,
        userId: result.userId,
        createdAt: result.createdAt,
        user: result.user,
      }));
    }, "find all products");
  }

  async findByUserId(userId: number): Promise<ProductWithUser[]> {
    return this.executeQuery(async () => {
      const db = getDb();
      const results = await db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          userId: products.userId,
          createdAt: products.createdAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          },
        })
        .from(products)
        .leftJoin(users, eq(products.userId, users.id))
        .where(eq(products.userId, userId));

      return results.map((result) => ({
        id: result.id,
        name: result.name,
        description: result.description,
        price: result.price,
        userId: result.userId,
        createdAt: result.createdAt,
        user: result.user,
      }));
    }, "find products by user ID");
  }

  async update(id: number, product: Partial<InsertProduct>): Promise<void> {
    return this.executeQuery(async () => {
      const db = getDb();
      await db.update(products).set(product).where(eq(products.id, id));
    }, "update product");
  }

  async delete(id: number): Promise<void> {
    return this.executeQuery(async () => {
      const db = getDb();
      await db.delete(products).where(eq(products.id, id));
    }, "delete product");
  }
}
