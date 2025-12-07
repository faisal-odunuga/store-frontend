# Admin Module & API Structure Documentation

This document provides a comprehensive overview of the Admin folder structure and the API integration used in the project. This is intended to help developers understand, replicate, or extract the admin functionality into a separate project.

## 1. Admin Folder Structure (`app/admin`)

The admin module is located within the `app/admin` directory and follows the Next.js App Router structure.

```
app/admin/
├── layout.tsx              # Main layout for Admin pages. Handles authentication (redirects non-admins) and renders the Admin Sidebar and Sheet (mobile).
├── page.tsx                # Admin Dashboard (Stats Overview). Displays key metrics like Users, Orders, Products, Revenue.
├── loading.tsx             # Loading state UI for admin routes.
├── orders/                 # Order Management Section
│   └── page.tsx            # Lists all orders in a table with status update functionality used by Admins.
├── products/               # Product Management Section
│   ├── page.tsx            # Lists all products in a table.
│   └── new/                # Create Product Section
│       └── page.tsx        # Form to add a new product (handles text fields and file upload).
```

### Key Components

- **`AdminLayout` (`app/admin/layout.tsx`)**:
  - **Responsibility**: Wraps all admin pages. Checks if the user is authenticated and has the role `ADMIN`. Redirects to home if unauthorized.
  - **Features**: Includes a responsive Sidebar (desktop) and a `Sheet` drawer (mobile) for navigation. Contains `AdminBreadcrumbs` for better navigation context.
- **`AdminOrdersPage` (`app/admin/orders/page.tsx`)**:
  - **Features**: Displays a table of all orders. Supports filtering/sorting (implemented via backend query params). Allows changing order status (PENDING, SHIPPED, etc.).
- **`AdminProductsPage` (`app/admin/products/page.tsx`)**:
  - **Features**: Lists products with images, prices, and stock. Includes a button to navigate to the "Add Product" form.
- **`NewProductPage` (`app/admin/products/new/page.tsx`)**:
  - **Features**: A form layout to input `name`, `description`, `price`, `stock`, `category` and an `image` file.

---

## 2. API Structure & Integration

The frontend communicates with a backend API (running on `http://localhost:8080/api/v1`). All API interactions are centralized in `lib/apiService.ts`.

### Base Configuration

- **Base URL**: `process.env.NEXT_PUBLIC_BASE_URL` (typically `http://localhost:8080/api/v1`)
- **Axios Instance**: Configured in `lib/api.ts` with `withCredentials: true` to handle HTTP-only cookies for authentication.

### API Endpoints Summary

The `apiService` object groups endpoints by domain:

#### **Auth (`apiService.auth`)**

| Method  | Endpoint                      | Description                             |
| :------ | :---------------------------- | :-------------------------------------- |
| `POST`  | `/auth/signup`                | Register a new user.                    |
| `POST`  | `/auth/login`                 | Login user (sets HTTP-only cookie).     |
| `GET`   | `/auth/me`                    | Get current authenticated user details. |
| `POST`  | `/auth/logout`                | Logout user.                            |
| `PATCH` | `/auth/forgot-password`       | Request password reset email.           |
| `PATCH` | `/auth/reset-password/:token` | Reset password using token.             |
| `PATCH` | `/auth/change-password`       | Change password for logged-in user.     |

#### **Product (`apiService.product`)**

| Method | Endpoint        | Description                                                            |
| :----- | :-------------- | :--------------------------------------------------------------------- |
| `GET`  | `/products`     | Get list of products. Supports query params (e.g., `search`, `limit`). |
| `GET`  | `/products/:id` | Get details of a specific product.                                     |
| `POST` | `/products`     | Create a new product. Expects `FormData` (multipart/form-data).        |

#### **Cart (`apiService.cart`)**

| Method   | Endpoint           | Description                                        |
| :------- | :----------------- | :------------------------------------------------- |
| `GET`    | `/cart`            | Get current user's cart.                           |
| `POST`   | `/cart`            | Add item to cart. Body: `{ productId, quantity }`. |
| `PATCH`  | `/cart/:productId` | Update item quantity. Body: `{ quantity }`.        |
| `DELETE` | `/cart/:productId` | Remove specific item from cart.                    |
| `DELETE` | `/cart`            | Clear entire cart.                                 |

#### **Orders (`apiService.orders`)**

| Method  | Endpoint             | Description                                          |
| :------ | :------------------- | :--------------------------------------------------- |
| `POST`  | `/orders`            | Create a new order from current cart.                |
| `GET`   | `/orders`            | Get logged-in user's order history.                  |
| `GET`   | `/orders/all-orders` | **(Admin)** Get all orders in the system.            |
| `PATCH` | `/orders/:id`        | **(Admin)** Update order status. Body: `{ status }`. |

#### **Payment (`apiService.payment`)**

| Method | Endpoint               | Description                                                   |
| :----- | :--------------------- | :------------------------------------------------------------ |
| `POST` | `/payments/initialize` | Initialize payment for an order. Returns `authorization_url`. |
| `GET`  | `/payments/verify`     | Verify payment status via reference.                          |

#### **Admin Stats (`apiService.admin`)**

| Method | Endpoint           | Description                                                    |
| :----- | :----------------- | :------------------------------------------------------------- |
| `GET`  | `/stats/dashboard` | Get dashboard stats: `users`, `orders`, `products`, `revenue`. |

### Data Models (`lib/definitions.ts`)

Key interfaces used throughout the app:

- **User**: `{ id, name, email, role: 'CUSTOMER' | 'ADMIN', ... }`
- **Product**: `{ id, name, price, stock, imageUrl, category, ... }`
- **Order**: `{ id, userId, totalAmount, status, items: [], user: User, ... }`
- **CartItem**: `{ id, quantity, product: Product }`

## 3. How to Extract Admin

To create a separate project for Admin:

1.  **Clone/Copy Files**: Copy `app/admin` folder structures to the new project's `app` directory (e.g., as root pages).
2.  **Dependencies**: Ensure `lib/apiService.ts`, `lib/definitions.ts`, `lib/auth-context.tsx`, and component libraries (buttons, tables, forms) are copied.
3.  **Authentication**: You might want to simplify `auth-context` if the new app is _only_ for admins, defaulting to a login screen if no session exists.
4.  **Routing**: Ensure links in the sidebar (`app/admin/layout.tsx`) point to the correct routes in the new app structure.
