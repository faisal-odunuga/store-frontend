'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { usePathname, useRouter } from 'next/navigation';

export default function RequireCustomer({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      const searchParams = new URLSearchParams({ redirect_url: pathname });
      router.push(`/auth/login?${searchParams.toString()}`);
    }
  }, [isLoaded, isSignedIn, router, pathname]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className='min-h-[50vh] flex items-center justify-center text-muted-foreground'>
        Checking access...
      </div>
    );
  }

  return <>{children}</>;
}
