import api from './api';
import {
  AuthResponse,
  CartItem,
  Order,
  Product,
  Review,
  StatsResponse,
  User,
  PaymentInitResponse,
  ApiResponse,
} from './definitions';

const apiService = {
  auth: {
    signup: async (data: any) => {
      const res = await api.post<ApiResponse<AuthResponse>>('/auth/signup', data);
      return res.data;
    },
    login: async (data: any) => {
      const res = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      return res.data;
    },
    me: async () => {
      const res = await api.get<ApiResponse<AuthResponse>>('/auth/me');
      return res.data;
    },
    logout: async () => {
      const res = await api.post('/auth/logout');
      return res.data;
    },
    forgotPassword: async (email: string) => {
      const res = await api.patch('/auth/forgot-password', { email });
      return res.data;
    },
    resetPassword: async (token: string, password: string) => {
      const res = await api.patch(`/auth/reset-password/${token}`, { password });
      return res.data;
    },
    changePassword: async (data: any) => {
      const res = await api.patch('/auth/change-password', data);
      return res.data;
    },
  },
  product: {
    getAll: async (params?: any) => {
      const res = await api.get('/products', { params });
      return res.data;
    },
    getById: async (id: string) => {
      const res = await api.get<ApiResponse<{ product: Product }>>(`/products/${id}`);
      return res.data;
    },
    create: async (formData: FormData) => {
      const res = await api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
  },
  cart: {
    add: async (productId: string, quantity: number) => {
      const res = await api.post('/cart', { productId, quantity });
      return res.data;
    },
    get: async () => {
      const res = await api.get<ApiResponse<{ cart: CartItem[]; total: number }>>('/cart');
      return res.data;
    },
    update: async (productId: string, quantity: number) => {
      const res = await api.patch(`/cart/${productId}`, { quantity });
      return res.data;
    },
    remove: async (productId: string) => {
      const res = await api.delete(`/cart/${productId}`);
      return res.data;
    },
    clear: async () => {
      const res = await api.delete('/cart');
      return res.data;
    },
  },
  orders: {
    create: async () => {
      const res = await api.post<ApiResponse<{ order: Order }>>('/orders');
      return res.data;
    },
    getMyOrders: async () => {
      const res = await api.get<ApiResponse<{ orders: Order[] }>>('/orders');
      return res.data;
    },
    getAllOrders: async () => {
      const res = await api.get<ApiResponse<{ orders: Order[] }>>('/orders/all-orders');
      return res.data;
    },
    updateStatus: async (id: string, status: string) => {
      const res = await api.patch(`/orders/${id}`, { status });
      return res.data;
    },
  },
  payment: {
    initialize: async (orderId: string) => {
      const res = await api.post<ApiResponse<PaymentInitResponse>>('/payments/initialize', {
        orderId,
      });
      return res.data;
    },
    verify: async (reference: string) => {
      const res = await api.get(`/payments/verify?reference=${reference}`);
      return res.data;
    },
  },
  reviews: {
    create: async (data: { productId: string; rating: number; comment?: string }) => {
      const res = await api.post('/reviews', data);
      return res.data;
    },
    getByProduct: async (productId: string) => {
      const res = await api.get(`/reviews/${productId}`);
      return res.data;
    },
  },
  admin: {
    getStats: async () => {
      const res = await api.get<ApiResponse<StatsResponse>>('/stats/dashboard');
      return res.data;
    },
  },
};

export default apiService;
