'use client';

import { MouseEvent, useCallback, useMemo } from 'react';
import { Product } from '@/lib/definitions';
import { useCart } from '@/lib/cart';

export function useCartActions(product: Product) {
  const { addItem, cart, updateQuantity, removeItem } = useCart();

  const cartItem = useMemo(
    () => cart.find((item) => item.product.id === product.id),
    [cart, product.id],
  );

  const handleAddToCart = useCallback(
    (e?: MouseEvent) => {
      e?.preventDefault();
      addItem(product);
    },
    [addItem, product],
  );

  const handleIncrement = useCallback(
    (e?: MouseEvent) => {
      e?.preventDefault();
      if (!cartItem) return;
      updateQuantity(product.id, cartItem.quantity + 1);
    },
    [cartItem, updateQuantity, product.id],
  );

  const handleDecrement = useCallback(
    (e?: MouseEvent) => {
      e?.preventDefault();
      if (!cartItem) return;
      if (cartItem.quantity <= 1) {
        removeItem(product.id);
      } else {
        updateQuantity(product.id, cartItem.quantity - 1);
      }
    },
    [cartItem, removeItem, updateQuantity, product.id],
  );

  return { cartItem, handleAddToCart, handleIncrement, handleDecrement };
}
