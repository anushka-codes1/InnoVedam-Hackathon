// Admin API Functions
export const adminAPI = {
  // Get all users
  getAllUsers: async () => {
    // Simulated API call - replace with actual backend endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = [
          { id: '1', name: 'Rahul Sharma', email: 'rahul.sharma@university.org.in', role: 'user', status: 'active', joined: '2024-01-15', listings: 12 },
          { id: '2', name: 'Priya Patel', email: 'priya.patel@university.org.in', role: 'user', status: 'active', joined: '2024-02-20', listings: 8 },
          { id: '3', name: 'Arjun Singh', email: 'arjun.singh@university.org.in', role: 'admin', status: 'active', joined: '2023-12-01', listings: 0 },
          { id: '4', name: 'Sneha Gupta', email: 'sneha.gupta@university.org.in', role: 'user', status: 'inactive', joined: '2024-03-10', listings: 5 },
        ];
        resolve({ success: true, data: users });
      }, 500);
    });
  },

  // Delete user
  deleteUser: async (userId: string) => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `User ${userId} deleted successfully` });
      }, 500);
    });
  },

  // Get admin stats
  getStats: async () => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats = {
          totalUsers: 2847,
          activeListings: 1234,
          totalRevenue: 45678,
          transactions: 892,
          usersChange: '+12.5%',
          listingsChange: '+8.2%',
          revenueChange: '+23.1%',
          transactionsChange: '-3.2%'
        };
        resolve({ success: true, data: stats });
      }, 500);
    });
  },

  // Get all items
  getAllItems: async () => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const items = [
          { id: '1', name: 'MacBook Pro 14"', category: 'Electronics', price: 500, lender: 'Rahul S.', status: 'active', views: 234 },
          { id: '2', name: 'Physics Textbook', category: 'Books', price: 50, lender: 'Priya P.', status: 'active', views: 156 },
          { id: '3', name: 'Gaming Headset', category: 'Electronics', price: 90, lender: 'Arjun S.', status: 'rented', views: 189 },
        ];
        resolve({ success: true, data: items });
      }, 500);
    });
  },

  // Update user role
  updateUserRole: async (userId: string, newRole: 'user' | 'admin') => {
    // Simulated API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: `User role updated to ${newRole}` });
      }, 500);
    });
  }
};
