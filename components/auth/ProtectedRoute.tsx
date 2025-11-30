'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, UserRole } from '@/lib/auth';
import { isAuthorizedAdmin } from '@/lib/adminAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();

  useEffect(() => {
    const user = getCurrentUser();

    // Not authenticated - redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // If admin access is required, verify against authorized admins list
    if (requiredRole === 'admin') {
      if (user.role !== 'admin' || !isAuthorizedAdmin(user.name, user.email)) {
        // Unauthorized - redirect to verification page
        router.push('/admin/verify');
        return;
      }
    }

    // Wrong role - redirect to their dashboard
    if (user.role !== requiredRole) {
      const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      router.push(redirectPath);
      return;
    }
  }, [router, requiredRole]);

  return <>{children}</>;
}
