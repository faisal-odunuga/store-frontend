'use client';

import React from 'react'; // Added import for React
import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { Product } from '@/lib/definitions';
import BackButton from '@/components/ui/back-button';

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;
  const { addItem } = useCart();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiService.product.getById(id),
    enabled: !!id,
  });

  const product = data?.data?.product as Product;

  if (isLoading) {
    return (
      <div className='container mx-auto mx-auto px-4 py-8 animate-pulse'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          <div className='aspect-square bg-muted rounded-xl'></div>
          <div className='space-y-4'>
            <div className='h-8 bg-muted w-3/4 rounded'></div>
            <div className='h-6 bg-muted w-1/4 rounded'></div>
            <div className='h-24 bg-muted w-full rounded'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='container mx-auto mx-auto px-4 py-20 text-center'>
        <h2 className='text-2xl font-bold text-destructive'>Product not found</h2>
        <p className='text-muted-foreground mt-2'>
          The product you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product);
  };

  return (
    <div className='container mx-auto mx-auto px-4 py-8 md:py-16'>
      <BackButton className='mb-4' />
      <div className='grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20'>
        {/* Image Section */}
        <div className='relative aspect-square bg-white rounded-2xl border overflow-hidden flex items-center justify-center p-8 shadow-sm'>
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            className='object-contain w-full h-full max-h-[500px] transition-transform duration-500 hover:scale-105'
          />
        </div>

        {/* Info Section */}
        <div className='flex flex-col justify-center space-y-8'>
          <div>
            <div className='inline-block px-3 py-1 bg-secondary rounded-full text-xs font-medium uppercase tracking-wider mb-4'>
              {product.category}
            </div>
            <h1 className='text-3xl md:text-4xl font-extrabold tracking-tight text-primary mb-2'>
              {product.name}
            </h1>
            <div className='flex items-center gap-4 mb-6'>
              <span className='text-3xl font-bold'>₦{product.price.toLocaleString()}</span>
              {product.stock > 0 ? (
                <span className='text-green-600 text-sm font-semibold bg-green-100 px-2 py-1 rounded-full'>
                  In Stock
                </span>
              ) : (
                <span className='text-red-600 text-sm font-semibold bg-red-100 px-2 py-1 rounded-full'>
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          <p className='text-lg text-muted-foreground leading-relaxed'>{product.description}</p>

          <div className='flex flex-wrap gap-4 pt-4 border-t'>
            <Button
              size='lg'
              className='flex-1 text-lg h-14'
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className='mr-2 h-5 w-5' />
              Add to Cart
            </Button>
            <Button variant='outline' size='lg' className='flex-1 text-lg h-14'>
              Buy Now
            </Button>
          </div>

          {/* Features / Trust Badges */}
          <div className='grid grid-cols-3 gap-4 pt-8'>
            <div className='flex flex-col items-center text-center gap-2'>
              <div className='p-3 bg-muted rounded-full'>
                <Truck className='h-5 w-5 text-primary' />
              </div>
              <span className='text-xs font-medium'>Free Shipping</span>
            </div>
            <div className='flex flex-col items-center text-center gap-2'>
              <div className='p-3 bg-muted rounded-full'>
                <ShieldCheck className='h-5 w-5 text-primary' />
              </div>
              <span className='text-xs font-medium'>2 Year Warranty</span>
            </div>
            <div className='flex flex-col items-center text-center gap-2'>
              <div className='p-3 bg-muted rounded-full'>
                <RotateCcw className='h-5 w-5 text-primary' />
              </div>
              <span className='text-xs font-medium'>30 Day Return</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
