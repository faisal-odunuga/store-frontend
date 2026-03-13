'use client';

import { MouseEvent, useCallback, useMemo } from 'react';
import { useWishlist } from '@/hooks/useWishlist';

export function useWishlistStatus(productId: string) {
  const { wishlist, toggleWishlist } = useWishlist();

  const wished = useMemo(
    () => wishlist.some((w) => w.productId === productId),
    [wishlist, productId],
  );

  const handleToggleWishlist = useCallback(
    (e?: MouseEvent) => {
      e?.preventDefault();
      toggleWishlist(productId, wished);
    },
    [productId, toggleWishlist, wished],
  );

  return { wished, handleToggleWishlist };
}
