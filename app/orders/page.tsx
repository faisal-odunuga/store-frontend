'use client';

import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { Order } from '@/lib/definitions';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import BackButton from '@/components/ui/back-button';

export default function OrdersPage() {
  const {
    data: orders = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['my-orders'],
    queryFn: apiService.orders.getMyOrders,
    select: (data) => data.data.orders,
  });

  // const orders = (data?.data?.orders || []) as Order[];

  if (isLoading) {
    return (
      <div className='p-8 text-center text-muted-foreground animate-pulse'>
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-8 text-center'>
        <h2 className='text-destructive font-bold mb-2'>Failed to load orders</h2>
        <p className='text-muted-foreground'>Please try logging in again.</p>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <BackButton className='mb-4' />
      <h1 className='text-2xl font-bold mb-6'>My Orders</h1>

      {orders.length === 0 ? (
        <div className='text-center py-12 bg-muted/20 rounded-lg'>
          <p className='text-lg text-muted-foreground mb-4'>
            You haven&apos;t placed any orders yet.
          </p>
          <Button asChild>
            <Link href='/products'>Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className='space-y-4'>
          {orders.map((order) => (
            <div
              key={order.id}
              className='border rounded-lg p-6 bg-card hover:shadow-md transition-shadow'
            >
              <div className='flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 border-b pb-4'>
                <div>
                  <p className='text-sm text-muted-foreground uppercase tracking-wide'>Order ID</p>
                  <p className='font-mono font-medium'>{order.id}</p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground uppercase tracking-wide'>Date</p>
                  <p className='font-medium'>
                    {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground uppercase tracking-wide'>Status</p>
                  <Badge variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className='text-sm text-muted-foreground uppercase tracking-wide'>Total</p>
                  <p className='font-bold text-lg'>${order.totalAmount?.toLocaleString()}</p>
                </div>
              </div>

              {/* If we had items in the order object, we would list them here. 
                  The API definition didn't strictly specify the structure of items in the order response list,
                  but usually it's there. For now, we focus on the summary. */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
