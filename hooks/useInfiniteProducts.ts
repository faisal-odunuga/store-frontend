'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

import apiService from '@/lib/apiService';
import { Product } from '@/lib/definitions';
import { useDebouncedValue } from './useDebouncedValue';

export type ProductFilters = {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sort?: 'featured' | 'price_asc' | 'price_desc' | 'newest';
  limit?: number;
};

export type UseInfiniteProductsResult = {
  products: Product[];
  page: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  categories: string[];
  error: unknown;
  loadMore: () => void;
  reset: () => void;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  totalPages: number;
};

/**
 * Reusable hook for infinite product loading with IntersectionObserver and TanStack Query.
 */
export function useInfiniteProducts(
  filters: ProductFilters,
  options: { debounceMs?: number; enabled?: boolean } = {},
): UseInfiniteProductsResult {
  const { debounceMs = 300, enabled = true } = options;
  const debouncedSearch = useDebouncedValue(filters.search ?? '', debounceMs);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const limit = filters.limit ?? 12;

  const queryParams = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch || undefined,
      sort: filters.sort === 'featured' ? undefined : filters.sort,
      limit,
    }),
    [filters, debouncedSearch, limit],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    error,
  } = useInfiniteQuery({
    queryKey: ['products', queryParams],
    queryFn: ({ pageParam = 1 }) => apiService.product.getAll({ ...queryParams, page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const next = allPages.length + 1;
      return next <= (lastPage?.totalPages ?? 1) ? next : undefined;
    },
    initialPageParam: 1,
    enabled,
    refetchOnWindowFocus: false,
  });

  const pages = data?.pages ?? [];
  const products = pages.flatMap((p) => (p?.products || []) as Product[]);
  const totalPages = pages[0]?.totalPages ?? 1;
  const currentPage = pages.length;
  const categories =
    pages[0]?.categories?.filter(Boolean) && pages[0]?.categories?.length
      ? (pages[0]?.categories as string[])
      : [];

  // Intersection observer to auto-load more
  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    products,
    page: currentPage,
    loading: isFetching && currentPage === 0,
    loadingMore: isFetchingNextPage,
    hasMore: Boolean(hasNextPage),
    categories,
    error,
    loadMore: () => {
      if (!hasNextPage || isFetchingNextPage) return;
      fetchNextPage();
    },
    reset: () => refetch({ refetchPage: (_page, idx) => idx === 0 }),
    loadMoreRef,
    totalPages,
  };
}
