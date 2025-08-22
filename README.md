# NitroJS + DrizzleORM API Server

A production-ready, scalable API server built with NitroJS and DrizzleORM, featuring comprehensive error handling, validation, and clean architecture patterns.

## 🏗️ Project Architecture

```
research-NitroJs-DrizzleORM/
├── server/                          # Server application code
│   ├── api/                        # API endpoints and route handlers
│   ├── common/                     # Shared utilities and constants
│   ├── db/                         # Database layer and repositories
│   ├── plugins/                    # Nitro server plugins
│   ├── schema/                     # Database schemas and types
│   ├── services/                   # Business logic layer
│   ├── utils/                      # Utility functions and helpers
│   └── validation/                 # Input validation schemas
├── drizzle/                        # Database migration files
├── drizzle.config.ts               # Drizzle ORM configuration
├── nitro.config.ts                 # Nitro server configuration
└── package.json                    # Project dependencies
```

## 📁 Folder Structure & Responsibilities

### **`server/api/`** - API Endpoints

**Purpose**: HTTP route handlers and endpoint definitions
**Responsibilities**:

- Define REST API endpoints (GET, POST, PUT, DELETE)
- Handle HTTP requests and responses
- Apply validation middleware
- Call appropriate services
- Return standardized responses

**Example Structure**:

```
api/
├── product/
│   ├── [id].delete.ts     # DELETE /api/product/:id
│   ├── [id].get.ts        # GET /api/product/:id
│   ├── [id].put.ts        # PUT /api/product/:id
│   ├── add.post.ts         # POST /api/product/add
│   ├── index.get.ts        # GET /api/product
│   └── user.get.ts         # GET /api/product/user
└── user/
    ├── [id].delete.ts      # DELETE /api/user/:id
    ├── [id].get.ts         # GET /api/user/:id
    ├── [id].put.ts         # PUT /api/user/:id
    ├── add.post.ts          # POST /api/user/add
    └── index.get.ts         # GET /api/user
```

### **`server/common/`** - Shared Resources

**Purpose**: Centralized constants, error definitions, and response utilities
**Responsibilities**:

- Define HTTP status codes and error messages
- Provide standardized response formatting
- Centralize configuration constants
- Export common utilities

**Key Files**:

- `constants.ts` - Application-wide constants
- `error.ts` - Error creation utilities
- `response.ts` - Response formatting helpers
- `index.ts` - Clean export interface

### **`server/db/`** - Database Layer

**Purpose**: Database connection management and data access
**Responsibilities**:

- Manage database connections and pooling
- Provide repository pattern implementation
- Handle database errors gracefully
- Ensure type-safe database operations

**Key Components**:

- `connection.ts` - Database connection manager
- `base.repository.ts` - Base repository with error handling
- `product.repository.ts` - Product-specific data operations
- `user.repository.ts` - User-specific data operations

### **`server/plugins/`** - Server Plugins

**Purpose**: Nitro server lifecycle management
**Responsibilities**:

- Initialize database connections
- Set up global error handlers
- Configure server middleware
- Handle startup/shutdown procedures

### **`server/schema/`** - Data Models

**Purpose**: Database schema definitions and TypeScript types
**Responsibilities**:

- Define database table structures
- Generate TypeScript types
- Establish relationships between entities
- Ensure data integrity constraints

### **`server/services/`** - Business Logic

**Purpose**: Application business logic and orchestration
**Responsibilities**:

- Implement business rules
- Coordinate between repositories
- Handle complex operations
- Provide clean API for controllers

### **`server/utils/`** - Utility Functions

**Purpose**: Reusable helper functions and middleware
**Responsibilities**:

- Provide validation wrappers
- Handle common operations
- Implement cross-cutting concerns
- Ensure code reusability

### **`server/validation/`** - Input Validation

**Purpose**: Request data validation and sanitization
**Responsibilities**:

- Define validation schemas
- Ensure data integrity
- Provide meaningful error messages
- Prevent invalid data processing

## 🔄 Request Flow & Response Handling

### **Request Flow Diagram**

```
HTTP Request → Validation → Service → Repository → Database
     ↓              ↓         ↓         ↓          ↓
Response ← Format ← Service ← Repository ← Database Result
```

### **1. Request Validation**

All incoming requests are automatically validated using the `withValidation` wrapper:

```typescript
// Example: User creation endpoint
export default withValidation(
  { body: createUserSchema }, // Validate request body
  async (event, validatedData) => {
    const result = await UserService.create(validatedData.body);
    return wrapResponse(result); // Standardize response
  }
);
```

### **2. Service Layer Processing**

Business logic is handled in the service layer:

```typescript
export const UserService = {
  create: async (data: CreateUserData) => {
    // Business logic here
    const user = await userRepo.create(data);
    return user;
  },
};
```

### **3. Repository Data Access**

Data operations are abstracted through repositories:

```typescript
export class UserRepository extends BaseRepository {
  async create(user: CreateUserData): Promise<User> {
    return this.executeQuery(async () => {
      // Database operation with error handling
      const result = await db.insert(users).values(user);
      return this.findById(result.insertId);
    }, "create user");
  }
}
```

