'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User, Lock, Mail, Shield } from 'lucide-react';

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  const { mutate: changePassword, isPending } = useMutation({
    mutationFn: (data: { oldPassword: string; newPassword: string }) =>
      apiService.auth.changePassword(data),
    onSuccess: () => {
      toast.success('Password changed successfully');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    changePassword({ oldPassword, newPassword });
  };

  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className='container max-w-4xl mx-auto px-4 py-8'>
      <div className='space-y-6'>
        <div>
          <h1 className='text-3xl font-bold'>Settings</h1>
          <p className='text-muted-foreground mt-2'>Manage your account settings and preferences</p>
        </div>

        <Separator />

        {/* User Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <User className='h-5 w-5' />
              Profile Information
            </CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                  <User className='h-4 w-4' />
                  Name
                </Label>
                <p className='text-lg font-medium'>{user.name}</p>
              </div>
              <div className='space-y-2'>
                <Label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                  <Mail className='h-4 w-4' />
                  Email
                </Label>
                <p className='text-lg font-medium'>{user.email}</p>
              </div>
            </div>
            <div className='space-y-2'>
              <Label className='text-sm font-medium text-muted-foreground flex items-center gap-2'>
                <Shield className='h-4 w-4' />
                Role
              </Label>
              <div>
                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>{user.role}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Change Section */}
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <Lock className='h-5 w-5' />
              Change Password
            </CardTitle>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='oldPassword'>Current Password</Label>
                <Input
                  id='oldPassword'
                  type='password'
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder='Enter your current password'
                  disabled={isPending}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='newPassword'>New Password</Label>
                <Input
                  id='newPassword'
                  type='password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder='Enter your new password'
                  disabled={isPending}
                />
                <p className='text-xs text-muted-foreground'>
                  Password must be at least 6 characters long
                </p>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='confirmPassword'>Confirm New Password</Label>
                <Input
                  id='confirmPassword'
                  type='password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder='Confirm your new password'
                  disabled={isPending}
                />
              </div>
              <Button type='submit' disabled={isPending} className='w-full md:w-auto'>
                {isPending ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
