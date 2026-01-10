'use client';

import { Product } from '@/lib/definitions';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { createSlug } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, cart, updateQuantity, removeItem } = useCart();
  const cartItem = cart.find((item) => item.product.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!cartItem) return;
    updateQuantity(product.id, cartItem.quantity + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!cartItem) return;
    if (cartItem.quantity <= 1) {
      removeItem(product.id);
    } else {
      updateQuantity(product.id, cartItem.quantity - 1);
    }
  };

  return (
    <Link href={`/products/${createSlug(product.name, product.id)}`} className='group'>
      <Card className='h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 border-0 py-0 gap-3 shadow-none hover:shadow-sm'>
        <div className='aspect-[230/180] relative overflow-hidden p-2 md:p-0'>
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            className='object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 text-[10px] md:text-sm rounded-t-lg md:rounded-none'
          />
          {product.stock <= 0 && (
            <div className='absolute inset-0 bg-black/60 flex items-center justify-center'>
              <span className='text-xs md:text-base text-white font-bold uppercase tracking-wider'>
                Out of Stock
              </span>
            </div>
          )}

          <div className='absolute top-2 right-2 z-10' onClick={(e) => e.preventDefault()}>
            {cartItem ? (
              <div className='flex items-center bg-white/95 backdrop-blur-sm shadow-md rounded-full h-7 md:h-8 overflow-hidden border border-secondary'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7 md:h-8 md:w-8 rounded-none hover:bg-secondary/50'
                  onClick={handleDecrement}
                >
                  <Minus className='w-3 h-3' />
                </Button>
                <span className='font-semibold text-xs min-w-[1.2rem] md:min-w-[1.5rem] text-center'>
                  {cartItem.quantity}
                </span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-7 w-7 md:h-8 md:w-8 rounded-none hover:bg-secondary/50'
                  onClick={handleIncrement}
                >
                  <Plus className='w-3 h-3' />
                </Button>
              </div>
            ) : (
              <Button
                size='icon'
                className='h-7 w-7 md:h-8 md:w-8 rounded-full shadow-md transition-transform hover:scale-105'
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <ShoppingCart className='w-3 h-3 md:w-4 md:h-4' />
              </Button>
            )}
          </div>
        </div>
        <CardContent className='p-2 md:p-4'>
          <div className='p-3'>
            <h3 className='font-bold text-sm truncate mb-1' title={product.name}>
              {product.name}
            </h3>
            <div className='flex justify-between items-center'>
              <p className='text-sm font-semibold'>₦{product.price.toLocaleString()}</p>
            </div>
          </div>
          <p className='md:block text-xs text-muted-foreground line-clamp-2'>
            {product.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
