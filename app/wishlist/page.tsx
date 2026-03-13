'use client';

import ProductCard from '@/components/ui/product-card';
import { useWishlist } from '@/hooks/useWishlist';
import { AutoBreadcrumb } from '@/components/ui/auto-breadcrumb';

export default function WishlistPage() {
  const { wishlist, isLoading } = useWishlist();

  const products = wishlist.map((w) => w.product).filter(Boolean);

  return (
    <div className='container mx-auto px-4 py-10 space-y-6'>
      <AutoBreadcrumb />

      <div>
        <p className='text-sm text-muted-foreground uppercase tracking-widest'>Wishlist</p>
        <h1 className='text-3xl font-bold tracking-tight'>Saved Items</h1>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='h-[300px] rounded-xl bg-muted animate-pulse' />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className='text-center py-16 bg-muted/30 rounded-2xl border'>
          <p className='text-muted-foreground'>No items in your wishlist yet.</p>
        </div>
      ) : (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6'>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
