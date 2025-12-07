'use client';

import { useQuery } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/cart';

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference');
  const router = useRouter();
  const { clearCart } = useCart();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['verify-payment', reference],
    queryFn: () => apiService.payment.verify(reference as string),
    enabled: !!reference,
    retry: false,
  });

  useEffect(() => {
    if (data?.status === 'Success') {
      clearCart();
    }
  }, [data, clearCart]);

  if (!reference) {
    return <div className='p-8 text-center text-red-500'>Invalid Payment Reference</div>;
  }

  return (
    <div className='min-h-[80vh] flex items-center justify-center bg-muted/20 p-4'>
      <Card className='max-w-md w-full text-center p-6'>
        <CardContent className='space-y-6 pt-6'>
          {isLoading ? (
            <div className='flex flex-col items-center gap-4'>
              <div className='h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin'></div>
              <p className='text-lg font-medium'>Verifying Payment...</p>
            </div>
          ) : isError || data?.status !== 'Success' ? (
            <div className='flex flex-col items-center gap-4'>
              <XCircle className='h-16 w-16 text-red-500' />
              <div>
                <h1 className='text-2xl font-bold text-destructive'>Payment Failed</h1>
                <p className='text-muted-foreground mt-2'>We couldn&apos;t verify your payment.</p>
              </div>
              <Button onClick={() => router.push('/cart')} variant='outline' className='w-full'>
                Try Again
              </Button>
            </div>
          ) : (
            <div className='flex flex-col items-center gap-4'>
              <CheckCircle2 className='h-16 w-16 text-green-500' />
              <div>
                <h1 className='text-2xl font-bold text-green-600'>Payment Successful!</h1>
                <p className='text-muted-foreground mt-2'>Thank you for your order.</p>
              </div>
              <Button onClick={() => router.push('/orders')} className='w-full'>
                View Orders <ArrowRight className='ml-2 h-4 w-4' />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
