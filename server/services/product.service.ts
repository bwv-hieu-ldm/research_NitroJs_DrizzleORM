import { ProductRepository } from "../repo/product.repository";
import { InsertProduct } from "../schema/product";

const productRepo = new ProductRepository();

export const ProductService = {
  create: (data: Omit<InsertProduct, "id" | "created_at">) =>
    productRepo.create(data),
  getById: (id: number) => productRepo.findById(id),
  getAll: () => productRepo.findAll(),
  getByUserId: (userId: number) => productRepo.findByUserId(userId),
  update: (id: number, data: Partial<InsertProduct>) =>
    productRepo.update(id, data),
  delete: (id: number) => productRepo.delete(id),
};
