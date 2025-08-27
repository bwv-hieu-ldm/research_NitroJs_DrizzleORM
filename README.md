# Nitro.js + DrizzleORM Research Project

A modern web application built with Nitro.js and DrizzleORM, featuring authentication, authorization, and a clean repository pattern.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Clean Architecture**: Repository pattern with dependency injection
- **Database Optimization**: Single database connection context
- **Type Safety**: Full TypeScript support with DrizzleORM
- **Validation**: Input validation using Yup schemas
- **Security**: Password hashing with bcrypt

## Project Structure

```
server/
├── api/                    # API endpoints
│   ├── auth/              # Authentication endpoints
│   │   ├── login.post.ts  # User login
│   │   └── register.post.ts # User registration
│   ├── product/           # Product management
│   └── user/              # User management
├── db/                    # Database layer
│   ├── context.ts         # Database connection context
│   ├── base.repository.ts # Base repository class
│   ├── user.repository.ts # User data access
│   └── product.repository.ts # Product data access
├── schema/                # Database schemas
│   ├── common.ts          # Common field definitions
│   ├── user.ts            # User schema
│   └── product.ts         # Product schema
├── services/              # Business logic
│   ├── auth.service.ts    # Authentication service
│   ├── user.service.ts    # User business logic
│   └── product.service.ts # Product business logic
└── utils/middleware/      # Middleware
    ├── auth.middleware.ts # Authentication middleware
    └── authorization.middleware.ts # Authorization middleware
```

## Database Schema

### Common Fields

All tables include these common fields:

- `id`: Primary key (auto-increment)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Users Table

- `id`, `createdAt`, `updatedAt` (common fields)
- `name`: User's full name
- `email`: Unique email address
- `password`: Hashed password
- `role`: User role (user, moderator, admin)

### Products Table

- `id`, `createdAt`, `updatedAt` (common fields)
- `name`: Product name
- `description`: Product description
- `price`: Product price
- `userId`: Foreign key to users table

## Authentication & Authorization

### User Roles

- **User**: Can create, read, update, and delete their own products
- **Moderator**: Can manage all products and users
- **Admin**: Full system access

### API Security

- All endpoints (except auth) require valid JWT token
- Role-based access control on sensitive operations
- Resource ownership validation for user-specific data

## Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file based on `db.example.env`:

   ```env
   MYSQL_HOST=localhost
   MYSQL_USER=your_user
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=your_database
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=24h
   ```

3. **Database Setup**

   ```bash
   npm run generate  # Generate migrations
   npm run migrate   # Apply migrations
   ```

4. **Development**
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Users (Admin only)

- `GET /api/user` - List all users
- `POST /api/user/add` - Create user
- `GET /api/user/[id]` - Get user by ID
- `PUT /api/user/[id]` - Update user
- `DELETE /api/user/[id]` - Delete user

### Products

- `GET /api/product` - List all products
- `POST /api/product/add` - Create product (authenticated)
- `GET /api/product/[id]` - Get product by ID
- `PUT /api/product/[id]` - Update product (owner or admin)
- `DELETE /api/product/[id]` - Delete product (owner or admin)

## Key Improvements Made

1. **Centralized Database Context**: Single connection instance shared across repositories
2. **Common Schema Fields**: Extracted shared fields into reusable definitions
3. **Authentication System**: JWT-based authentication with bcrypt password hashing
4. **Authorization Middleware**: Role-based access control and resource ownership validation
5. **Clean Repository Pattern**: Dependency injection and consistent error handling
6. **Type Safety**: Full TypeScript support throughout the application

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Resource ownership validation
- Input validation with Yup schemas
- SQL injection protection via DrizzleORM

## Development Notes

- The application uses a singleton pattern for database connections
- All repositories extend a base class for consistent error handling
- Middleware is composable for flexible authorization rules
- Database migrations are automatically generated and applied
- Environment variables are used for sensitive configuration
