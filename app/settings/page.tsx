'use client';

import RequireCustomer from '@/components/auth/require-customer';
import { UserProfile } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AutoBreadcrumb } from '@/components/ui/auto-breadcrumb';
import { MapPin } from 'lucide-react';

export default function SettingsPage() {
  return (
    <RequireCustomer>
      <div className='container mx-auto max-w-4xl px-4 py-8 space-y-6'>
        <AutoBreadcrumb />
        <div>
          <h1 className='text-3xl font-bold'>Settings</h1>
          <p className='text-muted-foreground mt-2'>Manage your account settings</p>
        </div>

        <div className='rounded-xl border p-4 flex items-center justify-between gap-4 bg-card/60'>
          <div className='flex items-center gap-3'>
            <div className='h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center'>
              <MapPin className='h-5 w-5' />
            </div>
            <div>
              <p className='font-semibold'>Delivery addresses</p>
              <p className='text-sm text-muted-foreground'>
                Add, edit, and set your default shipping address.
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href='/settings/address'>Manage</Link>
          </Button>
        </div>

        <UserProfile routing='hash' />
      </div>
    </RequireCustomer>
  );
}
