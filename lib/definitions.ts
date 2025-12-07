export interface User {
  id: string;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'ADMIN';
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: string;
  items: any[]; // improved type if backend structure is known, usually snapshot of products
  user: User;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string;
  user?: User;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: 'Success';
  message?: string;
  data: T;
}

export interface ApiError {
  status: 'fail' | 'error';
  message: string;
}

export interface AuthResponse {
  user: User;
}

export interface PaymentInitResponse {
  authorization_url: string;
  reference: string;
}

export interface StatsResponse {
  users: number;
  orders: number;
  products: number;
  revenue: number;
}
