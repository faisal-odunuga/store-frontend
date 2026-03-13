'use client';

import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { Badge } from './badge';
import { useCartActions } from '@/hooks/useCartActions';
import { useProductComputed } from '@/hooks/useProductComputed';
import { useWishlistStatus } from '@/hooks/useWishlistStatus';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { cartItem, handleAddToCart, handleIncrement, handleDecrement } =
    useCartActions(product);
  const { primaryImage, displayPrice, basePrice, hasDiscount, isOut, isNew } =
    useProductComputed(product);
  const { wished, handleToggleWishlist } = useWishlistStatus(product.id);

  return (
    <Link href={`/products/${product.sku || product.id}`} className='group block h-full'>
      <div className='relative h-full flex flex-col gap-2 justify-between overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10'>
        {/* Image */}
        <div className='relative aspect-square overflow-hidden bg-muted'>
          <img
            src={primaryImage}
            alt={product.name}
            className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
          />

          {/* Badges */}
          <div className='absolute top-3 left-3 flex flex-col gap-2'>
            {isNew && <Badge>New</Badge>}
            {product.category && (
              <Badge variant='secondary' className='capitalize'>
                {product.category}
              </Badge>
            )}
            {hasDiscount && (
              <Badge variant='destructive'>
                -{Math.round(((basePrice - displayPrice) / basePrice) * 100)}%
              </Badge>
            )}
          </div>

          {/* Wishlist icon */}
          <button
            className='absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm text-muted-foreground transition hover:text-primary'
            onClick={handleToggleWishlist}
            aria-label='Save to wishlist'
          >
            <Heart className={`h-4 w-4 ${wished ? 'fill-primary text-primary' : ''}`} />
          </button>

          {/* Quick look overlay */}
          <div className='absolute inset-x-3 bottom-3 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
            <Button variant='secondary' className='w-full' size='sm'>
              Quick Look
            </Button>
          </div>

          {/* Stock overlay */}
          {isOut && (
            <div className='absolute inset-0 bg-black/55 text-white flex items-center justify-center text-xs font-semibold uppercase tracking-widest'>
              Out of Stock
            </div>
          )}
        </div>

        {/* Body */}
        <div className='p-2 space-y-2'>
          <h3 className='font-semibold text-sm leading-tight' title={product.name}>
            {product.name}
          </h3>

          <p className='text-xs text-muted-foreground'>{product.description}</p>

          <div className='flex items-center justify-between'>
            <div className='flex items-baseline gap-2'>
              <span className='text-lg font-bold'>₦{displayPrice.toLocaleString()}</span>
              {hasDiscount && (
                <span className='text-xs line-through text-muted-foreground'>
                  ₦{basePrice.toLocaleString()}
                </span>
              )}
            </div>
            {/* <div
              className={cn(
                'text-xs font-semibold px-2 py-1 rounded-full',
                isOut
                  ? 'bg-destructive/10 text-destructive'
                  : lowStock
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700',
              )}
            >
              {isOut ? 'Out' : lowStock ? 'Low stock' : 'In stock'}
            </div> */}
          </div>

          <div className='flex items-center gap-2'>
            <span className='text-yellow-500'>
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </span>
            <span className='text-xs text-muted-foreground'>(4.1)</span>
          </div>

          <div className='flex items-center justify-between'>
            {cartItem ? (
              <div className='flex items-center justify-between bg-secondary/20 rounded-full overflow-hidden border w-full'>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-none hover:bg-secondary/50'
                  onClick={handleDecrement}
                >
                  <Minus className='w-3 h-3' />
                </Button>
                <span className='px-3 text-sm font-semibold'>{cartItem.quantity}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-none hover:bg-secondary/50'
                  onClick={handleIncrement}
                >
                  <Plus className='w-3 h-3' />
                </Button>
              </div>
            ) : (
              <Button
                size='sm'
                className='rounded-full shadow-sm w-full'
                onClick={handleAddToCart}
                disabled={isOut}
              >
                <span className=''>Add to cart</span> <ShoppingCart className='w-4 h-4' />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
