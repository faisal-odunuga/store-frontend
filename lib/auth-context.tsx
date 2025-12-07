'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from './apiService';
import { User } from './definitions';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => void;
  // We can expose login/signup mutations here if needed, or just use the hook in components
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: authData, isLoading } = useQuery({
    queryKey: ['auth-user'],
    queryFn: apiService.auth.me,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const user = authData?.data?.user || null;

  const logoutMutation = useMutation({
    mutationFn: apiService.auth.logout,
    onSuccess: () => {
      queryClient.setQueryData(['auth-user'], null);
      router.push('/auth/login');
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
