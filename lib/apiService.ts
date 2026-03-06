import api from './api';
import { CartItem, Order, Product, Review, ApiResponse } from './definitions';

const normalizeProduct = (product: any): Product => ({
  ...product,
  price: product?.price ?? product?.sellingPrice ?? 0,
  sellingPrice: product?.sellingPrice ?? product?.price ?? 0,
  discountPrice: product?.discountPrice ?? null,
});

const apiService = {
  auth: {
    me: async () => {
      const res = await api.get<{ user: { role: string } }>('/auth/me');
      return res.data;
    },
  },
  product: {
    getAll: async (params?: any) => {
      const res = await api.get<{ products: Product[]; total: number }>('/products', { params });
      const data = res.data;
      if (data?.products) {
        data.products = data.products.map(normalizeProduct);
      }
      return data;
    },
    getById: async (id: string) => {
      const res = await api.get<{ product: Product }>(`/products/${id}`);
      const data = res.data;
      if (data?.product) {
        data.product = normalizeProduct(data.product);
      }
      return data;
    },
    create: async (formData: FormData) => {
      const res = await api.post<{ product: Product }>('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    },
    getByCategory: async (category: string) => {
      const res = await api.get<{ products: Product[] }>(`products/category/${category}`);
      const data = res.data;
      if (data?.products) {
        data.products = data.products.map(normalizeProduct);
      }
      return data;
    },
  },
  cart: {
    add: async (productId: string, quantity: number) => {
      const res = await api.post<{ cart: CartItem }>('/cart', { productId, quantity });
      return res.data;
    },
    get: async () => {
      const res = await api.get<{ cart: CartItem[]; total: number }>('/cart');
      const data = res.data;
      if (data?.cart) {
        data.cart = data.cart.map((item) => ({
          ...item,
          product: normalizeProduct(item.product),
        }));
      }
      return data;
    },
    update: async (productId: string, quantity: number) => {
      const res = await api.patch<{ cart: CartItem }>(`/cart/${productId}`, { quantity });
      return res.data;
    },
    remove: async (productId: string) => {
      await api.delete(`/cart/${productId}`);
    },
    clear: async () => {
      await api.delete('/cart');
    },
  },
  orders: {
    create: async (payload: {
      items: { productId: string; quantity: number }[];
      shippingAddress: string;
      paymentMethod?: string;
      discountAmount?: number;
    }) => {
      const res = await api.post<{ order: Order; payment?: { authorization_url: string } }>(
        '/orders',
        payload,
      );
      return res.data;
    },
    getMyOrders: async () => {
      const res = await api.get<{ orders: Order[] }>('/orders');
      return res.data;
    },
    getById: async (id: string) => {
      const res = await api.get<{ order: Order }>(`/orders/${id}`);
      return res.data;
    },
  },
  payment: {
    initialize: async (orderId: string) => {
      const res = await api.post<{ authorization_url: string; reference: string }>(
        '/payments/initialize',
        { orderId },
      );
      return res.data;
    },
    verify: async (reference: string) => {
      const res = await api.get<{ status: string }>(`/payments/verify?reference=${reference}`);
      return res.data;
    },
  },
  reviews: {
    create: async (data: { productId: string; rating: number; comment?: string }) => {
      const res = await api.post<{ review: Review }>('/reviews', data);
      return res.data;
    },
    getByProduct: async (productId: string) => {
      const res = await api.get<{ reviews: Review[] }>(`/reviews/${productId}`);
      return res.data;
    },
  },
};

export default apiService;
