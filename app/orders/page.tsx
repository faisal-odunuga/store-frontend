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
  console.log(orders);
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
    <div className='container mx-auto mx-auto px-4 py-8'>
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
          {orders.map((order) => {
            const firstItem = order.orderItems?.[0]?.product;
            const otherItemsCount = (order.orderItems?.length || 0) - 1;

            return (
              <Link href={`/orders/${order.id}`} key={order.id} className='block group'>
                <div className='border rounded-lg p-3 bg-card group-hover:shadow-md transition-all group-hover:border-primary/50 flex gap-4 items-start'>
                  <div className='shrink-0 w-24 h-24 bg-secondary/10 rounded-md overflow-hidden border relative'>
                    <img
                      src={firstItem?.imageUrl || '/placeholder.png'}
                      alt={firstItem?.name || 'Order'}
                      className='w-full h-full object-cover'
                    />
                    {otherItemsCount > 0 && (
                      <div className='absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-tl-md'>
                        +{otherItemsCount} more
                      </div>
                    )}
                  </div>

                  <div className='flex flex-col flex-1 min-w-0 gap-1'>
                    <h2 className='font-semibold text-sm md:text-base truncate pr-2'>
                      {firstItem?.name || `Order #${order.id.slice(0, 8)}`}
                    </h2>
                    <p className='text-xs text-muted-foreground'>Order {order.id}</p>

                    <div className='mt-2 flex flex-col sm:flex-row sm:items-center gap-2'>
                      <Badge
                        variant={order.status === 'DELIVERED' ? 'default' : 'secondary'}
                        className='w-fit text-[10px] px-2 py-0.5 h-5'
                      >
                        {order.status}
                      </Badge>
                      <p className='text-xs text-muted-foreground'>
                        On{' '}
                        {order.createdAt ? format(new Date(order.createdAt), 'dd-MM-yyyy') : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
