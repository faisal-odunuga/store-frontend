import LoginForm from '@/components/auth/login-form';
import BackButton from '@/components/ui/back-button';

export default function LoginPage() {
  return (
    <div className='container relative flex h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <div className='absolute left-4 top-4 md:left-8 md:top-8 z-20'>
        <BackButton />
      </div>
      <LoginForm />
    </div>
  );
}
