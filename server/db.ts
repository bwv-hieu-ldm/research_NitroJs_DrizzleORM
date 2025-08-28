import { dbContext } from "./db/context";

export const getDb = () => dbContext.getDb();

export const db = dbContext.getDb();

export const setupDatabase = async () => {
  await dbContext.initialize();
};

export { dbContext };
