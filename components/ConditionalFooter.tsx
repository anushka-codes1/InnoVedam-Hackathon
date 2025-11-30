/**
 * ConditionalFooter Component
 * 
 * Purpose: Controls the visibility of the footer across different pages
 * - Shows footer on public pages (landing, login, signup, user dashboard)
 * - Hides footer on admin pages to provide a cleaner admin interface
 * 
 * @returns Footer component or null based on current route
 */

'use client';

import { usePathname } from 'next/navigation';
import CampusSwapFooter from './CampusSwapFooter';

export default function ConditionalFooter() {
  // Get current pathname from Next.js navigation
  const pathname = usePathname();
  
  // Don't show footer on admin pages (any route starting with /admin)
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  // Show footer on all other pages
  return <CampusSwapFooter />;
}
