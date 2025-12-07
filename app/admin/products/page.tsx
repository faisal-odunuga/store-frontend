'use client';

import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Product } from '@/lib/definitions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => apiService.product.getAll({ limit: 100 }), // Fetch more for admin list
    select: (data) => data.data.products,
  });

  if (isLoading) return <div>Loading products...</div>;

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Products Management</h1>
        <Button asChild>
          <Link href='/admin/products/new'>
            <Plus className='mr-2 h-4 w-4' /> Add Product
          </Link>
        </Button>
      </div>

      <div className='rounded-md border bg-card overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className='h-10 w-10 bg-muted rounded overflow-hidden'>
                    <img
                      src={product.imageUrl || '/placeholder.png'}
                      alt=''
                      className='h-full w-full object-cover'
                    />
                  </div>
                </TableCell>
                <TableCell className='font-medium'>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toLocaleString()}</TableCell>
                <TableCell>{product.stock}</TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='text-center h-24'>
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
