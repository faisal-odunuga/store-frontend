'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from '@/lib/apiService';
import { notify } from '@/lib/notify';

export function useAddresses() {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: () => apiService.addresses.list(),
  });
}

export const useAddressActions = () => {
  const qc = useQueryClient();

  const upsert = useMutation({
    mutationFn: ({ id, data }: { id?: string; data: any }) => {
      if (id) return apiService.addresses.update(id, data);
      return apiService.addresses.create(data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      notify.success('Address saved');
    },
    onError: (err: any) => {
      notify.error('Could not save address', err?.response?.data?.message);
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => apiService.addresses.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      notify.info('Address removed');
    },
    onError: (err: any) => notify.error('Could not delete address', err?.response?.data?.message),
  });

  const setDefault = useMutation({
    mutationFn: (id: string) => apiService.addresses.update(id, { isDefault: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      notify.success('Default address updated');
    },
    onError: (err: any) => notify.error('Could not set default', err?.response?.data?.message),
  });

  return { upsert, remove, setDefault };
};

export default useAddresses;
