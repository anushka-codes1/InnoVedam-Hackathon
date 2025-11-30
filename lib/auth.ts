// Auth utilities for role-based access control
export type UserRole = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const user = localStorage.getItem('authUser');
  return !!user;
};

// Get current user from localStorage
export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem('authUser');
  if (!user) return null;
  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

// Check if user has specific role
export const hasRole = (role: UserRole): boolean => {
  const user = getCurrentUser();
  return user?.role === role;
};

// Login user
export const loginUser = (user: AuthUser): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authUser', JSON.stringify(user));
};

// Logout user
export const logoutUser = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authUser');
  localStorage.removeItem('rememberedCredentials');
};

// Get redirect path based on role
export const getRedirectPath = (role: UserRole): string => {
  return role === 'admin' ? '/admin/dashboard' : '/dashboard';
};
