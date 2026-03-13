'use client';

import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { Product } from '@/lib/definitions';

/**
 * Fetch a limited list of featured/landing products.
 * Encapsulates React Query usage to keep pages lean.
 */
export const useFeaturedProducts = (limit = 10) => {
  return useQuery<{ products: Product[] }>({
    queryKey: ['products', 'featured', limit],
    queryFn: () => apiService.product.getAll({ limit, inStock: true }),
    select: (data) => ({ products: data?.products || [] }),
  });
};
