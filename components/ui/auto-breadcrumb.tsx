'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './breadcrumb';

type AutoBreadcrumbProps = {
  className?: string;
};

const LABEL_MAP: Record<string, string> = {
  products: 'Products',
  cart: 'Cart',
  checkout: 'Checkout',
  wishlist: 'Wishlist',
  orders: 'Orders',
  settings: 'Settings',
};

const formatLabel = (seg: string) => {
  if (!seg) return '';
  const lower = seg.toLowerCase();
  if (LABEL_MAP[lower]) return LABEL_MAP[lower];
  return decodeURIComponent(seg.replace(/[-_]/g, ' '))
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ');
};

export function AutoBreadcrumb({ className }: AutoBreadcrumbProps) {
  const pathname = usePathname();
  const segments = React.useMemo(
    () => pathname.split('/').filter(Boolean),
    [pathname]
  );

  const crumbs = segments.map((seg, idx) => ({
    label: formatLabel(seg),
    href: '/' + segments.slice(0, idx + 1).join('/'),
    isLast: idx === segments.length - 1,
  }));

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href='/'>Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {crumbs.map(crumb => (
          <React.Fragment key={crumb.href}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.href}>{crumb.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export default AutoBreadcrumb;

