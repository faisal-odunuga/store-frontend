'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Order } from '@/lib/definitions';
import { format } from 'date-fns';

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: apiService.orders.getAllOrders,
    select: (data) => data.data.orders,
  });

  const handleStatusChange = (id: string, status: string) => {
    mutate({ id, status });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'PROCESSING':
        return 'bg-blue-500';
      case 'SHIPPED':
        return 'bg-purple-500';
      case 'DELIVERED':
        return 'bg-green-500';
      case 'CANCELLED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) return <div>Loading orders...</div>;

  return (
    <div className='space-y-6'>
      <h1 className='text-3xl font-bold'>Orders Management</h1>
      <div className='rounded-md border bg-card overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className='font-mono text-xs'>{order.id.slice(0, 8)}...</TableCell>
                <TableCell>
                  {order.createdAt ? format(new Date(order.createdAt), 'MMM dd, yyyy') : 'N/A'}
                </TableCell>
                <TableCell>{order.user.name}</TableCell>
                <TableCell>${order.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge
                    className={`${getStatusColor(order.status)} text-white hover:${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(value) => handleStatusChange(order.id, value)}
                  >
                    <SelectTrigger className='w-[140px]'>
                      <SelectValue placeholder='Status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='PENDING'>Pending</SelectItem>
                      <SelectItem value='PROCESSING'>Processing</SelectItem>
                      <SelectItem value='SHIPPED'>Shipped</SelectItem>
                      <SelectItem value='DELIVERED'>Delivered</SelectItem>
                      <SelectItem value='CANCELLED'>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className='text-center h-24'>
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
