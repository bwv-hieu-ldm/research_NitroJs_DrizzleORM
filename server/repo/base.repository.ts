import { createError, H3Error } from "h3";
import { DatabaseContext } from "../db/context";

export abstract class BaseRepository {
  protected db: ReturnType<typeof DatabaseContext.prototype.getDb>;

  constructor() {
    this.db = DatabaseContext.getInstance().getDb();
  }

  protected async executeQuery<T>(
    queryFn: () => Promise<T>,
    operation: string
  ): Promise<T> {
    try {
      return await queryFn();
    } catch (error) {
      if (error instanceof H3Error) {
        throw error;
      }
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to ${operation}`,
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }
}
