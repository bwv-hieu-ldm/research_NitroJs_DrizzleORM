import { H3Error } from "h3";
import { INTERNAL_SERVER_ERROR } from "./error";
export const withErrorHandler = <T extends (...args: any[]) => Promise<any>>(
  fn: T
): ((...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>) => {
  return async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof H3Error) {
        throw error;
      }
      throw INTERNAL_SERVER_ERROR();
    }
  };
};
