'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/back-button';
import RequireCustomer from '@/components/auth/require-customer';
import { AutoBreadcrumb } from '@/components/ui/auto-breadcrumb';
export default function CartPage() {
  const { cart, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();

  if (cart.length === 0) {
    return (
      <RequireCustomer>
        <div className='min-h-[60vh] flex flex-col items-center justify-center p-4'>
          <h2 className='text-2xl font-bold mb-4'>Your cart is empty</h2>
          <p className='text-muted-foreground mb-8'>
            Looks like you haven&apos;t added anything yet.
          </p>
          <Button asChild>
            <Link href='/products'>Start Shopping</Link>
          </Button>
        </div>
      </RequireCustomer>
    );
  }

  return (
    <RequireCustomer>
      <div className='relative flex flex-col w-full min-h-screen overflow-x-hidden bg-background'>
        <main className='flex-1 container mx-auto px-4 md:px-10 lg:px-24 py-8'>
          <AutoBreadcrumb className='mb-6' />
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Cart Items */}
            <div className='flex-1 space-y-6'>
              <div className='flex items-end justify-between border-b border-primary/10 pb-4'>
                <h2 className='text-3xl md:text-4xl font-black tracking-tight'>Your Cart</h2>
                <p className='text-primary font-medium'>{cart.length} items selected</p>
              </div>

              {cart.map((item) => {
                const price =
                  item.product.discountPrice ?? item.product.sellingPrice ?? item.product.price;
                return (
                  <div
                    key={item.id}
                    className='glass-effect rounded-xl p-4 md:p-6 flex flex-col md:flex-row gap-6 items-center border border-primary/10'
                  >
                    <div className='bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-28 md:size-32 border border-primary/10 relative overflow-hidden'>
                      <Image
                        src={
                          item.product.imageUrl || item.product.images?.[0] || '/placeholder.png'
                        }
                        alt={item.product.name}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 120px, 160px'
                      />
                    </div>
                    <div className='flex-1 w-full'>
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <h3 className='text-lg font-bold leading-snug'>{item.product.name}</h3>
                          <p className='text-sm text-muted-foreground'>{item.product.category}</p>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='text-muted-foreground hover:text-destructive'
                          onClick={() => removeItem(item.product.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>

                      <div className='flex items-center justify-between mt-6 gap-4 flex-wrap'>
                        <div className='flex items-center gap-1 bg-primary/5 rounded-lg p-1 border border-primary/10'>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 rounded-md'
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          >
                            <Minus className='h-4 w-4' />
                          </Button>
                          <span className='w-10 text-center font-bold'>{item.quantity}</span>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 rounded-md'
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          >
                            <Plus className='h-4 w-4' />
                          </Button>
                        </div>
                        <div className='text-right'>
                          <p className='text-xl font-black text-primary'>
                            ₦{(price * item.quantity).toLocaleString()}
                          </p>
                          <p className='text-xs text-muted-foreground'>
                            ₦{price.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className='flex justify-between items-center pt-2'>
                <Button
                  variant='outline'
                  className='text-sm text-muted-foreground hover:text-destructive'
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
                <Button asChild>
                  <Link href='/checkout'>Proceed to Checkout</Link>
                </Button>
              </div>
            </div>

            {/* Summary */}
            <aside className='w-full lg:w-[380px]'>
              <div className='glass-effect rounded-2xl p-6 lg:p-8 sticky top-24 border border-primary/20'>
                <h2 className='text-xl font-bold mb-6'>Order Summary</h2>
                <div className='space-y-4 mb-6 pb-6 border-b border-primary/10'>
                  <div className='flex justify-between text-muted-foreground'>
                    <span>Subtotal</span>
                    <span className='font-medium text-foreground'>
                      ₦{totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className='flex justify-between text-muted-foreground'>
                    <span>Shipping</span>
                    <span className='font-medium text-primary'>FREE</span>
                  </div>
                </div>
                <div className='flex justify-between items-end mb-8'>
                  <div>
                    <p className='text-xs uppercase tracking-widest font-bold text-muted-foreground'>
                      Total
                    </p>
                    <p className='text-4xl font-black'>₦{totalPrice.toLocaleString()}</p>
                  </div>
                </div>
                <Button asChild className='w-full h-12 text-base'>
                  <Link href='/checkout'>Checkout</Link>
                </Button>
                <p className='text-xs text-center text-muted-foreground mt-2'>
                  Secure Checkout powered by Paystack
                </p>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </RequireCustomer>
  );
}
