import { createError, H3Error } from "h3";
import { INTERNAL_SERVER_ERROR } from "../common/error";

export abstract class BaseRepository {
  protected handleError(error: unknown, operation: string): never {
    if (error instanceof H3Error) {
      throw error;
    }

    throw INTERNAL_SERVER_ERROR(
      `Failed to ${operation}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }

  protected async executeQuery<T>(
    queryFn: () => Promise<T>,
    operation: string
  ): Promise<T> {
    try {
      return await queryFn();
    } catch (error) {
      this.handleError(error, operation);
    }
  }
}
