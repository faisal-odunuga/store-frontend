'use client';

import { useCart } from '@/lib/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-16'>
          <div className='max-w-md mx-auto text-center space-y-6'>
            <div className='w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center'>
              <ShoppingCart className='h-12 w-12 text-muted-foreground' />
            </div>
            <h2 className='text-2xl font-bold'>Your cart is empty</h2>
            <p className='text-muted-foreground'>Add some products to get started!</p>
            <Button asChild size='lg'>
              <Link href='/'>Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <Button variant='ghost' asChild className='mb-6'>
          <Link href='/'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            Continue Shopping
          </Link>
        </Button>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2 space-y-4'>
            <h1 className='text-3xl font-bold mb-6'>Shopping Cart</h1>
            {items.map((item) => (
              <Card key={item.id}>
                <CardContent className='p-4'>
                  <div className='flex gap-4'>
                    <div className='relative w-24 h-24 bg-muted rounded-lg overflow-hidden shrink-0'>
                      <Image
                        src={item.images[0] || '/placeholder.svg'}
                        alt={item.name}
                        fill
                        className='object-cover'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <div className='flex justify-between gap-4 mb-2'>
                        <div>
                          <h3 className='font-semibold text-base leading-tight line-clamp-2'>
                            {item.name}
                          </h3>
                          <p className='text-sm text-muted-foreground'>{item.maker}</p>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          onClick={() => removeItem(item.id)}
                          className='shrink-0'
                        >
                          <Trash2 className='h-4 w-4 text-destructive' />
                        </Button>
                      </div>
                      <div className='flex items-center justify-between mt-4'>
                        <div className='flex items-center gap-3'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 bg-transparent'
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className='h-3 w-3' />
                          </Button>
                          <span className='text-sm font-semibold w-8 text-center'>
                            {item.quantity}
                          </span>
                          <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 bg-transparent'
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className='h-3 w-3' />
                          </Button>
                        </div>
                        <p className='text-lg font-bold text-primary'>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <Card className='sticky top-24'>
              <CardContent className='p-6 space-y-4'>
                <h2 className='text-xl font-bold'>Order Summary</h2>
                <Separator />
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>
                      Subtotal ({getTotalItems()} items)
                    </span>
                    <span className='font-medium'>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Shipping</span>
                    <span className='font-medium'>
                      {getTotalPrice() >= 500 ? 'Free' : '$25.00'}
                    </span>
                  </div>
                  <div className='flex justify-between text-sm'>
                    <span className='text-muted-foreground'>Tax (estimated)</span>
                    <span className='font-medium'>${(getTotalPrice() * 0.1).toFixed(2)}</span>
                  </div>
                </div>
                <Separator />
                <div className='flex justify-between text-lg font-bold'>
                  <span>Total</span>
                  <span className='text-primary'>
                    $
                    {(
                      getTotalPrice() +
                      (getTotalPrice() >= 500 ? 0 : 25) +
                      getTotalPrice() * 0.1
                    ).toFixed(2)}
                  </span>
                </div>
                <Button className='w-full' size='lg' asChild>
                  <Link href='/checkout'>Proceed to Checkout</Link>
                </Button>
                <p className='text-xs text-muted-foreground text-center'>
                  Free shipping on orders over $500
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
