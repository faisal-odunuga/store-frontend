'use client';

import { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product-card';
import { ProductFilters, type FilterState } from '@/components/product-filters';
import { products } from '@/lib/products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/lib/cart';

export default function StorefrontPage() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 1500],
    selectedMakers: [],
    category: 'All Categories',
    availability: 'all',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Price filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Maker filter
      if (filters.selectedMakers.length > 0 && !filters.selectedMakers.includes(product.maker)) {
        return false;
      }

      // Category filter
      if (filters.category !== 'All Categories' && product.category !== filters.category) {
        return false;
      }

      // Availability filter
      if (filters.availability === 'in-stock' && product.stock === 0) {
        return false;
      }
      if (filters.availability === 'low-stock' && (product.stock === 0 || product.stock >= 30)) {
        return false;
      }

      // Search query
      if (
        searchQuery &&
        !product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !product.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [filters, searchQuery]);

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Mobile Filter Toggle */}
          <div className='lg:hidden'>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant='outline' className='w-full bg-transparent'>
                  <Menu className='mr-2 h-4 w-4' />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side='left' className='w-80 overflow-y-auto'>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className='mt-6'>
                  <ProductFilters onFilterChange={setFilters} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Filters Sidebar */}
          <aside className='hidden lg:block w-80 shrink-0'>
            <div className='sticky top-24'>
              <h2 className='text-xl font-semibold mb-6'>Filters</h2>
              <ProductFilters onFilterChange={setFilters} />
            </div>
          </aside>

          {/* Main Content */}
          <main className='flex-1 min-w-0'>
            {/* Search Bar */}
            <div className='mb-6'>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                <Input
                  type='search'
                  placeholder='Search products...'
                  className='pl-10'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Results Header */}
            <div className='flex items-center justify-between mb-6'>
              <p className='text-sm text-muted-foreground'>
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <p className='text-muted-foreground'>No products found matching your filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
