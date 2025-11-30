// Migration utility to move from old single-subscription to multi-user format
export const migratePremiumData = (): void => {
  if (typeof window === 'undefined') return;
  
  // Check for old format data
  const oldData = localStorage.getItem('premiumSubscription');
  if (!oldData) return;
  
  try {
    const oldSubscription = JSON.parse(oldData);
    
    // Get or create new format storage
    const newData = localStorage.getItem('premiumSubscriptions');
    const subscriptions: Record<string, any> = newData ? JSON.parse(newData) : {};
    
    // Migrate old subscription to new format using userId
    if (oldSubscription.userId) {
      subscriptions[oldSubscription.userId] = oldSubscription;
      localStorage.setItem('premiumSubscriptions', JSON.stringify(subscriptions));
    }
    
    // Remove old format
    localStorage.removeItem('premiumSubscription');
    
    console.log('Premium data migrated successfully');
  } catch (error) {
    console.error('Error migrating premium data:', error);
  }
};
