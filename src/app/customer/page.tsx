'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomerLoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to mobile login page
    router.replace('/customer/mobile-login');
  }, [router]);

  return null; // This page will redirect immediately
}
