import api from './api';
import {
  CartItem,
  Order,
  Product,
  Review,
  ApiResponse,
  ProductQueryParams,
  ProductListResponse,
} from './definitions';

const normalizeProduct = (product: any): Product => ({
  ...product,
  // Prefer new images array; fall back to legacy imageUrl
  images: product?.images ?? (product?.imageUrl ? [product.imageUrl] : []),
  imageUrl: product?.imageUrl ?? product?.images?.[0] ?? null,
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
    getAll: async (params?: ProductQueryParams) => {
      const res = await api.get<ProductListResponse>('/products', { params });
      const data = res.data;
      const normalizedProducts = (data?.products || []).map(normalizeProduct);

      return {
        products: normalizedProducts,
        total: data?.total ?? normalizedProducts.length,
        page: data?.page ?? params?.page ?? 1,
        totalPages:
          data?.totalPages ??
          (params?.limit
            ? Math.max(1, Math.ceil((data?.total ?? normalizedProducts.length) / params.limit))
            : 1),
        categories: data?.categories,
      };
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
      shippingAddress?: string;
      addressId?: string;
      contactName?: string;
      contactEmail?: string;
      contactPhone?: string;
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
  addresses: {
    list: async () => {
      const res = await api.get<{ addresses: any[] }>('/users/addresses');
      return res.data;
    },
    create: async (payload: {
      street: string;
      city: string;
      state?: string;
      postalCode: string;
      country: string;
      isDefault?: boolean;
    }) => {
      const res = await api.post<{ address: any }>('/users/addresses', payload);
      return res.data;
    },
    update: async (
      id: string,
      payload: Partial<{
        street: string;
        city: string;
        state?: string;
        postalCode: string;
        country: string;
        isDefault?: boolean;
      }>
    ) => {
      const res = await api.patch<{ address: any }>(`/users/addresses/${id}`, payload);
      return res.data;
    },
    remove: async (id: string) => {
      await api.delete(`/users/addresses/${id}`);
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
  wishlist: {
    list: async () => {
      const res = await api.get<{ wishlist: any[] }>('/users/wishlist');
      return res.data;
    },
    add: async (productId: string) => {
      const res = await api.post<{ item: any }>('/users/wishlist', { productId });
      return res.data;
    },
    remove: async (productId: string) => {
      const res = await api.delete<{ message: string }>(`/users/wishlist/${productId}`);
      return res.data;
    },
  },
};

export default apiService;
