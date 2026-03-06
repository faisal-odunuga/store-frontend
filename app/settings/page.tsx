'use client';

import RequireCustomer from '@/components/auth/require-customer';
import { UserProfile } from '@clerk/nextjs';

export default function SettingsPage() {
  return (
    <RequireCustomer>
      <div className='container mx-auto max-w-4xl px-4 py-8'>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold'>Settings</h1>
          <p className='text-muted-foreground mt-2'>Manage your account settings</p>
        </div>
        <UserProfile routing='hash' />
      </div>
    </RequireCustomer>
  );
}
