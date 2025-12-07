'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import apiService from '@/lib/apiService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, 'Password is required'),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const redirect = searchParams.get('redirect') || '/';

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: apiService.auth.login,
    onSuccess: (data) => {
      toast.success('Logged in successfully');
      queryClient.setQueryData(['auth-user'], data); // Optimistically update auth state
      queryClient.invalidateQueries({ queryKey: ['auth-user'] }); // Ensure fresh data
      router.push(redirect);
    },
    onError: (error: any) => {
      console.error('LOGIN ERROR DETAILS:', error);
      toast.error(error?.response?.data?.message || 'Failed to login');
    },
  });

  function onSubmit(values: LoginValues) {
    mutate(values);
  }

  return (
    <div className='w-full max-w-md space-y-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold'>Welcome Back</h1>
        <p className='text-muted-foreground'>Enter your email to sign in to your account</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder='m@example.com' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center justify-between'>
                  <FormLabel>Password</FormLabel>
                  <Link
                    href='/auth/forgot-password'
                    className='ml-auto text-sm underline-offset-4 hover:underline'
                  >
                    ForgotPassword?
                  </Link>
                </div>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>
      <div className='mt-4 text-center text-sm'>
        Don&apos;t have an account?{' '}
        <Link href='/auth/signup' className='underline'>
          Sign up
        </Link>
      </div>
    </div>
  );
}
