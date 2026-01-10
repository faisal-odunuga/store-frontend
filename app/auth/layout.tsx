import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Login or Sign up to access your account.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
