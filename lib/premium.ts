// Premium Subscription Management

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'delivery' | 'listing' | 'trust' | 'support' | 'analytics';
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: 'priority-delivery',
    name: 'Priority Delivery (1 Hour)',
    description: 'Lender delivers directly to you within 60 minutes, guaranteed',
    icon: '⚡',
    category: 'delivery',
  },
  {
    id: 'unlimited-listings',
    name: 'Unlimited Listings',
    description: 'List as many items as you want with no restrictions',
    icon: '📦',
    category: 'listing',
  },
  {
    id: 'featured-listings',
    name: 'Featured Listings',
    description: 'Your items appear at the top of search results',
    icon: '⭐',
    category: 'listing',
  },
  {
    id: 'trust-boost',
    name: 'Trust Score Boost',
    description: '+10 instant trust score bonus and faster trust growth',
    icon: '🛡️',
    category: 'trust',
  },
  {
    id: 'extended-rental',
    name: 'Extended Rental Periods',
    description: 'Rent items for up to 30 days (regular: 7 days max)',
    icon: '📅',
    category: 'listing',
  },
  {
    id: 'priority-support',
    name: '24/7 Priority Support',
    description: 'Dedicated customer support with instant response',
    icon: '💬',
    category: 'support',
  },
  {
    id: 'analytics-dashboard',
    name: 'Advanced Analytics',
    description: 'Detailed insights on your earnings, views, and performance',
    icon: '📊',
    category: 'analytics',
  },
  {
    id: 'no-transaction-fees',
    name: 'Zero Transaction Fees',
    description: 'Save ₹3 on every transaction (regular users pay ₹3)',
    icon: '💰',
    category: 'trust',
  },
  {
    id: 'verified-badge',
    name: 'Premium Verified Badge',
    description: 'Stand out with an exclusive ✓ Premium badge on your profile',
    icon: '✓',
    category: 'trust',
  },
  {
    id: 'early-access',
    name: 'Early Access to New Features',
    description: 'Be the first to try new platform features and updates',
    icon: '🚀',
    category: 'support',
  },
  {
    id: 'dispute-priority',
    name: 'Priority Dispute Resolution',
    description: 'Fast-tracked resolution for any rental disputes or issues',
    icon: '⚖️',
    category: 'support',
  },
  {
    id: 'bulk-discounts',
    name: 'Exclusive Bulk Discounts',
    description: 'Get 20% off when renting 3+ items simultaneously',
    icon: '🎁',
    category: 'listing',
  },
];

export interface PremiumSubscription {
  userId: string;
  isPremium: boolean;
  planType: 'monthly' | 'yearly' | null;
  startDate: string;
  expiryDate: string;
  autoRenew: boolean;
  totalSaved: number; // Track savings from zero transaction fees
}

export const PREMIUM_PRICING = {
  MONTHLY: 199, // ₹199/month
  YEARLY: 1999, // ₹1999/year (save ₹400)
  MONTHLY_SAVINGS: '₹60/month on average',
  YEARLY_SAVINGS: '₹720/year on average',
};

// Get user's premium status from localStorage
export const getPremiumStatus = (): PremiumSubscription | null => {
  if (typeof window === 'undefined') return null;
  
  // Get current user ID
  const currentUserId = localStorage.getItem('currentUserId');
  if (!currentUserId) return null;
  
  // Get all premium subscriptions
  const allSubscriptions = localStorage.getItem('premiumSubscriptions');
  if (!allSubscriptions) return null;
  
  const subscriptions: Record<string, PremiumSubscription> = JSON.parse(allSubscriptions);
  const subscription = subscriptions[currentUserId];
  
  if (!subscription) return null;
  
  // Check if subscription is still valid
  const now = new Date();
  const expiry = new Date(subscription.expiryDate);
  
  if (now > expiry) {
    // Subscription expired
    subscription.isPremium = false;
    subscriptions[currentUserId] = subscription;
    localStorage.setItem('premiumSubscriptions', JSON.stringify(subscriptions));
    return subscription;
  }
  
  return subscription;
};

// Activate premium subscription
export const activatePremium = (
  userId: string,
  planType: 'monthly' | 'yearly'
): PremiumSubscription => {
  const startDate = new Date();
  const expiryDate = new Date();
  
  if (planType === 'monthly') {
    expiryDate.setMonth(expiryDate.getMonth() + 1);
  } else {
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  }
  
  const subscription: PremiumSubscription = {
    userId,
    isPremium: true,
    planType,
    startDate: startDate.toISOString(),
    expiryDate: expiryDate.toISOString(),
    autoRenew: true,
    totalSaved: 0,
  };
  
  // Get all subscriptions
  const allSubscriptions = localStorage.getItem('premiumSubscriptions');
  const subscriptions: Record<string, PremiumSubscription> = allSubscriptions 
    ? JSON.parse(allSubscriptions) 
    : {};
  
  // Store subscription for this user
  subscriptions[userId] = subscription;
  localStorage.setItem('premiumSubscriptions', JSON.stringify(subscriptions));
  
  return subscription;
};

// Check if user has access to a specific premium feature
export const hasPremiumFeature = (featureId: string): boolean => {
  const subscription = getPremiumStatus();
  return subscription?.isPremium || false;
};

// Calculate savings for premium users
export const calculatePremiumSavings = (transactionCount: number): number => {
  // Regular users pay ₹3 per transaction
  return transactionCount * 3;
};

// Update total savings
export const updatePremiumSavings = (additionalSavings: number): void => {
  const currentUserId = localStorage.getItem('currentUserId');
  if (!currentUserId) return;
  
  const subscription = getPremiumStatus();
  if (!subscription || !subscription.isPremium) return;
  
  subscription.totalSaved += additionalSavings;
  
  const allSubscriptions = localStorage.getItem('premiumSubscriptions');
  const subscriptions: Record<string, PremiumSubscription> = allSubscriptions 
    ? JSON.parse(allSubscriptions) 
    : {};
  
  subscriptions[currentUserId] = subscription;
  localStorage.setItem('premiumSubscriptions', JSON.stringify(subscriptions));
};

// Cancel premium subscription
export const cancelPremium = (): void => {
  const currentUserId = localStorage.getItem('currentUserId');
  if (!currentUserId) return;
  
  const subscription = getPremiumStatus();
  if (!subscription) return;
  
  subscription.autoRenew = false;
  
  const allSubscriptions = localStorage.getItem('premiumSubscriptions');
  const subscriptions: Record<string, PremiumSubscription> = allSubscriptions 
    ? JSON.parse(allSubscriptions) 
    : {};
  
  subscriptions[currentUserId] = subscription;
  localStorage.setItem('premiumSubscriptions', JSON.stringify(subscriptions));
};

// Get days remaining in subscription
export const getDaysRemaining = (): number => {
  const subscription = getPremiumStatus();
  if (!subscription || !subscription.isPremium) return 0;
  
  const now = new Date();
  const expiry = new Date(subscription.expiryDate);
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
};