## 📤 Response Formatting

### **Success Response Format**

```typescript
// Standard success response
{
  "success": true,
  "data": { ... },           // Actual response data
  "message": "User created successfully"  // Optional message
}

// Usage in code
return createSuccessResponse(user, "User created successfully");
return wrapResponse(user);  // Shorthand for success response
```

### **Error Response Format**

```typescript
// Standard error response
{
  "success": false,
  "error": "User already exists",
  "statusCode": 409
}

// Usage in code
throw CONFLICT_ERROR("User already exists");
throw INTERNAL_SERVER_ERROR("Database connection failed");
```

### **Validation Error Format**

```typescript
{
  "success": false,
  "error": "Invalid request data",
  "data": {
    "message": "Invalid request data",
    "errors": [
      "Name must be at least 2 characters",
      "Email must be a valid email format"
    ]
  }
}
```

## 🛡️ Error Handling & Wrapper Patterns

### **1. Base Repository Error Wrapper**

The `BaseRepository` class provides automatic error handling for all database operations:

```typescript
export abstract class BaseRepository {
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

  protected handleError(error: unknown, operation: string): never {
    if (error instanceof H3Error) {
      throw error; // Re-throw H3 errors
    }

    // Convert unknown errors to standardized format
    throw INTERNAL_SERVER_ERROR(
      `Failed to ${operation}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
```

### **2. Validation Wrapper**

The `withValidation` wrapper automatically handles validation errors:

```typescript
export function withValidation<T>(
  validationSchemas: ValidationSchemas,
  handler: ValidationHandler<T>
) {
  return defineEventHandler(async (event: H3Event) => {
    try {
      // Validate request data
      const validatedData = await validateRequest(event, validationSchemas);

      // Execute handler with validated data
      return await handler(event, validatedData);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Convert validation errors to standardized format
        throw createError({
          statusCode: HTTP_STATUS.BAD_REQUEST,
          statusMessage: "Validation Error",
          data: {
            message: ERROR_MESSAGES.VALIDATION_ERROR,
            errors: error.errors,
          },
        });
      }
      throw error; // Re-throw other errors
    }
  });
}
```

### **3. Service Layer Error Handling**

Services can implement custom error handling for business logic:

```typescript
export const UserService = {
  create: async (data: CreateUserData) => {
    try {
      // Check if user already exists
      const existingUser = await userRepo.findByEmail(data.email);
      if (existingUser) {
        throw CONFLICT_ERROR("User already exists");
      }

      // Create user
      return await userRepo.create(data);
    } catch (error) {
      // Log error for debugging
      console.error("User creation failed:", error);

      // Re-throw known errors, wrap unknown ones
      if (error instanceof H3Error) {
        throw error;
      }
      throw INTERNAL_SERVER_ERROR("Failed to create user");
    }
  },
};
```

## 🚀 Getting Started

### **1. Environment Setup**

```bash
# Copy environment template
cp db.example.env .env

# Fill in your database credentials
MYSQL_HOST=localhost
MYSQL_USER=your_username
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
```

### **2. Install Dependencies**

```bash
npm install
```

### **3. Run Development Server**

```bash
npm run dev
```

The server will start on `http://localhost:3000` with automatic database initialization.

## 🔧 Configuration

### **Database Configuration**

```typescript
// server/db/connection.ts
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: 10,
  acquireTimeout: 60000,
  timeout: 60000,
});
```

### **Validation Constants**

```typescript
// server/common/constants.ts
export const VALIDATION_CONSTANTS = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 255,
  MAX_EMAIL_LENGTH: 255,
  MAX_PRICE_LENGTH: 20,
} as const;
```

## 📊 API Endpoints

### **Users**

- `POST /api/user/add` - Create new user
- `GET /api/user` - Get all users
- `GET /api/user/:id` - Get user by ID
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user

### **Products**

- `POST /api/product/add` - Create new product
- `GET /api/product` - Get all products
- `GET /api/product/:id` - Get product by ID
- `PUT /api/product/:id` - Update product
- `DELETE /api/product/:id` - Delete product
- `GET /api/product/user` - Get products by user ID

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 📈 Performance Features

- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Explicit field selection for joins
- **Error Boundaries**: Prevents cascading failures
- **Type Safety**: Compile-time error detection
- **Validation**: Early request validation

## 🔒 Security Features

- **Input Validation**: Comprehensive request sanitization
- **Error Sanitization**: No sensitive information in error messages
- **Type Safety**: Prevents injection attacks
- **Rate Limiting**: Built-in request throttling (configurable)

## 🚀 Production Deployment

### **Environment Variables**

```bash
NODE_ENV=production
MYSQL_HOST=production-db-host
MYSQL_USER=production-user
MYSQL_PASSWORD=production-password
MYSQL_DATABASE=production-database
```

### **Build & Deploy**

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

---

**Built with ❤️ using NitroJS and DrizzleORM**
