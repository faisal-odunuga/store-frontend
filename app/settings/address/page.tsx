'use client';

import React, { useState } from 'react';
import { Trash2, Edit, Check, MapPin, Star } from 'lucide-react';
import { useAddresses, useAddressActions } from '@/hooks/useAddresses';
import RequireCustomer from '@/components/auth/require-customer';
import BackButton from '@/components/ui/back-button';
import { AutoBreadcrumb } from '@/components/ui/auto-breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

type AddressFormState = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
};

const emptyForm: AddressFormState = {
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false,
};

export default function AddressPage() {
  const { data, isLoading } = useAddresses();
  const { upsert, remove, setDefault } = useAddressActions();
  const addresses = data?.addresses || [];

  const [form, setForm] = useState<AddressFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.street || !form.city || !form.postalCode || !form.country) return;

    upsert.mutate(
      { id: editingId ?? undefined, data: form },
      {
        onSuccess: () => {
          setForm(emptyForm);
          setEditingId(null);
        },
      },
    );
  };

  const startEdit = (addr: any) => {
    setEditingId(addr.id);
    setForm({
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || '',
      postalCode: addr.postalCode || '',
      country: addr.country || '',
      isDefault: !!addr.isDefault,
    });
  };

  const listEmpty = !isLoading && addresses.length === 0;

  return (
    <RequireCustomer>
      <div className='container mx-auto px-4 md:px-10 lg:px-24 py-8 space-y-6'>
        <BackButton className='mb-2' />
        <AutoBreadcrumb className='mb-4' />
        <div className='flex items-center justify-between flex-wrap gap-3'>
          <div>
            <h1 className='text-3xl font-bold'>My Addresses</h1>
            <p className='text-muted-foreground'>Manage delivery locations and defaults.</p>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-2 space-y-4'>
            {listEmpty && (
              <div className='rounded-xl border p-6 text-center text-muted-foreground'>
                No addresses yet. Add one on the right.
              </div>
            )}

            {addresses.map((addr: any) => (
              <div
                key={addr.id}
                className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl border p-4'
              >
                <div className='flex items-start gap-3'>
                  <div className='mt-1 text-primary'>
                    {addr.isDefault ? (
                      <Star className='h-5 w-5 fill-primary' />
                    ) : (
                      <MapPin className='h-5 w-5' />
                    )}
                  </div>
                  <div>
                    <p className='font-semibold'>{addr.street}</p>
                    <p className='text-sm text-muted-foreground'>
                      {addr.city}, {addr.state} {addr.postalCode}
                    </p>
                    <p className='text-sm text-muted-foreground'>{addr.country}</p>
                    {addr.isDefault && (
                      <span className='text-xs text-primary font-semibold'>Default</span>
                    )}
                  </div>
                </div>
                <div className='flex items-center gap-2'>
                  {!addr.isDefault && (
                    <Button
                      size='sm'
                      variant='secondary'
                      onClick={() => setDefault.mutate(addr.id)}
                      disabled={setDefault.isPending}
                    >
                      <Check className='h-4 w-4 mr-1' /> Make Default
                    </Button>
                  )}
                  <Button size='sm' variant='outline' onClick={() => startEdit(addr)}>
                    <Edit className='h-4 w-4 mr-1' /> Edit
                  </Button>
                  <Button
                    size='icon'
                    variant='ghost'
                    className='text-destructive'
                    onClick={() =>
                      remove.mutate(addr.id, {
                        onSuccess: () => {
                          if (editingId === addr.id) {
                            setEditingId(null);
                            setForm(emptyForm);
                          }
                        },
                      })
                    }
                    disabled={remove.isPending}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className='rounded-xl border p-6 space-y-4 sticky top-20 bg-card'>
            <h3 className='text-lg font-semibold'>Add / Edit Address</h3>
            <form className='space-y-3' onSubmit={handleSubmit}>
              <Input
                placeholder='Street*'
                value={form.street}
                onChange={(e) => setForm((prev) => ({ ...prev, street: e.target.value }))}
              />
              <Input
                placeholder='City*'
                value={form.city}
                onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
              />
              <Input
                placeholder='State'
                value={form.state}
                onChange={(e) => setForm((prev) => ({ ...prev, state: e.target.value }))}
              />
              <Input
                placeholder='Postal Code*'
                value={form.postalCode}
                onChange={(e) => setForm((prev) => ({ ...prev, postalCode: e.target.value }))}
              />
              <Input
                placeholder='Country*'
                value={form.country}
                onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
              />
              <label className='flex items-center gap-2 text-sm font-medium'>
                <Checkbox
                  checked={form.isDefault}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isDefault: Boolean(checked) }))
                  }
                />
                Set as default
              </label>
              <div className='flex gap-2 pt-2'>
                <Button type='submit' className='flex-1' disabled={upsert.isPending}>
                  {editingId ? 'Update Address' : 'Save Address'}
                </Button>
                {editingId && (
                  <Button
                    type='button'
                    variant='ghost'
                    onClick={() => {
                      setEditingId(null);
                      setForm(emptyForm);
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </RequireCustomer>
  );
}

