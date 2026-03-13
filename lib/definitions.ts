export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'CUSTOMER';
  phone?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  sku?: string;
  price: number;
  sellingPrice?: number;
  discountPrice?: number | null;
  costPrice?: number;
  weight?: number | null;
  lowStockAlert?: number | null;
  isActive?: boolean;
  barcode?: string | null;
  stock: number;
  imageUrl?: string | null; // legacy single image
  images?: string[]; // new gallery, empty array when none
  specs?: Record<string, any> | string[] | null;
  category?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQueryParams {
  search?: string;
  category?: string;
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'oldest';
  page?: number;
  limit?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  categories?: string[];
}

export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  userId: string;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price?: number;
  sellingPrice?: number;
  totalPrice?: number;
  product: Product;
}

export interface Order {
  id: string;
  orderNumber?: string;
  userId: string;
  // In the API, we return 'orderItems', not 'items'
  orderItems: OrderItem[];
  // For orders, we sanitize the user object to only include specific fields
  user: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
  totalAmount: number;
  shippingAddress?: string;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  // Reviews only return a subset of user data
  user?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  userId: string;
  street: string;
  city: string;
  state?: string | null;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  status: string; // 'success' or 'fail'/'error' usually in your messages
  message?: string;
  data: T;
}

// Auth response usually includes the token as well
export interface AuthResponse {
  user: User;
  token?: string;
}

export interface PaymentInitResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
}

export interface StatsResponse {
  users: number;
  orders: number;
  products: number;
  revenue: number;
}

export interface CreateOrderPayload {
  items: { productId: string; quantity: number }[];
  shippingAddress?: string;
  addressId?: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  paymentMethod?: string;
  discountAmount?: number;
}
