# Setup Guide - Campus Borrowing Platform

## Quick Start (5 minutes)

### 1. Prerequisites
- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- Git installed

### 2. Clone & Install
```bash
git clone https://github.com/anushka-codes1/InnoVedam-Hackathon.git
cd InnoVedam-Hackathon
pnpm install
```

### 3. Set Up Supabase

#### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in details:
   - Project name: campus-borrowing
   - Database password: (save this!)
   - Region: Choose closest to you

#### Run Database Schema
1. Wait for project to finish setting up (2-3 mins)
2. Go to SQL Editor in Supabase dashboard
3. Copy entire contents of `db/seeds.sql`
4. Paste and click "Run"
5. Verify tables created in Table Editor

#### Get API Keys
1. Go to Project Settings → API
2. Copy `Project URL` and `anon public` key
3. Save for next step

### 4. Set Up Stripe

#### Create Account
1. Go to [stripe.com](https://stripe.com)
2. Create account (or login)
3. Activate account (may need to verify email)

#### Get API Keys
1. Go to Developers → API keys
2. Copy `Publishable key` and `Secret key`
3. **Important**: Use TEST mode keys for development

#### Enable Payment Methods
1. Go to Settings → Payment methods
2. Enable: Cards, UPI (for India)

#### Optional: Set Up Connect (for lender payouts)
1. Go to Connect → Get started
2. Follow setup wizard
3. This enables direct payouts to lenders

### 5. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in:

```env
# Supabase (from step 3)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Stripe (from step 4)
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 🎉

---

## Detailed Configuration

### Supabase Configuration

#### Enable Email Auth
1. Go to Authentication → Providers
2. Enable "Email"
3. Disable "Confirm email" for testing (enable in production!)

#### Configure Email Templates
1. Go to Authentication → Email Templates
2. Customize "Confirm signup" template:
   ```html
   <h2>Verify your college email</h2>
   <p>Click the link below to verify your email:</p>
   <p><a href="{{ .ConfirmationURL }}">Verify Email</a></p>
   ```

#### Set Up Storage (for item images)
1. Go to Storage
2. Create new bucket: `item-images`
3. Make it public:
   ```sql
   CREATE POLICY "Public Access" ON storage.objects
   FOR SELECT USING (bucket_id = 'item-images');
   
   CREATE POLICY "Authenticated Upload" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'item-images' AND auth.role() = 'authenticated');
   ```

#### Configure RLS Policies
Add these policies in SQL Editor:

```sql
-- Users can read their own data
CREATE POLICY "Users can read own data" ON users
FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
FOR UPDATE USING (auth.uid() = id);

-- Anyone can read available items
CREATE POLICY "Anyone can read available items" ON items
FOR SELECT USING (is_available = true);

-- Users can create items
CREATE POLICY "Users can create items" ON items
FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Users can update their own items
CREATE POLICY "Users can update own items" ON items
FOR UPDATE USING (auth.uid() = owner_id);
```

### Stripe Configuration

#### Set Up Webhooks (for production)
1. Go to Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy webhook signing secret to `.env`

#### Test Webhook Locally
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

#### Test Cards
Use these in development:
- Success: `4242 4242 4242 4242`
- Declined: `4000 0000 0000 0002`
- 3D Secure: `4000 0025 0000 3155`

(Any future expiry, any CVC, any postal code)

### Optional Services

#### Twilio (SMS Notifications)
1. Sign up at [twilio.com](https://twilio.com)
2. Get phone number
3. Add to `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

#### SendGrid (Email Notifications)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create API key
3. Add to `.env`:
   ```env
   SENDGRID_API_KEY=your_api_key
   ```

---

## Testing the Platform

### 1. Create Test Users

Register two users:
- User A (Lender): `alice@university.edu`
- User B (Borrower): `bob@university.edu`

### 2. Create Item Listing (as Alice)
1. Login as Alice
2. Go to "Create Listing"
3. Fill in:
   - Title: "MacBook Pro 2021"
   - Category: laptop
   - Condition: excellent
   - Duration: 24 hours
   - Price: Let system suggest (should be ~₹100)
4. Submit

### 3. Borrow Item (as Bob)
1. Login as Bob
2. Browse items
3. Select Alice's MacBook
4. Choose delivery method: Self-Delivery
5. Confirm booking
6. Complete payment (use test card: 4242...)

### 4. Test QR Codes
1. Both users meet at meeting point
2. Alice scans "Handoff QR Code"
3. Bob receives item
4. After use, meet again
5. Alice scans "Return QR Code"
6. Transaction completes!

### 5. Verify Everything
- Check transaction in dashboard
- Verify payment in Stripe dashboard
- Check trust scores updated
- Confirm notifications sent

---

## Troubleshooting

### Database Connection Issues
```bash
# Check Supabase connection
curl https://your-project.supabase.co/rest/v1/

# Should return API info
```

### Stripe Payment Fails
1. Verify API keys in `.env`
2. Check Stripe dashboard for errors
3. Ensure using TEST mode keys
4. Verify webhook signature (if using webhooks)

### QR Codes Not Working
1. Check browser camera permissions
2. Ensure HTTPS in production (required for camera)
3. Verify QR data format in console

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules .next
pnpm install
pnpm build
```

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Add environment variables from `.env`
5. Deploy!

### Configure Production
1. Update `NEXT_PUBLIC_APP_URL` to production domain
2. Enable email confirmation in Supabase
3. Switch to Stripe LIVE mode keys
4. Set up webhook endpoints
5. Configure custom domain (optional)

### Post-Deployment Checklist
- [ ] Test registration flow
- [ ] Test item creation
- [ ] Test transactions
- [ ] Test QR scanning (HTTPS required!)
- [ ] Verify payments working
- [ ] Check email delivery
- [ ] Monitor error logs

---

## Production Best Practices

### Security
1. Enable Row Level Security on all tables
2. Use environment variables for all secrets
3. Enable CSRF protection
4. Implement rate limiting
5. Use HTTPS everywhere

### Performance
1. Enable caching for static assets
2. Optimize images (next/image)
3. Implement lazy loading
4. Use CDN for assets
5. Monitor with Vercel Analytics

### Monitoring
1. Set up Sentry for error tracking
2. Monitor Stripe webhooks
3. Track user analytics
4. Set up uptime monitoring
5. Review database performance

---

## Need Help?

- 📧 Email: team@example.com
- 💬 Discord: [Join our server](https://discord.gg/example)
- 📚 Documentation: [Full docs](https://docs.example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/anushka-codes1/InnoVedam-Hackathon/issues)

---

**Happy Coding! 🚀**
