'use client';

import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import BackButton from '@/components/ui/back-button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => apiService.orders.getById(orderId),
    select: (data) => data.data.order,
  });
    
    console.log(order);

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8 animate-pulse'>
        <div className='h-8 w-48 bg-muted rounded mb-4'></div>
        <div className='h-64 bg-muted rounded mb-4'></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className='container mx-auto px-4 py-12 text-center'>
        <h2 className='text-2xl font-bold text-destructive mb-4'>Order not found</h2>
        <Button asChild>
          <Link href='/orders'>Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-4'>
      <BackButton className='mb-2' />

      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
        <div>
          <h1 className='text-3xl font-bold mb-2'>Order #{order.id.slice(0, 8)}</h1>
          <p className='text-muted-foreground'>
            Placed on {order.createdAt ? format(new Date(order.createdAt), 'PPP') : 'N/A'}
          </p>
        </div>
        <Badge
          variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}
          className='text-lg px-4 py-1'
        >
          {order.status}
        </Badge>
      </div>

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-2 space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-6'>
                {order.orderItems && order.orderItems.length > 0 ? (
                  order.orderItems.map((item: any, index: number) => (
                    <div key={index} className='flex gap-4'>
                      <div className='h-20 w-20 rounded-md overflow-hidden bg-secondary/10 shrink-0 border'>
                        <img
                          src={item.product?.imageUrl || '/placeholder.png'}
                          alt={item.product?.name || 'Product'}
                          className='h-full w-full object-cover'
                        />
                      </div>
                      <div className='flex-1'>
                        <h3 className='font-medium text-base md:text-lg mb-1 line-clamp-2'>
                          {item.product?.name || 'Unknown Product'}
                        </h3>
                        <p className='text-sm text-muted-foreground mb-2'>
                          Qty: {item.quantity} × ₦
                          {item.price?.toLocaleString() ||
                            item.product?.price?.toLocaleString() ||
                            0}
                        </p>
                      </div>
                      <div className='text-right'>
                        <p className='font-bold'>
                          ₦
                          {(
                            (item.price || item.product?.price || 0) * item.quantity
                          ).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className='text-muted-foreground'>No items details available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6'>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span>₦{order.totalAmount?.toLocaleString()}</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className='flex justify-between font-bold text-lg'>
                <span>Total</span>
                <span>₦{order.totalAmount?.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Customer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-2 text-sm'>
                <div>
                  <span className='font-medium block'>Name</span>
                  <span className='text-muted-foreground'>{order.user?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className='font-medium block'>Email</span>
                  <span className='text-muted-foreground'>{order.user?.email || 'N/A'}</span>
                </div>
                {order.user?.address && (
                  <div>
                    <span className='font-medium block'>Shipping Address</span>
                    <span className='text-muted-foreground'>{order.user.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
