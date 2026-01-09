'use client';

import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import apiService from '@/lib/apiService';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import BackButton from '@/components/ui/back-button';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const totalPrice = getTotalPrice();
  // Checkout Mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const orderRes = await apiService.orders.create();
      return orderRes?.data?.authorization_url;
    },
    onSuccess: (authUrl) => {
      if (authUrl) {
        window.location.href = authUrl;
      } else {
        toast.error('No payment URL returned');
      }
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Checkout failed. Please try again.');
    },
  });

  const handleCheckout = () => {
    checkoutMutation.mutate();
  };

  if (items.length === 0) {
    return (
      <div className='min-h-[60vh] flex flex-col items-center justify-center p-4'>
        <h2 className='text-2xl font-bold mb-4'>Your cart is empty</h2>
        <p className='text-muted-foreground mb-8'>
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button asChild>
          <Link href='/products'>Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto mx-auto px-4 py-8 max-w-5xl'>
      <BackButton className='mb-4' />
      <h1 className='text-3xl font-bold mb-8'>Shopping Cart</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-4'>
          {items.map((item) => (
            <div
              key={item.id}
              className='flex gap-4 p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors'
            >
              <div className='h-24 w-24 bg-white rounded-md overflow-hidden flex-shrink-0 border'>
                <img
                  src={item.product.imageUrl || '/placeholder.png'}
                  alt={item.product.name}
                  className='h-full w-full object-contain'
                />
              </div>

              <div className='flex-1 flex flex-col justify-between'>
                <div className='flex justify-between items-start gap-2'>
                  <div>
                    <h3 className='font-semibold'>{item.product.name}</h3>
                    <p className='text-sm text-muted-foreground'>{item.product.category}</p>
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-destructive h-8 w-8 hover:bg-destructive/10'
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>

                <div className='flex justify-between items-center mt-4'>
                  <div className='flex items-center gap-2 border rounded-md p-1 bg-background'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6 rounded-sm'
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    >
                      <Minus className='h-3 w-3' />
                    </Button>
                    <span className='w-8 text-center text-sm font-medium'>{item.quantity}</span>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-6 w-6 rounded-sm'
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className='h-3 w-3' />
                    </Button>
                  </div>
                  <p className='font-bold'>
                    ₦{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div className='flex justify-end pt-4'>
            <Button
              variant='outline'
              className='text-sm text-muted-foreground hover:text-destructive'
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className='lg:col-span-1'>
          <div className='rounded-lg border bg-card p-6 shadow-sm sticky top-24'>
            <h2 className='text-xl font-semibold mb-4'>Order Summary</h2>
            <div className='space-y-3 mb-6'>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Shipping</span>
                <span className='text-green-600 font-medium'>Free</span>
              </div>
              <div className='border-t pt-3 flex justify-between font-bold text-lg'>
                <span>Total</span>
                <span>₦{totalPrice.toLocaleString()}</span>
              </div>
            </div>

            <Button
              className='w-full h-12 text-lg'
              size='lg'
              onClick={handleCheckout}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? 'Processing...' : 'Checkout'}{' '}
              <ArrowRight className='ml-2 h-4 w-4' />
            </Button>
            <p className='text-xs text-center text-muted-foreground mt-4'>
              Secure Checkout powered by Paystack
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
