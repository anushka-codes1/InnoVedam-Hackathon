# Campus Borrowing Platform 🎓

**Team ErRor_404** - InnoVedam Hackathon Project

A revolutionary peer-to-peer item borrowing platform designed specifically for campus communities, solving trust, pricing, and delivery challenges with innovative features.

## 🌟 Core Features

### 1. Trust Building System
- ✅ **Time-Bound Borrowing with Auto-Reminders**
  - Smart scheduling with automated return reminders
  - Risk-based reminder frequency
  
- ✅ **QR-Based Hand-Off & Return Verification**
  - Super easy demo feature
  - Scan to confirm item exchange
  - Timestamped verification
  
- ✅ **Collateral Mode for High-Value Items**
  - Automatic collateral calculation (20-50% of item value)
  - Pre-authorized payments with Stripe
  - Instant collateral return on on-time return
  
- ✅ **Smart Return Risk Score** ⭐ *Unique Twist!*
  - 0-100 risk assessment
  - Considers trust score, history, item value, duration
  - Personalized recommendations

### 2. Price Exploitation Prevention
- ✅ **Campus Fair Price Model**
  - Minimum and maximum price bounds per category
  - Prevents overcharging
  
- ✅ **Auto-Suggest Price** 
  - Frictionless UX
  - Based on category, duration, condition, and demand
  - Transparent breakdown
  
- ✅ **Peer-Reported Price Abuse Flag**
  - Community-driven fairness
  - Admin review system

### 3. Smart Delivery Options
- ⭐ **Self-Delivery with Meeting-Point Automation**
  - Popular campus locations pre-configured
  - Distance and walk-time calculation
  - Smart suggestion based on both users' locations
  
- ⭐ **Campus Buddy Couriers** *Novel Feature!*
  - Verified student couriers
  - Earn while delivering
  - Rating system
  
- ⭐ **Priority Delivery**
  - Borrower picks up directly from lender
  - Extra ₹15 fee
  - ₹5 goes to lender for convenience

### 4. Revenue Model

| Activity | Users/Month | Revenue |
|----------|-------------|---------|
| Normal transactions (₹3 fee) | 5,000 | ₹15,000 |
| Priority boosts (₹15) | 600 | ₹9,000 |
| Convenience pickup (₹20 share) | 200 | ₹4,000 |
| College store subscriptions | - | ₹2,500 |
| **Total** | | **₹30,500/month** |

### 5. Security & Verification
- **College Email Verification**
  - Primary authentication method
  - .edu or .ac.in domains required
  - OTP verification
  
- **Pre-Authorized Payments with Stripe**
  - Funds held but not captured until return
  - Automatic collateral handling
  - Late penalty support

## 🏗️ Project Structure

```
/app                    # Application routes
  /(auth)              # Authentication pages
  /dashboard           # User dashboard
  /create-listing      # Create item listing
  /matches             # Browse items
/lib                   # Core libraries
  supabase.ts         # Supabase client & database functions
  stripe.ts           # Stripe payment integration
/utils                 # Utility functions
  qr.ts               # QR code generation & verification
  meetingPoint.ts     # Smart meeting point automation
  riskScore.ts        # Risk assessment algorithm
  pricing.ts          # Fair pricing system
  delivery.ts         # Delivery options logic
/server/routes         # API routes
  auth.ts             # Authentication endpoints
  items.ts            # Item CRUD operations
  transactions.ts     # Transaction management
/db
  seeds.sql           # Database schema
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account
- Stripe account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/anushka-codes1/InnoVedam-Hackathon.git
cd InnoVedam-Hackathon
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. **Set up Supabase database**
- Create a new Supabase project
- Run the SQL from `db/seeds.sql` in Supabase SQL editor
- Copy your project URL and anon key to `.env`

5. **Configure Stripe**
- Create a Stripe account
- Get your API keys from dashboard
- Add keys to `.env`
- Set up Stripe Connect for lender payouts (optional)

6. **Run the development server**
```bash
pnpm dev
```

Visit `http://localhost:3000` to see the app!

## 📊 Database Schema

### Key Tables
- **users** - User profiles with trust scores
- **items** - Item listings with pricing bounds
- **transactions** - Borrowing transactions with QR codes
- **buddy_couriers** - Delivery courier profiles
- **meeting_points** - Popular campus locations
- **reminders** - Automated reminder system
- **price_reports** - Price abuse reports
- **notifications** - User notifications

See `db/seeds.sql` for complete schema.

## 💳 Payment Flow

1. **Borrower initiates transaction**
   - Selects item and duration
   - System calculates total (rental + fees + collateral)
   
2. **Pre-authorization created**
   - Stripe holds funds on borrower's card
   - Amount includes collateral for high-value items
   
3. **Item handed off**
   - Both parties scan handoff QR code
   - Transaction becomes active
   
4. **Item returned**
   - Both parties scan return QR code
   - If on-time: Charge rental only, return collateral
   - If late: Add penalty, charge total
   
5. **Payment captured**
   - Lender receives rental amount
   - Platform receives fees
   - Courier receives delivery fee (if applicable)

## 🎯 Key Algorithms

### Risk Score Calculation
```typescript
score = 50 (baseline)
- Trust score impact (40% weight)
- Return history (30% weight)
- Item value consideration (15% weight)
- Duration impact (10% weight)
- Account age & other factors (5% weight)

Result: 0-25 = Low, 25-50 = Medium, 50-75 = High, 75-100 = Very High
```

### Smart Meeting Point Selection
```typescript
For each meeting point:
  totalDistance = distance(borrower, point) + distance(lender, point)
  score = totalDistance * (is_popular ? 0.8 : 1.0)
  
Return point with lowest score
```

### Fair Price Calculation
```typescript
price = baseCost + (durationCost * conditionMultiplier * demandMultiplier)
Bounded by: categoryMinPrice ≤ price ≤ categoryMaxPrice
```

## 🔧 Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Payments**: Stripe (with pre-authorization)
- **QR Codes**: qrcode.react, react-qr-reader
- **Deployment**: Vercel (recommended)

## 📱 Features Roadmap

- [ ] Mobile app (React Native)
- [ ] Real-time chat between users
- [ ] Photo verification of item condition
- [ ] Integration with college student ID systems
- [ ] Analytics dashboard for admins
- [ ] Referral program
- [ ] Insurance options for high-value items

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines.

## 📄 License

MIT License - feel free to use this project for your campus!

## 👥 Team ErRor_404

Built with ❤️ for Vedam School of Technology's InnoVedam Hackathon

---

**Questions?** Open an issue or contact the team!

## 🎓 For College Administrators

Interested in deploying this platform for your campus? Contact us for:
- White-label solution
- Custom branding
- Integration with existing systems
- Training and support
- Store subscription packages (₹29/month)
