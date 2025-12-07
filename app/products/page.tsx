'use client';

import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import ProductCard from '@/components/ui/product-card';
import { Product } from '@/lib/definitions';
import { useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  // In a real app we'd sync this with URL, but for now local state for search input
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['products', searchTerm], // simple dependency key
    queryFn: () => apiService.product.getAll({ search: searchTerm }),
    select: (data) => data.data.products,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation this would trigger the refetch via state or URL update
    // React Query will refetch if key changes.
    // Ideally we debounce or wait for submit.
    // Since we put searchTerm in queryKey, it will refetch on every render if we updated it live,
    // but here we are using a form submission model or just passing it if valid.
    // Let's keep it simple: The query param 'search' in getAll waits for this state.
    // Note: getAll implementation in apiService might accept params object.
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>All Products</h1>
          <p className='text-muted-foreground'>Browse our complete collection.</p>
        </div>

        <div className='flex w-full max-w-sm items-center space-x-2'>
          <Input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button type='submit' size='icon' onClick={handleSearch}>
            <Search className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[...Array(8)].map((_, i) => (
            <div key={i} className='h-[400px] rounded-xl bg-muted animate-pulse' />
          ))}
        </div>
      ) : error ? (
        <div className='text-center py-20'>
          <p className='text-destructive mb-4'>Failed to load products</p>
          <Button variant='outline' onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : products.length === 0 ? (
        <div className='text-center py-20 bg-muted/20 rounded-xl'>
          <p className='text-lg text-muted-foreground'>No products found.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
