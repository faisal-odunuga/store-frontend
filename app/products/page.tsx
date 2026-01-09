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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', searchTerm, page],
    queryFn: () => apiService.product.getAll({ search: searchTerm, page, limit }),
  });

  const products = data?.data?.products || [];
  const total = data?.data?.total || 0; // Assuming API returns total
  const totalPages = Math.ceil(total / limit);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on search
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='container mx-auto  px-4 py-8'>
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
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6'>
          {[...Array(10)].map((_, i) => (
            <div key={i} className='h-[300px] rounded-xl bg-muted animate-pulse' />
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
        <>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-y-4 gap-2 lg:gap-6 mb-8'>
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(page - 1)}
                    className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>

                {[...Array(totalPages)].map((_, i) => {
                  const p = i + 1;
                  // Simple pagination logic: show all for now, or implement complex range if needed
                  if (totalPages > 7 && Math.abs(page - p) > 2 && p !== 1 && p !== totalPages) {
                    if (Math.abs(page - p) === 3) return <PaginationEllipsis key={p} />;
                    return null;
                  }

                  return (
                    <PaginationItem key={p}>
                      <PaginationLink
                        isActive={page === p}
                        onClick={() => handlePageChange(p)}
                        className='cursor-pointer'
                      >
                        {p}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(page + 1)}
                    className={
                      page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}
