'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import apiService from '@/lib/apiService';
import { Button } from '@/components/ui/button';

/**
 * CustomerGate manages access to the storefront.
 * It relies on auth.me to verify the user exists in our DB and has the CUSTOMER role.
 */
export default function CustomerGate({ children }: { children: React.ReactNode }) {
  const { signOut } = useClerk();
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || '/';

  // Define public routes that don't need enforcement
  const isAuthRoute = pathname?.startsWith('/auth');

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['auth-me'],
    queryFn: apiService.auth.me,
    enabled: isLoaded && isSignedIn && !isAuthRoute,
    retry: 1,
    staleTime: 300_000, // 5 minutes cache
  });

  React.useEffect(() => {
    if (isSignedIn && error?.response?.status === 401) {
      const timer = window.setTimeout(() => {
        refetch();
      }, 1200);
      return () => window.clearTimeout(timer);
    }
  }, [isSignedIn, error, refetch]);

  // If we are on a login/signup page, don't gate it
  if (isAuthRoute) {
    return <>{children}</>;
  }

  if (!isLoaded) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center text-muted-foreground'>
        Checking session...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className='min-h-[60vh] flex items-center justify-center p-6'>
        <div className='max-w-md w-full text-center space-y-4 border rounded-2xl bg-card p-8'>
          <h2 className='text-2xl font-bold'>Welcome back</h2>
          <p className='text-sm text-muted-foreground'>Please sign in to continue shopping.</p>
          <div className='flex flex-col gap-3'>
            <Button asChild>
              <Link href='/auth/login'>Sign in</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/auth/signup'>Create account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center text-muted-foreground'>
        Verifying access...
      </div>
    );
  }

  // The interceptor handles 401. If we're here, we show fallback UI.
  if (isError || !data?.user) {
    const isUnauthorized = error?.response?.status === 401;
    return (
      <div className='min-h-[60vh] flex items-center justify-center p-6'>
        <div className='max-w-md w-full text-center space-y-4 border rounded-2xl bg-card p-8'>
          <h2 className='text-2xl font-bold'>
            {isUnauthorized ? 'Syncing your account' : 'Access Denied'}
          </h2>
          <div className='text-sm text-muted-foreground py-2'>
            {isUnauthorized
              ? 'We are preparing your customer profile. Please wait a moment...'
              : error?.response?.data?.message ||
                "We couldn't verify your customer profile. Please sign in with a registered account."}
          </div>
          <div className='flex flex-col gap-3'>
            {isUnauthorized && (
              <Button onClick={() => refetch()}>Retry</Button>
            )}
            <Button variant='outline' onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const user = data?.user;

  if (user.role !== 'CUSTOMER') {
    return (
      <div className='min-h-[60vh] flex items-center justify-center p-6'>
        <div className='max-w-md w-full text-center space-y-4 border rounded-2xl bg-card p-8'>
          <h2 className='text-2xl font-bold'>Staff account detected</h2>
          <p className='text-sm text-muted-foreground'>
            This storefront is for customers only. Please use the admin panel for management.
          </p>
          <div className='flex flex-col gap-3'>
            <Button asChild>
              <Link href={adminUrl}>Go to Admin Panel</Link>
            </Button>
            <Button variant='outline' onClick={() => signOut()}>
              Sign out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
