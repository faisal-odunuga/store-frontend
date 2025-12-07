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
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z
    .string()
    .length(11, 'Phone number must be exactly 11 digits')
    .optional()
    .or(z.literal('')),
  address: z.string().optional(),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      phone: '',
      address: '',
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: apiService.auth.signup,
    onSuccess: (data) => {
      toast.success('Account created successfully');
      queryClient.setQueryData(['auth-user'], { data });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      router.push('/');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create account');
    },
  });

  function onSubmit(values: SignupValues) {
    mutate(values);
  }

  return (
    <div className='w-full max-w-md space-y-6 p-6 rounded-lg border bg-card text-card-foreground shadow-sm'>
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold'>Create an account</h1>
        <p className='text-muted-foreground'>Enter your information to get started</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder='John Doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='phone'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder='08012345678' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='address'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder='123 Main St' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full' disabled={isPending}>
            {isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </Form>
      <div className='mt-4 text-center text-sm'>
        Already have an account?{' '}
        <Link href='/auth/login' className='underline'>
          Sign in
        </Link>
      </div>
    </div>
  );
}
