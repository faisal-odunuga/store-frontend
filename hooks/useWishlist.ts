'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { notify } from '@/lib/notify';

type WishlistItem = {
  id: string;
  productId: string;
  product: any;
};

export function useWishlist() {
  const qc = useQueryClient();

  const list = useQuery<{ wishlist: WishlistItem[] }>({
    queryKey: ['wishlist'],
    queryFn: () => apiService.wishlist.list(),
    enabled: true,
  });

  const add = useMutation({
    mutationFn: (productId: string) => apiService.wishlist.add(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
      notify.success('Added to wishlist');
    },
    onError: (err: any) => {
      notify.error('Could not add to wishlist', err?.response?.data?.message);
    },
  });

  const remove = useMutation({
    mutationFn: (productId: string) => apiService.wishlist.remove(productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['wishlist'] });
      notify.info('Removed from wishlist');
    },
    onError: (err: any) => {
      notify.error('Could not remove from wishlist', err?.response?.data?.message);
    },
  });

  const toggle = (productId: string, exists: boolean) =>
    exists ? remove.mutate(productId) : add.mutate(productId);

  return {
    wishlist: list.data?.wishlist || [],
    isLoading: list.isLoading,
    addToWishlist: (productId: string) => add.mutate(productId),
    removeFromWishlist: (productId: string) => remove.mutate(productId),
    toggleWishlist: toggle,
  };
}
