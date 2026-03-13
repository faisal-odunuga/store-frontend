'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ShieldCheck, Truck, RotateCcw, Heart, ArrowRight, Star } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Product } from '@/lib/definitions';
import BackButton from '@/components/ui/back-button';
import { extractIdFromSlug } from '@/lib/utils';
import SimilarProducts from '@/components/sections/similar-products';
import { AutoBreadcrumb } from '@/components/ui/auto-breadcrumb';
import { useWishlist } from '@/hooks/useWishlist';
import Link from 'next/link';

export default function ProductDetailsClient() {
  const params = useParams();
  const rawId = params?.id as string;
  const id = rawId ? extractIdFromSlug(rawId) : '';
  const { cart, addItem, updateQuantity, removeItem } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => apiService.product.getById(id),
    enabled: !!id,
  });

  const product = data?.product as Product;
  const images = product?.images?.length
    ? product.images
    : product?.imageUrl
      ? [product.imageUrl]
      : [];
  const primaryImage = images[0] || '/placeholder.png';
  const wished = product ? wishlist.some((w) => w.productId === product.id) : false;
  const displayPrice = product?.discountPrice ?? product?.sellingPrice ?? product?.price ?? 0;
  const originalPrice = product?.discountPrice
    ? (product?.sellingPrice ?? product?.price ?? 0)
    : null;

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 animate-pulse'>
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
      <div className='container mx-auto  px-4 py-20 text-center'>
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

  const specEntries = (() => {
    if (!product?.specs) return [];
    if (Array.isArray(product.specs)) {
      return product.specs
        .map((val: any, idx) => ({
          label: typeof val === 'string' ? val : `Spec ${idx + 1}`,
          value: typeof val === 'string' ? '' : JSON.stringify(val),
        }))
        .filter((s) => s.label || s.value);
    }
    if (typeof product.specs === 'object') {
      return Object.entries(product.specs).map(([label, value]) => ({
        label,
        value: typeof value === 'string' ? value : JSON.stringify(value),
      }));
    }
    return [];
  })();

  return (
    <div className='container mx-auto px-4 py-8 md:py-14 space-y-10'>
      <AutoBreadcrumb className='mb-2' />

      <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12'>
        {/* Gallery */}
        <div className='lg:col-span-8 space-y-4'>
          <div className='aspect-[4/5] bg-primary/5 rounded-xl overflow-hidden max-h-[520px] sm:max-h-[560px]'>
            <img src={primaryImage} alt={product.name} className='w-full h-full object-cover' />
          </div>
          <div className='grid grid-cols-2 gap-4'>
            {(images.slice(1, 3).length ? images.slice(1, 3) : [primaryImage, primaryImage]).map(
              (img, idx) => (
                <div
                  key={idx}
                  className='aspect-square bg-primary/5 rounded-xl overflow-hidden max-h-48'
                >
                  <img
                    src={img}
                    alt={`${product.name} alt ${idx}`}
                    className='w-full h-full object-cover'
                  />
                </div>
              ),
            )}
          </div>
          <div className='aspect-[16/9] bg-primary/5 rounded-xl overflow-hidden max-h-[360px]'>
            <img
              src={images[3] || primaryImage}
              alt={`${product.name} wide`}
              className='w-full h-full object-cover'
            />
          </div>
        </div>

        {/* Sticky Purchase Panel */}
        <div className='lg:col-span-4'>
          <div className='sticky top-24 space-y-8'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3 flex-wrap text-sm'>
                <span className='px-2 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-wider rounded'>
                  {product.category || 'Featured'}
                </span>
                <div className='flex items-center text-primary gap-1'>
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className='h-4 w-4 fill-primary text-primary' />
                  ))}
                  <Star className='h-4 w-4 text-primary' />
                  <span className='text-xs text-muted-foreground ml-1'>4.8 (124)</span>
                </div>
              </div>
              <h2 className='text-3xl md:text-4xl font-bold tracking-tight'>{product.name}</h2>
              <p className='text-2xl font-semibold text-primary'>
                ₦{displayPrice.toLocaleString()}
              </p>
              <p className='text-muted-foreground leading-relaxed'>{product.description}</p>
            </div>

            <div className='space-y-6 border-t border-primary/10 pt-8'>
              <div className='space-y-3'>
                {cart.find((item) => item.product.id === product.id) ? (
                  <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2 border rounded-full px-3 py-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                          const item = cart.find((i) => i.product.id === product.id);
                          if (item && item.quantity > 1) {
                            updateQuantity(product.id, item.quantity - 1);
                          } else {
                            removeItem(product.id);
                          }
                        }}
                      >
                        -
                      </Button>
                      <span className='font-semibold min-w-[2ch] text-center'>
                        {cart.find((item) => item.product.id === product.id)?.quantity || 0}
                      </span>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => {
                          const item = cart.find((i) => i.product.id === product.id);
                          if (item) updateQuantity(product.id, item.quantity + 1);
                        }}
                        disabled={
                          (cart.find((item) => item.product.id === product.id)?.quantity || 0) >=
                          product.stock
                        }
                      >
                        +
                      </Button>
                    </div>
                    <Button variant='secondary' onClick={() => removeItem(product.id)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className='flex gap-3'>
                    <Button
                      className='flex-1 h-12 text-base'
                      onClick={handleAddToCart}
                      disabled={product.stock <= 0}
                    >
                      <ShoppingCart className='mr-2 h-5 w-5' />
                      Add to Cart
                    </Button>
                    <Button
                      variant='outline'
                      size='icon'
                      className='h-12 w-12'
                      onClick={() => toggleWishlist(product.id, wished)}
                    >
                      <Heart className={`h-5 w-5 ${wished ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                  </div>
                )}
                <p className='text-xs text-muted-foreground flex items-center gap-2'>
                  <Truck className='h-4 w-4 text-primary' />
                  Free delivery in 2-4 days • Stock: {product.stock}
                </p>
              </div>

              <div className='bg-primary/5 p-4 rounded-xl space-y-3'>
                <div className='flex items-start gap-3'>
                  <ShieldCheck className='h-5 w-5 text-primary' />
                  <div className='text-sm'>
                    <p className='font-semibold'>Warranty</p>
                    <p className='text-muted-foreground'>2 years on frame and upholstery.</p>
                  </div>
                </div>
                <div className='flex items-start gap-3'>
                  <RotateCcw className='h-5 w-5 text-primary' />
                  <div className='text-sm'>
                    <p className='font-semibold'>Easy returns</p>
                    <p className='text-muted-foreground'>30 days return window.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications */}
      <section className='mt-12 md:mt-16 border-t border-primary/10 pt-12'>
        <div className='max-w-3xl space-y-6'>
          <h3 className='text-2xl font-bold'>Product Specifications</h3>
          {specEntries.length ? (
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4'>
              {specEntries.map((spec, idx) => (
                <div
                  key={idx}
                  className='flex justify-between py-3 border-b border-primary/5 text-sm'
                >
                  <span className='text-muted-foreground font-medium capitalize'>{spec.label}</span>
                  <span className='text-right'>{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>No specifications provided.</p>
          )}
        </div>
      </section>

      {/* Style it with / similar */}
      {product.category && (
        <section className='mt-16'>
          <div className='flex items-end justify-between mb-6'>
            <div>
              <h3 className='text-2xl font-bold'>Style it with</h3>
              <p className='text-muted-foreground text-sm'>
                Curated pieces to complete your space.
              </p>
            </div>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className='text-primary font-semibold text-sm flex items-center gap-1 hover:underline'
            >
              Shop the collection
              <ArrowRight className='h-4 w-4' />
            </Link>
          </div>
          <SimilarProducts
            category={product.category.toLowerCase()}
            currentProductId={product.id}
          />
        </section>
      )}
    </div>
  );
}
