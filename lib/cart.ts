'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from './apiService';
import { CartItem, Product } from './definitions';
import { notify } from './notify';

export function useCart() {
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: apiService.cart.get,
    retry: false, // Don't retry if 401/404, just show empty
    select: (data) => {
      const cart = data.data;
      return (Array.isArray(cart) ? cart : cart?.cart || []) as CartItem[];
    },
  });

  const addMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      apiService.cart.add(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      notify.success('Cart updated');
    },
    onError: (err: any) => {
      notify.error('Failed to update cart', err?.response?.data?.message || 'Something went wrong');
    },
  });

  // Since we don't have explicit remove/update endpoints in the instructions,
  // we might have to rely on add with negative quantity or 0 if supported,
  // or simply not support it fully until backend is clarified.
  // BUT the user wants "real implementation".
  // I will assume for now that I can only ADD.
  // If I need to remove, I will try sending negative quantity if the API logic allows "delta" updates.
  // Actually, standard "POST /cart" often means "Add this to cart".
  // If I want to remove, usually "DELETE /cart/:id".
  // I'll keep the interface but warn or try a best-effort.
  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      apiService.cart.update(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      notify.success('Cart updated');
    },
    onError: (err: any) => {
      notify.error('Failed to update cart', err?.response?.data?.message);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => apiService.cart.remove(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      notify.success('Item removed');
    },
    onError: (err: any) => {
      notify.error('Failed to remove item', err?.response?.data?.message);
    },
  });

  const clearMutation = useMutation({
    mutationFn: apiService.cart.clear,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      notify.success('Cart cleared');
    },
    onError: (err: any) => {
      notify.error('Failed to clear cart', err?.response?.data?.message);
    },
  });

  const addItem = (product: Product, quantity: number = 1) => {
    addMutation.mutate({ productId: product.id, quantity });
  };

  const removeItem = (itemId: string) => {
    removeMutation.mutate(itemId);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeMutation.mutate(productId);
      return;
    }
    updateMutation.mutate({ productId, quantity });
  };

  const clearCart = () => {
    clearMutation.mutate();
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    isLoading,
  };
}
