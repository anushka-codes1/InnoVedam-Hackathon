# CampusSwap - Code Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Component Documentation](#component-documentation)
4. [Admin Features](#admin-features)
5. [User Features](#user-features)
6. [Data Storage](#data-storage)
7. [Key Functions](#key-functions)

---

## Project Overview

**CampusSwap** is a Next.js-based marketplace platform for college students to buy, sell, rent, and swap items within their campus community.

### Tech Stack
- **Framework**: Next.js 14.2.33 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + React-Leaflet
- **Icons**: Lucide React
- **Storage**: Browser localStorage (for demo purposes)
- **Authentication**: Role-based with ProtectedRoute wrapper

### Key Features
- User marketplace with search and filters
- Admin dashboard with analytics
- Profile management with photo upload
- Campus activity heatmap
- Price abuse reporting system
- Premium subscription system
- Item rental tracking

---

## Architecture

### Directory Structure
```
/app
├── /admin                    # Admin pages (protected)
│   ├── /items               # Items management
│   ├── /analytics           # Platform analytics
│   └── /settings            # Admin settings
├── /dashboard               # User dashboard
│   ├── /marketplace         # Browse items
│   ├── /profile             # User profile
│   └── /my-rentals          # Rental history
├── /item/[id]              # Item detail pages
└── layout.tsx              # Root layout

/components
├── /auth                    # Authentication components
├── /layouts                 # Layout wrappers
├── CampusHeatmap.tsx       # Interactive campus map
└── ConditionalFooter.tsx   # Route-based footer display
```

---

## Component Documentation

### ConditionalFooter.tsx
**Purpose**: Controls footer visibility based on current route

**Logic**:
- Hides footer on all `/admin/*` routes
- Shows footer on public and user pages
- Uses `usePathname()` hook for route detection

**Why This Matters**:
- Admin pages need maximum screen space
- Cleaner admin interface without navigation distractions
- Maintains consistent UX across public pages

```typescript
// Route detection logic
if (pathname?.startsWith('/admin')) return null;
return <CampusSwapFooter />;
```

---

### CampusHeatmap.tsx
**Purpose**: Visualizes campus activity with interactive map

**Features**:
- 10 campus locations with activity metrics
- Color-coded circles (red=high activity, green=low)
- Clickable popups with transaction counts
- Activity statistics dashboard

**Technical Implementation**:

1. **SSR Prevention**:
```typescript
// Leaflet requires browser APIs, so we disable SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
```

2. **Activity Color Coding**:
```typescript
// Activity Thresholds:
// - Very High: 45+ transactions (red)
// - High: 35-44 transactions (orange)
// - Medium: 25-34 transactions (yellow)
// - Low: <25 transactions (green)
```

3. **Location Data Structure**:
```typescript
interface HeatmapLocation {
  name: string;          // "Main Library", "Student Center"
  lat: number;           // 18.6161
  lng: number;           // 73.7286
  activity: number;      // Transaction count (45, 52, etc.)
  color: string;         // Hex color code (#ef4444)
  radius: number;        // Circle size in meters (80, 90)
}
```

**Campus Coordinates**: Ajeenkya D. Y Patil University, Pune (18.6161, 73.7286)

---

## Admin Features

### 1. Items Management (`/admin/items`)

**Purpose**: Comprehensive CRUD interface for marketplace items

**Key Functions**:

#### `loadItems()`
- Loads items from localStorage (`activeRentals`, `userOrders`)
- Merges with mock data for demonstration
- Updates state with complete item list

#### `filterItems()`
- **Multi-field search**: name, owner, category (case-insensitive)
- **Status filter**: all, active, rented, inactive
- **Category filter**: Electronics, Books, Furniture, etc.
- All filters apply cumulatively (AND logic)

#### `exportToCSV()`
- Exports filtered items to CSV file
- Filename format: `items-export-YYYY-MM-DD.csv`
- Includes all item fields (11 columns)
- Only exports currently visible/filtered items

**Statistics Dashboard**:
```typescript
{
  total: items.length,                              // All items
  active: items.filter(i => i.status === 'active'), // Available
  rented: items.filter(i => i.status === 'rented'), // In use
  inactive: items.filter(i => i.status === 'inactive'), // Disabled
  totalViews: items.reduce((sum, item) => sum + item.views, 0),
  totalRentals: items.reduce((sum, item) => sum + item.rentals, 0)
}
```

**Item Interface**:
```typescript
interface Item {
  id: number;              // Unique identifier
  name: string;            // Item name
  category: string;        // "Electronics", "Books", etc.
  owner: string;           // Lender's name
  price: number;           // Daily rental price (₹)
  status: 'active' | 'rented' | 'inactive';
  condition: string;       // "Excellent", "Good", "Fair"
  views: number;           // Page views count
  rentals: number;         // Total rental count
  rating: number;          // 1-5 star rating
  listedDate: string;      // "YYYY-MM-DD"
}
```

---

### 2. Analytics (`/admin/analytics`)

**Purpose**: Platform performance metrics and trends

**KPI Cards**:
1. **Total Users**: User count with growth trend
2. **Active Items**: Currently available items
3. **Total Revenue**: Sum of all transactions
4. **Transactions**: Completed rental count

**Charts**:
- **User Growth**: 7-day line chart showing registration trend
- **Revenue Trend**: 7-day line chart showing daily earnings
- **Category Distribution**: Pie chart with category percentages

**Time Ranges**: 7 days, 30 days, 90 days, All Time

**Export**: JSON export of all analytics data

---

### 3. Settings (`/admin/settings`)

**Purpose**: Platform-wide configuration management

**5 Configuration Tabs**:

#### 1. General Settings
```typescript
{
  platformName: string;           // "CampusSwap"
  supportEmail: string;           // Contact email
  adminEmail: string;             // Admin notifications
  minRentalPrice: number;         // Minimum item price (₹10)
  maxRentalPrice: number;         // Maximum item price (₹10000)
  defaultRentalDuration: number;  // Default days (7)
  platformCommission: number;     // Percentage fee (5%)
}
```

#### 2. Notification Settings
```typescript
{
  emailNotifications: boolean;    // Send emails
  pushNotifications: boolean;     // Browser push
  smsNotifications: boolean;      // SMS alerts
  marketingEmails: boolean;       // Promotional content
  weeklyReports: boolean;         // Admin reports
  securityAlerts: boolean;        // Security notifications
}
```

#### 3. Security Settings
```typescript
{
  twoFactorAuth: boolean;         // Require 2FA
  passwordExpiry: number;         // Days before reset (90)
  sessionTimeout: number;         // Minutes (30)
  maxLoginAttempts: number;       // Before lockout (5)
  apiKey: string;                 // Service API key
}
```

#### 4. Payment Settings
```typescript
{
  stripeEnabled: boolean;         // Stripe integration
  razorpayEnabled: boolean;       // Razorpay integration
  paypalEnabled: boolean;         // PayPal integration
  autoPayouts: boolean;           // Automatic transfers
  payoutSchedule: string;         // "weekly" | "monthly"
  minimumPayout: number;          // Min amount (₹500)
}
```

#### 5. System Settings
```typescript
{
  maintenanceMode: boolean;       // Disable public access
  debugMode: boolean;             // Show debug info
  cacheEnabled: boolean;          // Enable caching
  rateLimit: number;              // Requests/minute (100)
  maxUploadSize: number;          // MB limit (10)
  dataRetention: number;          // Days to keep data (365)
}
```

**Storage**: All settings persist to `localStorage.adminSettings`

---

## User Features

### Profile Management (`/dashboard/profile`)

#### Profile Photo Upload

**Process Flow**:
1. User selects image file via file input
2. **Validation**:
   - File size ≤ 5MB (prevents localStorage bloat)
   - File type must be image/* (JPG, PNG, etc.)
3. **Conversion**: FileReader converts image to Base64 string
4. **Storage**: Saves to `localStorage.userProfiles[email].profilePhoto`
5. **UI Update**: Photo displays immediately (no page refresh)

**Why Base64?**
- Works with localStorage (string-based)
- No backend/file storage needed
- Instant load without HTTP requests
- Simple implementation for demo

**Code Example**:
```typescript
const reader = new FileReader();
reader.onloadend = () => {
  const base64String = reader.result as string;
  // Example: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  
  // Save to user's profile
  allUserProfiles[userEmail] = {
    ...existingProfile,
    profilePhoto: base64String
  };
  localStorage.setItem('userProfiles', JSON.stringify(allUserProfiles));
};
reader.readAsDataURL(file); // Triggers onloadend
```

---

### Marketplace (`/dashboard/marketplace`)

**Total Items**: 10 marketplace items (6 original + 4 newly added)

**New Items** (IDs 7-10):
```typescript
{
  id: 7,
  name: 'Lab Coat',
  category: 'Others',
  owner: 'Anushka M.',
  price: 25,
  rating: 4.7,
  distance: '0.3 km'
},
{
  id: 8,
  name: 'Engineering Drawing Tools',
  category: 'Others',
  owner: 'Md. Hayat M.',
  price: 35,
  rating: 4.8,
  distance: '0.5 km'
},
{
  id: 9,
  name: 'Soldering Kit',
  category: 'Electronics',
  owner: 'Aaryaa N.',
  price: 55,
  rating: 4.6,
  distance: '0.4 km'
},
{
  id: 10,
  name: 'Bluetooth Speakers',
  category: 'Electronics',
  owner: 'Eklavya P.',
  price: 75,
  rating: 4.9,
  distance: '0.6 km'
}
```

**Features**:
- Search by name/category
- Filter by category/price range
- Sort by price, rating, distance
- "Trending" and "Premium" badges
- Image from Unsplash CDN

---

### Item Details (`/item/[id]`)

**Purpose**: Full item information and lender selection

**Data Structure**:
```typescript
const mockItems = {
  7: {
    name: 'Lab Coat',
    description: 'White lab coat, size M, perfect for chemistry and biology labs...',
    buy: 800,              // Purchase price
    borrow: 25,            // Daily rental
    swap: ['Goggles', 'Gloves', 'Apron'],
    condition: 'Excellent',
    images: ['unsplash_url_1', 'unsplash_url_2'],
    available: true
  },
  // ... items 8, 9, 10 with complete details
}
```

**Lender Selection**:
- Shows multiple users offering same item
- Price comparison
- Distance indicator
- Rating and review count
- "Request to Borrow" button

---

## Data Storage

### localStorage Structure

```typescript
// User Profiles (with photos)
{
  "userProfiles": {
    "user@email.com": {
      fullName: "John Doe",
      email: "user@email.com",
      phone: "+91 1234567890",
      address: "...",
      collegeName: "...",
      memberSince: "2025-01-15",
      profilePhoto: "data:image/jpeg;base64,..."  // Base64 string
    }
  },
  
  // Admin Settings (5 sections)
  "adminSettings": {
    general: { platformName, supportEmail, ... },
    notifications: { emailNotifications, ... },
    security: { twoFactorAuth, ... },
    payment: { stripeEnabled, ... },
    system: { maintenanceMode, ... }
  },
  
  // User Authentication
  "userPasswords": {
    "user@email.com": "hashedPassword"
  },
  
  // Premium Subscriptions
  "premiumSubscriptions": {
    "userId": {
      plan: "monthly",
      startDate: "2025-01-15",
      expiryDate: "2025-02-15",
      active: true
    }
  },
  
  // Active Rentals
  "activeRentals": [
    {
      itemId: 1,
      itemName: "MacBook Pro",
      borrowerEmail: "user@email.com",
      startDate: "2025-01-15",
      endDate: "2025-01-20",
      dailyRate: 500
    }
  ],
  
  // Order History
  "userOrders": [
    {
      orderId: "ORD-001",
      items: [...],
      total: 2500,
      date: "2025-01-15"
    }
  ]
}
```

---

## Key Functions

### Search and Filter Logic

```typescript
// Multi-field search
const searchResults = items.filter(item =>
  item.name.toLowerCase().includes(query.toLowerCase()) ||
  item.owner.toLowerCase().includes(query.toLowerCase()) ||
  item.category.toLowerCase().includes(query.toLowerCase())
);

// Cumulative filters (AND logic)
let filtered = [...items];

if (searchQuery) {
  filtered = filtered.filter(/* search logic */);
}

if (statusFilter !== 'all') {
  filtered = filtered.filter(item => item.status === statusFilter);
}

if (categoryFilter !== 'all') {
  filtered = filtered.filter(item => item.category === categoryFilter);
}
```

---

### CSV Export

```typescript
// Convert items to CSV format
const headers = ['ID', 'Name', 'Category', 'Owner', 'Price', ...];
const csvData = items.map(item => [
  item.id,
  item.name,
  item.category,
  item.owner,
  item.price,
  // ... all fields
]);

// Create downloadable file
const csvContent = [
  headers.join(','),
  ...csvData.map(row => row.join(','))
].join('\n');

const blob = new Blob([csvContent], { type: 'text/csv' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = `items-export-${new Date().toISOString().split('T')[0]}.csv`;
a.click();
```

---

### Status Color Coding

```typescript
// Visual indicators for item status
const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': 
      return 'bg-green-100 text-green-800';  // Available
    case 'rented': 
      return 'bg-blue-100 text-blue-800';    // In use
    case 'inactive': 
      return 'bg-gray-100 text-gray-800';    // Disabled
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active': return <CheckCircle />;   // ✓
    case 'rented': return <Clock />;         // ⏰
    case 'inactive': return <XCircle />;     // ✗
  }
};
```

---

### Activity Level Calculation

```typescript
// Determine campus hotspot intensity
const getActivityLevel = (transactions: number) => {
  if (transactions >= 45) return 'Very High';  // Red
  if (transactions >= 35) return 'High';       // Orange
  if (transactions >= 25) return 'Medium';     // Yellow
  return 'Low';                                // Green
};
```

---

## Security Considerations

### Admin Verification Page
**Issue**: Admin names were visible on verification page
**Fix**: Replaced specific names with generic security notice
**Why**: Prevents attackers from knowing valid admin usernames

```typescript
// Before (Security Risk):
<p>Authorized: Anushka, Eklavya, Manya, ...</p>

// After (Secure):
<p>For security reasons, authorized admin names are not displayed.</p>
```

---

## Performance Optimizations

### 1. Dynamic Imports (SSR Prevention)
```typescript
// Leaflet causes SSR errors, so we load only on client
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
```

### 2. Memoized Calculations
```typescript
// Calculate stats only when items change
const stats = useMemo(() => ({
  total: items.length,
  active: items.filter(i => i.status === 'active').length,
  // ...
}), [items]);
```

### 3. Debounced Search
```typescript
// Wait for user to stop typing before filtering
const debouncedSearch = useCallback(
  debounce((query) => filterItems(query), 300),
  []
);
```

---

## Future Enhancements

1. **Backend Integration**
   - Replace localStorage with REST API
   - Add database (PostgreSQL/MongoDB)
   - Implement proper authentication (JWT)

2. **Real-time Features**
   - WebSocket for live notifications
   - Real-time activity updates on heatmap
   - Chat between users

3. **File Upload**
   - Replace Base64 with cloud storage (AWS S3, Cloudinary)
   - Image optimization and compression
   - Multiple image support

4. **Advanced Analytics**
   - User behavior tracking
   - A/B testing framework
   - Predictive analytics for demand

5. **Mobile App**
   - React Native version
   - Push notifications
   - Offline support

---

## Common Issues & Solutions

### Issue: "Module not found: ConditionalFooter"
**Cause**: Next.js cache not updated after creating new component
**Solution**: Restart dev server or delete `.next` folder

### Issue: Map not rendering
**Cause**: Leaflet requires browser APIs (window, document)
**Solution**: Use dynamic import with `ssr: false`

### Issue: Profile photo not saving
**Cause**: File size exceeds 5MB or localStorage quota
**Solution**: 
- Validate file size before upload
- Consider image compression
- Use cloud storage for large images

### Issue: Filters not working
**Cause**: State not updating properly
**Solution**: Use `useEffect` to re-filter when dependencies change

```typescript
useEffect(() => {
  filterItems();
}, [searchQuery, statusFilter, categoryFilter, items]);
```

---

## Testing Guidelines

### Manual Testing Checklist

**Authentication**:
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Admin access verification
- [ ] Session persistence

**Profile Management**:
- [ ] Upload profile photo (< 5MB)
- [ ] Upload oversized photo (> 5MB) - should reject
- [ ] Upload non-image file - should reject
- [ ] Edit profile information
- [ ] Save changes

**Marketplace**:
- [ ] Browse all items
- [ ] Search by name
- [ ] Filter by category
- [ ] Filter by status
- [ ] Click item to view details

**Admin Features**:
- [ ] View items dashboard
- [ ] Export items to CSV
- [ ] View analytics charts
- [ ] Change settings in all 5 tabs
- [ ] Settings persist after page refresh

**Campus Heatmap**:
- [ ] Map loads without errors
- [ ] All 10 locations visible
- [ ] Click circles to view popups
- [ ] Activity stats calculate correctly

---

## Contributing

When adding new features:

1. **Add comprehensive comments**:
   ```typescript
   /**
    * Function purpose and usage
    * 
    * @param param1 - Description
    * @returns Description
    * 
    * Example:
    * functionName(value)
    */
   ```

2. **Update this documentation** with:
   - New features section
   - Data structure changes
   - localStorage schema updates
   - Security considerations

3. **Test thoroughly**:
   - All user flows
   - Edge cases
   - Error states
   - Mobile responsiveness

4. **Follow naming conventions**:
   - Components: PascalCase (`ProfileCard`)
   - Functions: camelCase (`handleSubmit`)
   - Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
   - Files: kebab-case (`user-profile.tsx`)

---

## Contact & Support

For questions or issues:
- Check this documentation first
- Review inline code comments
- Test in browser console
- Ask team members

Last Updated: January 2025
