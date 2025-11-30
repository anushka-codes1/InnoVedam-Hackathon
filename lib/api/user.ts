// User API Functions
export const userAPI = {
  // Get user profile
  getUserProfile: async (userId: string) => {
    // Simulated API call - replace with actual backend endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        const profile = {
          id: userId,
          name: 'Rahul Sharma',
          email: 'rahul.sharma@university.org.in',
          phone: '+91 98765 43210',
          collegeName: 'Indian Institute of Technology',
          memberSince: 'January 2024',
          avatar: null,
          stats: {
            totalListings: 12,
            completedTransactions: 45,
            rating: 4.8,
            trustScore: 92
          }
        };
        resolve({ success: true, data: profile });
      }, 500);
    });
  },

  // Get user subscriptions/orders
  getUserSubscriptions: async (userId: string) => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const subscriptions = [
          {
            id: 'SUB-001',
            itemName: 'MacBook Pro 14"',
            type: 'borrow',
            startDate: '2024-01-15',
            endDate: '2024-01-20',
            amount: 2500,
            status: 'active'
          },
          {
            id: 'SUB-002',
            itemName: 'Physics Textbook',
            type: 'buy',
            purchaseDate: '2024-01-10',
            amount: 500,
            status: 'completed'
          },
        ];
        resolve({ success: true, data: subscriptions });
      }, 500);
    });
  },

  // Get user listings
  getUserListings: async (userId: string) => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const listings = [
          {
            id: '1',
            name: 'Chemistry Textbook',
            category: 'Books',
            price: 45,
            image: '📚',
            status: 'active',
            views: 156,
            interested: 8
          },
          {
            id: '2',
            name: 'Wireless Headphones',
            category: 'Electronics',
            price: 65,
            image: '🎧',
            status: 'rented',
            views: 234,
            interested: 15
          },
        ];
        resolve({ success: true, data: listings });
      }, 500);
    });
  },

  // Update user profile
  updateUserProfile: async (userId: string, profileData: any) => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'Profile updated successfully', data: profileData });
      }, 500);
    });
  },

  // Get user transactions
  getUserTransactions: async (userId: string) => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const transactions = [
          {
            id: 'TXN-001',
            type: 'borrow',
            itemName: 'MacBook Pro',
            amount: 2500,
            date: '2024-01-15',
            status: 'completed'
          },
          {
            id: 'TXN-002',
            type: 'buy',
            itemName: 'Physics Textbook',
            amount: 500,
            date: '2024-01-10',
            status: 'completed'
          },
        ];
        resolve({ success: true, data: transactions });
      }, 500);
    });
  }
};
