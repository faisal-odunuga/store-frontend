import SignupForm from '@/components/auth/signup-form';
import BackButton from '@/components/ui/back-button';

export default function SignupPage() {
  return (
    <div className='container mx-auto relative flex h-screen flex-col items-center justify-center'>
      <div className='absolute left-4 top-4 md:left-8 md:top-8 z-20'>
        <BackButton />
      </div>
      <SignupForm />
    </div>
  );
}
