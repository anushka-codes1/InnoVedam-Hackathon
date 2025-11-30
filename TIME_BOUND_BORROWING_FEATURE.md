# ⏰ Time-Bound Borrowing & Auto-Reminders Feature

## 🎯 Overview
A comprehensive rental management system that enables time-bound borrowing with automatic reminders, overdue tracking, and penalty calculations.

## ✨ Key Features

### 1. **Time-Bound Rental System**
- **Rental Duration Selector**: Users can specify the exact number of days they need to borrow an item
- **Start & End Dates**: Automatic calculation of rental period (starts from next day)
- **Dynamic Pricing**: Total cost calculated based on duration: `(Daily Rate × Number of Days) + Fees`
- **Late Fee Warning**: Users see potential late charges upfront

### 2. **Automatic Reminders**
- **Toggle Option**: Users can enable/disable auto-reminders during checkout
- **Reminder Schedule**:
  - 📅 **2 days before** return date
  - 📅 **1 day before** return date
  - 📅 **On return date** (morning notification)
  - ⚠️ **Overdue alerts** if item not returned

### 3. **Dashboard Integration**
- **Urgent Reminders Widget**: Shows high-priority notifications for overdue/due-soon items
- **Active Rentals Overview**: Visual cards showing all borrowed items with:
  - Days remaining countdown
  - Color-coded status (blue = safe, yellow = due soon, red = overdue)
  - Lender information
  - Return dates
- **Notification Badge**: Bell icon shows count of pending reminders

### 4. **Notifications Page**
- **Dedicated notifications center** (`/dashboard/notifications`)
- **Three filter tabs**:
  - All Notifications
  - Unread Only
  - Reminders Only
- **Smart Prioritization**: Overdue items appear first
- **Mark as Read/Delete**: Manage notifications easily
- **Real-time Updates**: Automatically generated from active rentals

### 5. **Overdue Tracking**
- **Automatic Status Updates**: System calculates days overdue
- **Visual Alerts**: Red badges and warning messages
- **Penalty Information**: Shows accumulated late fees
- **Contact Lender**: Quick action button to reach out

## 📱 User Flow

### Borrowing Process
1. User selects "Borrow" option on item page
2. Clicks on preferred lender
3. **NEW**: Rental Duration selector appears
   - Adjust days with +/- buttons
   - See start and end dates
   - View total cost calculation
4. **NEW**: Enable/disable auto-reminders toggle
5. Select payment method
6. Complete payment
7. Rental is tracked in localStorage

### Reminder Experience
1. Active rentals stored in `localStorage` with key `activeRentals`
2. Dashboard automatically loads and processes rentals on visit
3. System calculates days remaining for each item
4. Generates reminders based on schedule
5. Notifications appear in:
   - Dashboard urgent reminders section
   - Dashboard active rentals cards
   - Notifications page
   - Bell icon badge

## 💾 Data Structure

### Active Rental Object
```javascript
{
  id: timestamp,
  itemName: "Chemistry Textbook",
  lenderName: "Eklavya Panwar",
  startDate: "2025-11-30",
  endDate: "2025-12-05",
  daysRemaining: 6,
  remindersEnabled: true,
  status: "active", // "active" | "completed" | "overdue"
  isOverdue: false,
  isDueSoon: false
}
```

### Notification Object
```javascript
{
  id: number,
  type: "reminder" | "overdue" | "returned" | "borrowed",
  title: "📅 Due Tomorrow",
  message: "Chemistry Textbook is due tomorrow...",
  timestamp: "2025-11-29T10:00:00Z",
  read: false,
  itemName: "Chemistry Textbook",
  priority: "high" | "medium" | "low"
}
```

## 🎨 UI Elements

### Payment Modal Enhancements
- **Purple-pink gradient** rental duration card
- **Large number display** for days selected
- **Date grid** showing start and return dates
- **Toggle switch** with gradient for reminders
- **Info box** explaining reminder schedule
- **Late fee warning** in pricing breakdown

### Dashboard Widgets
- **Urgent Reminders**: Orange-red gradient alert box with pulse animation
- **Active Rentals**: Grid of color-coded cards
- **Status Badges**: "OVERDUE" (red), "DUE SOON" (yellow)
- **Countdown Display**: Shows days remaining with icons

### Notifications Page
- **Filter tabs** with gradient active state
- **Priority sorting**: Overdue → Due Soon → General
- **Color coding**: Red (overdue), Yellow (reminder), Purple (general)
- **Icon system**: Different icons for each notification type

## 🔄 Automatic Calculations

### Days Remaining
```javascript
const daysRemaining = Math.ceil(
  (returnDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
);
```

### Status Determination
- `isOverdue`: daysRemaining < 0
- `isDueSoon`: daysRemaining >= 0 && daysRemaining <= 2

### Late Fee Calculation
```javascript
lateFeePerDay = rentalPrice * 1.5;
```

## �� File Changes

### Modified Files
1. **`app/item/[id]/page.tsx`**
   - Added rental duration state
   - Added date calculation logic
   - Added reminder toggle
   - Updated payment modal UI
   - Updated price calculations

2. **`app/dashboard/page.tsx`**
   - Added reminders state management
   - Added active rentals loading
   - Added urgent reminders widget
   - Added active rentals overview
   - Updated bell icon with badge

3. **`app/dashboard/notifications/page.tsx`** (NEW)
   - Complete notifications center
   - Filter functionality
   - Mark as read/delete actions
   - Priority sorting

## 🚀 Benefits

1. **For Borrowers**:
   - Never miss a return date
   - Avoid late fees
   - Plan rentals better
   - Clear visibility of all borrowed items

2. **For Lenders**:
   - Increased trust in timely returns
   - Reduced disputes
   - Better item availability management

3. **For Platform**:
   - Higher user engagement
   - Reduced customer support queries
   - Better user satisfaction
   - Professional rental experience

## 🔮 Future Enhancements

- Push notifications (browser/mobile)
- SMS/Email reminders
- Calendar integration
- Rental extension requests
- Return confirmation flow
- Rating system post-return
- Automated penalty collection

## 📊 Metrics to Track

- Reminder opt-in rate
- On-time return rate
- Overdue frequency
- Late fee collection
- User satisfaction scores
