'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Search } from 'lucide-react';

import ProductCard from '@/components/ui/product-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { categories as fallbackCategories } from '@/lib/products';
import { useInfiniteProducts } from '@/hooks/useInfiniteProducts';
import { AutoBreadcrumb } from '@/components/ui/auto-breadcrumb';

type SortOption = 'featured' | 'price_asc' | 'price_desc' | 'newest';

const DEFAULT_PRICE: [number, number] = [0, 1_000_000];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get('minPrice')) || DEFAULT_PRICE[0],
    Number(searchParams.get('maxPrice')) || DEFAULT_PRICE[1],
  ]);
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') !== 'false');
  const [sort, setSort] = useState<SortOption>(
    (searchParams.get('sort') as SortOption) || 'featured',
  );

  // Sync state -> URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (category && category !== 'All Categories') params.set('category', category);
    if (priceRange[0] !== DEFAULT_PRICE[0]) params.set('minPrice', String(priceRange[0]));
    if (priceRange[1] !== DEFAULT_PRICE[1]) params.set('maxPrice', String(priceRange[1]));
    if (!inStockOnly) params.set('inStock', 'false');
    if (sort !== 'featured') params.set('sort', sort);

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [searchTerm, category, priceRange, inStockOnly, sort, router, pathname]);

  const { products, loadMoreRef, hasMore, loading, loadingMore, totalPages, categories, loadMore } =
    useInfiniteProducts({
      category: category !== 'All Categories' ? category : undefined,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      inStock: inStockOnly,
      sort,
      search: searchTerm,
      limit: 12,
    });

  const categoryOptions = useMemo(() => {
    const merged = ['All Categories', ...(categories.length ? categories : fallbackCategories)];
    return Array.from(new Set(merged));
  }, [categories]);

  const handleReset = () => {
    setSearchTerm('');
    setCategory('All Categories');
    setPriceRange(DEFAULT_PRICE);
    setInStockOnly(true);
    setSort('featured');
  };

  return (
    <div className='container mx-auto px-4 py-10 space-y-10'>
      <AutoBreadcrumb />

      <div className='flex flex-col lg:flex-row gap-10'>
        {/* Filters */}
        <aside className='w-full lg:w-72 flex-shrink-0'>
          <div className='sticky top-24 space-y-6'>
            <div className='rounded-2xl border bg-card p-5 space-y-4 shadow-sm'>
              <div className='flex items-center gap-2 text-sm font-semibold'>
                <SlidersHorizontal className='h-4 w-4' />
                <span>Search</span>
              </div>
              <div className='flex items-center gap-2'>
                <Input
                  placeholder='Search products...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='flex-1'
                />
                <Button size='icon' variant='secondary' onClick={() => setSearchTerm(searchTerm)}>
                  <Search className='h-4 w-4' />
                </Button>
              </div>
            </div>

            <div className='rounded-2xl border bg-card p-5 space-y-4 shadow-sm'>
              <p className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                Category
              </p>
              <div className='space-y-2 max-h-[220px] overflow-y-auto pr-1'>
                {categoryOptions.map((cat) => (
                  <label key={cat} className='flex items-center gap-3 text-sm cursor-pointer group'>
                    <input
                      type='radio'
                      className='accent-primary h-4 w-4'
                      checked={category === cat}
                      onChange={() => setCategory(cat)}
                    />
                    <span className='group-hover:text-primary transition-colors'>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className='rounded-2xl border bg-card p-5 space-y-4 shadow-sm'>
              <div className='flex items-center justify-between'>
                <p className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                  Price Range
                </p>
                <span className='text-xs text-muted-foreground'>
                  ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
                </span>
              </div>
              <Slider
                value={priceRange}
                min={0}
                max={1_000_000}
                step={50}
                onValueChange={(val) => setPriceRange(val as [number, number])}
              />
            </div>

            <div className='rounded-2xl border bg-card p-5 space-y-3 shadow-sm'>
              <div className='flex items-center justify-between'>
                <div>
                  <p className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                    Availability
                  </p>
                  <p className='text-sm text-muted-foreground'>Show in-stock only</p>
                </div>
                <div className='flex items-center gap-2'>
                  <Switch
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(!!checked)}
                  />
                  <Label className='text-sm'>In Stock</Label>
                </div>
              </div>
            </div>

            <div className='rounded-2xl border bg-card p-5 space-y-3 shadow-sm'>
              <p className='text-sm font-semibold uppercase tracking-wide text-muted-foreground'>
                Sort
              </p>
              <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Sort by' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='featured'>Featured</SelectItem>
                  <SelectItem value='price_asc'>Price: Low to High</SelectItem>
                  <SelectItem value='price_desc'>Price: High to Low</SelectItem>
                  <SelectItem value='newest'>Newest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </aside>

        {/* Products */}
        <div className='flex-1 space-y-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm text-muted-foreground'>All Products</p>
              <h2 className='text-3xl font-black leading-tight'>Catalog</h2>
              <p className='text-xs text-muted-foreground'>
                Showing {products.length} items {hasMore ? `• up to ${totalPages} pages` : ''}
              </p>
            </div>

            <Button variant='outline' onClick={handleReset}>
              Reset Filters
            </Button>
          </div>

          {loading ? (
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6'>
              {[...Array(10)].map((_, i) => (
                <div key={i} className='h-[300px] rounded-xl bg-muted animate-pulse' />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className='text-center py-16 bg-muted/30 rounded-2xl border'>
              <p className='text-muted-foreground'>No products match your filters.</p>
            </div>
          ) : (
            <>
              <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6'>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div ref={loadMoreRef} className='flex flex-col items-center py-6 gap-3'>
                {loadingMore && <div className='text-sm text-muted-foreground'>Loading…</div>}
                {!hasMore && !loading && (
                  <div className='text-sm text-muted-foreground'>You&apos;re all caught up.</div>
                )}
                {hasMore && !loadingMore && (
                  <Button variant='secondary' onClick={() => loadMore()}>
                    Load more
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
