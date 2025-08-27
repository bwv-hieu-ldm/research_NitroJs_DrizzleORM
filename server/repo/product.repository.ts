import { products, InsertProduct, SelectProduct } from "../schema/product";
import { eq } from "drizzle-orm";
import { users, SelectUser } from "../schema/user";
import { BaseRepository } from "./base.repository";

type UserForProduct = Pick<
  SelectUser,
  "id" | "name" | "email" | "role" | "createdAt" | "updatedAt"
>;

export type ProductWithUser = SelectProduct & {
  user: UserForProduct | null;
};

export class ProductRepository extends BaseRepository {
  async create(
    product: Omit<InsertProduct, "id" | "createdAt" | "updatedAt">
  ): Promise<SelectProduct> {
    return this.executeQuery(async () => {
      const [result] = await this.db.insert(products).values(product);
      const [createdProduct] = await this.db
        .select()
        .from(products)
        .where(eq(products.id, result.insertId))
        .limit(1);
      return createdProduct;
    }, "create product");
  }

  async findById(id: number): Promise<ProductWithUser[]> {
    return this.executeQuery(async () => {
      const results = await this.db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          userId: products.userId,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
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
        updatedAt: result.updatedAt,
        user: result.user,
      }));
    }, "find product by ID");
  }

  async findAll(): Promise<ProductWithUser[]> {
    return this.executeQuery(async () => {
      const results = await this.db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          userId: products.userId,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
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
        updatedAt: result.updatedAt,
        user: result.user,
      }));
    }, "find all products");
  }

  async findByUserId(userId: number): Promise<ProductWithUser[]> {
    return this.executeQuery(async () => {
      const results = await this.db
        .select({
          id: products.id,
          name: products.name,
          description: products.description,
          price: products.price,
          userId: products.userId,
          createdAt: products.createdAt,
          updatedAt: products.updatedAt,
          user: {
            id: users.id,
            name: users.name,
            email: users.email,
            role: users.role,
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
        updatedAt: result.updatedAt,
        user: result.user,
      }));
    }, "find products by user ID");
  }

  async update(id: number, product: Partial<InsertProduct>): Promise<void> {
    const { createdAt, updatedAt, id: productId, ...updateData } = product;

    return this.executeQuery(async () => {
      await this.db
        .update(products)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(products.id, id));
    }, "update product");
  }

  async delete(id: number): Promise<void> {
    return this.executeQuery(async () => {
      await this.db.delete(products).where(eq(products.id, id));
    }, "delete product");
  }
}
