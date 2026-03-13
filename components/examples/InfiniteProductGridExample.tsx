'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/product-card';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';

export function InfiniteProductGridExample() {
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState('');

  const { products, loadMoreRef, hasMore, loadingMore, loading } = useInfiniteProducts({
    category,
    search,
    inStock: true,
    limit: 12,
  });

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <input
          className='border rounded px-2 py-1'
          placeholder='Search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant='outline' onClick={() => setCategory(undefined)}>
          Clear Category
        </Button>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div ref={loadMoreRef} className='py-6 text-center text-sm text-muted-foreground'>
        {loading && 'Loading products…'}
        {loadingMore && 'Loading more…'}
        {!hasMore && !loading && 'No more products'}
      </div>
    </div>
  );
}
