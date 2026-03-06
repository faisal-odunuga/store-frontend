'use client';

import BackButton from '@/components/ui/back-button';
import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <section className='container mx-auto relative flex h-screen flex-col items-center justify-center'>
      <div className='absolute left-4 top-4 md:left-8 md:top-8 z-20'>
        <BackButton />
      </div>
      <SignIn routing='hash' />
    </section>
  );
}
