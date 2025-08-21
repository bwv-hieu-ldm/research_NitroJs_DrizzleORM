import { defineEventHandler } from "h3";

export default defineEventHandler((event) => {
  if (event.res.statusCode >= 400 && event.res.statusCode < 600) {
    if (event.res.statusCode === 404) {
      // For a 404 error
      event.res.end("<h1>404 - Not Found</h1>");
    } else {
      // For other errors
      event.res.end("<h1>Error</h1>");
    }
  }
});
