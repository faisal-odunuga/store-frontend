'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, Lock, MapPin, Phone, UserRound, Mail } from 'lucide-react';

import { useCart } from '@/lib/cart';
import apiService from '@/lib/apiService';
import { notify } from '@/lib/notify';
import { useAddresses } from '@/hooks/useAddresses';
import RequireCustomer from '@/components/auth/require-customer';
import BackButton from '@/components/ui/back-button';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AutoBreadcrumb } from '@/components/ui/auto-breadcrumb';
import { computeProductComputed } from '@/lib/productComputed';

export default function CheckoutPage() {
  const { cart, clearCart, getTotalPrice } = useCart();
  const { data: addressData } = useAddresses();
  const addresses = addressData?.addresses || [];

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [addressId, setAddressId] = useState<string | undefined>(undefined);

  const totalPrice = getTotalPrice();

  const payloadItems = useMemo(
    () => cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
    [cart],
  );

  const checkoutMutation = useMutation({
    mutationFn: async () => {
      if (!payloadItems.length) throw new Error('Cart is empty');
      if (!addressId && !shippingAddress.trim()) {
        throw new Error('Select or enter a shipping address');
      }

      const res = await apiService.orders.create({
        items: payloadItems,
        addressId,
        shippingAddress: shippingAddress.trim() || undefined,
        contactName: contactName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        paymentMethod: 'PAYSTACK',
      });

      const paymentUrl = res?.payment?.authorization_url;
      if (!paymentUrl) throw new Error('Payment link missing');
      return paymentUrl;
    },
    onSuccess: (url) => {
      notify.success('Redirecting to payment...');
      clearCart();
      window.location.href = url;
    },
    onError: (err: any) => {
      notify.error('Checkout failed', err?.response?.data?.message || err?.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkoutMutation.mutate();
  };

  return (
    <RequireCustomer>
      <div className='relative flex flex-col w-full min-h-screen overflow-x-hidden bg-background'>
        <main className='flex-1 container mx-auto px-4 md:px-10 lg:px-24 py-8'>
          <AutoBreadcrumb className='mb-6' />
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-10'>
            <div className='lg:col-span-2 space-y-8'>
              <div>
                <h2 className='text-3xl font-bold mb-1'>Checkout</h2>
                <p className='text-muted-foreground'>Provide your details and delivery address.</p>
              </div>

              <form className='space-y-8' onSubmit={handleSubmit}>
                <section className='space-y-6'>
                  <h3 className='text-lg font-semibold flex items-center gap-2'>
                    <UserRound className='h-4 w-4 text-primary' /> Contact Details
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium'>Full Name</label>
                      <Input
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder='Jane Doe'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium flex items-center gap-1'>
                        <Mail className='h-4 w-4 text-primary' /> Email
                      </label>
                      <Input
                        type='email'
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder='you@example.com'
                        required
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='text-sm font-medium flex items-center gap-1'>
                        <Phone className='h-4 w-4 text-primary' /> Phone
                      </label>
                      <Input
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder='+234 801 234 5678'
                        required
                      />
                    </div>
                  </div>
                </section>

                <section className='space-y-4'>
                  <h3 className='text-lg font-semibold flex items-center gap-2'>
                    <MapPin className='h-4 w-4 text-primary' /> Shipping Address
                  </h3>
                  <div className='space-y-3'>
                    {addresses.length > 0 && (
                      <div className='space-y-2'>
                        <p className='text-sm text-muted-foreground'>Select a saved address</p>
                        <div className='space-y-2'>
                          {addresses.map((addr: any) => (
                            <label
                              key={addr.id}
                              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                addressId === addr.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-border'
                              }`}
                            >
                              <input
                                type='radio'
                                name='address'
                                value={addr.id}
                                checked={addressId === addr.id}
                                onChange={() => {
                                  setAddressId(addr.id);
                                  setShippingAddress('');
                                }}
                                className='mt-1'
                              />
                              <div className='text-sm'>
                                <p className='font-semibold'>{addr.street}</p>
                                <p className='text-muted-foreground'>
                                  {addr.city}, {addr.state} {addr.postalCode}
                                </p>
                                <p className='text-muted-foreground'>{addr.country}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className='space-y-2'>
                      <p className='text-sm text-muted-foreground'>Or enter a new address</p>
                      <Textarea
                        value={shippingAddress}
                        onChange={(e) => {
                          setShippingAddress(e.target.value);
                          if (e.target.value.trim()) setAddressId(undefined);
                        }}
                        placeholder='House number, street, city, state, country'
                        className='min-h-[96px]'
                      />
                    </div>
                  </div>
                </section>

                <div className='pt-2'>
                  <Button
                    type='submit'
                    className='h-12 px-6 text-base'
                    disabled={checkoutMutation.isPending}
                  >
                    {checkoutMutation.isPending ? 'Processing...' : 'Pay with Paystack'}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <aside className='w-full lg:w-[360px]'>
              <div className='glass-effect rounded-2xl p-6 border border-primary/20 sticky top-20 space-y-6'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-lg font-semibold'>Order Summary</h3>
                  <span className='text-sm text-muted-foreground'>{cart.length} items</span>
                </div>

                <div className='space-y-4 max-h-[260px] overflow-y-auto pr-1'>
                  {cart.map((item) => {
                    const { primaryImage, displayPrice: price } = computeProductComputed(item.product);
                    return (
                      <div key={item.id} className='flex gap-3 items-center'>
                        <div className='relative h-14 w-14 rounded-lg overflow-hidden bg-muted'>
                          <Image
                            src={primaryImage}
                            alt={item.product.name}
                            fill
                            className='object-cover'
                            sizes='56px'
                          />
                        </div>
                        <div className='flex-1'>
                          <p className='text-sm font-medium line-clamp-2'>{item.product.name}</p>
                          <p className='text-xs text-muted-foreground'>Qty: {item.quantity}</p>
                        </div>
                        <div className='text-sm font-semibold'>
                          ₦{(price * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <hr className='border-primary/10' />
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between text-muted-foreground'>
                    <span>Subtotal</span>
                    <span className='text-foreground'>₦{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className='flex justify-between text-muted-foreground'>
                    <span>Shipping</span>
                    <span className='text-primary'>Free</span>
                  </div>
                  <div className='flex justify-between text-lg font-bold pt-2'>
                    <span>Total</span>
                    <span>₦{totalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <div className='flex items-center gap-3 text-xs text-muted-foreground pt-2'>
                  <Lock className='h-4 w-4 text-primary' />
                  <span>Secure payment powered by Paystack</span>
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </RequireCustomer>
  );
}
