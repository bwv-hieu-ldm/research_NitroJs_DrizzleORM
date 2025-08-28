import { InsertUser } from "../schema/user";
import { UserRepository } from "../repo/user.repository";

const userRepo = new UserRepository();

export const UserService = {
  create: (data: InsertUser) => userRepo.create(data),
  getById: (id: number) => userRepo.findById(id),
  getAll: () => userRepo.findAll(),
  update: (id: number, data: Partial<InsertUser>) => userRepo.update(id, data),
  delete: (id: number) => userRepo.delete(id),
};
