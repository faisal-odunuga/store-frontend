'use client';

import { Product } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ShoppingCart, Plus, Minus, Heart } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, cart, updateQuantity, removeItem } = useCart();
  const cartItem = cart.find((item) => item.product.id === product.id);
  const { wishlist, toggleWishlist } = useWishlist();
  const wished = wishlist.some((w) => w.productId === product.id);

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

  const primaryImage = product.images?.[0] || product.imageUrl || '/placeholder.png';
  const displayPrice = product.discountPrice ?? product.sellingPrice ?? product.price ?? 0;
  const basePrice = product.sellingPrice ?? product.price ?? displayPrice;
  const hasDiscount = product.discountPrice !== null && product.discountPrice !== undefined;
  const lowStock = product.lowStockAlert !== undefined && product.stock <= (product.lowStockAlert || 0);
  const isOut = product.stock <= 0;
  const isNew =
    product.createdAt &&
    new Date().getTime() - new Date(product.createdAt).getTime() <
      1000 * 60 * 60 * 24 * 30; // 30 days

  return (
    <Link href={`/products/${product.sku || product.id}`} className='group block h-full'>
      <div className='relative h-full overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10'>
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
            {hasDiscount && <Badge variant='destructive'>-{Math.round(((basePrice - displayPrice) / basePrice) * 100)}%</Badge>}
          </div>

          {/* Wishlist icon */}
          <button
            className='absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow-sm text-muted-foreground transition hover:text-primary'
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product.id, wished);
            }}
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
        <div className='p-4 space-y-3'>
          <div className='flex items-start justify-between gap-3'>
            <div className='space-y-1 min-w-0'>
              <h3 className='font-semibold text-base leading-tight line-clamp-2' title={product.name}>
                {product.name}
              </h3>
            </div>
            <div className='shrink-0'>
              {cartItem ? (
                <div className='flex items-center bg-secondary/20 rounded-full overflow-hidden border'>
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
                  size='icon'
                  className='h-9 w-9 rounded-full shadow-sm'
                  onClick={handleAddToCart}
                  disabled={isOut}
                >
                  <ShoppingCart className='w-4 h-4' />
                </Button>
              )}
            </div>
          </div>

          <p className='text-xs text-muted-foreground line-clamp-2'>{product.description}</p>

          <div className='flex items-center justify-between'>
            <div className='flex items-baseline gap-2'>
              <span className='text-lg font-bold'>₦{displayPrice.toLocaleString()}</span>
              {hasDiscount && (
                <span className='text-xs line-through text-muted-foreground'>
                  ₦{basePrice.toLocaleString()}
                </span>
              )}
            </div>
            <div
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
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
