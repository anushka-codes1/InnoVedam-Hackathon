# Payment Webhook Documentation

## Overview
The payment webhook endpoint (`/api/payment-webhook`) provides secure verification and processing of payment gateway callbacks with HMAC-SHA256 signature verification.

## Endpoint Details

### URL
```
POST /api/payment-webhook
GET /api/payment-webhook (health check)
```

### Authentication
HMAC-SHA256 signature verification using shared secret key.

## Request Format

### Headers
```
Content-Type: application/json
```

### Body
```json
{
  "paymentId": "PAY_1234567890",
  "orderId": "ORD_9876543210",
  "status": "SUCCESS",
  "amount": 189.75,
  "timestamp": "2024-01-15T10:30:00Z",
  "signature": "a1b2c3d4e5f6...",
  "metadata": {
    "transactionId": "TXN_123",
    "paymentMethod": "UPI"
  }
}
```

### Required Fields
- `paymentId` (string): Unique payment identifier
- `orderId` (string): Order identifier
- `status` (string): Payment status - `SUCCESS`, `FAILED`, or `PENDING`
- `amount` (number): Transaction amount
- `timestamp` (string): ISO 8601 timestamp
- `signature` (string): HMAC-SHA256 signature

### Optional Fields
- `metadata` (object): Additional payment information

## Signature Generation

### Algorithm
HMAC-SHA256 with canonical string format

### Canonical String Format
```
paymentId|orderId|status|amount|timestamp
```

### Example (Node.js)
```javascript
const crypto = require('crypto');

const payload = {
  paymentId: 'PAY_1234567890',
  orderId: 'ORD_9876543210',
  status: 'SUCCESS',
  amount: 189.75,
  timestamp: '2024-01-15T10:30:00Z'
};

// Create canonical string
const canonicalString = [
  payload.paymentId,
  payload.orderId,
  payload.status,
  payload.amount.toString(),
  payload.timestamp
].join('|');

// Generate signature
const signature = crypto
  .createHmac('sha256', PAYMENT_GATEWAY_SECRET_KEY)
  .update(canonicalString)
  .digest('hex');
```

### Example (Python)
```python
import hmac
import hashlib

payload = {
    'paymentId': 'PAY_1234567890',
    'orderId': 'ORD_9876543210',
    'status': 'SUCCESS',
    'amount': 189.75,
    'timestamp': '2024-01-15T10:30:00Z'
}

# Create canonical string
canonical_string = f"{payload['paymentId']}|{payload['orderId']}|{payload['status']}|{payload['amount']}|{payload['timestamp']}"

# Generate signature
signature = hmac.new(
    PAYMENT_GATEWAY_SECRET_KEY.encode(),
    canonical_string.encode(),
    hashlib.sha256
).hexdigest()
```

## Response Format

### Success (200)
```json
{
  "success": true,
  "message": "Payment webhook processed successfully"
}
```

### Invalid Signature (400)
```json
{
  "error": "Invalid signature"
}
```

### Missing Fields (400)
```json
{
  "error": "Missing required field: paymentId"
}
```

### Server Error (500)
```json
{
  "error": "Internal server error processing webhook"
}
```

## Payment Status Handling

### SUCCESS
When payment is successful, the webhook:
1. ✅ Updates order status to `PAYMENT_RECEIVED`
2. 📍 Releases meet-up location to both parties
3. 🔔 Notifies seller via push notification
4. ⭐ Updates buyer trust score (+2 points)
5. 📧 Sends confirmation emails to buyer and seller
6. 🔐 Generates QR codes for item handoff verification

### FAILED
When payment fails, the webhook:
1. ❌ Updates order status to `PAYMENT_FAILED`
2. 💰 Initiates refund process
3. 🔔 Notifies buyer of payment failure
4. 📦 Releases item inventory (marks as available)

### PENDING
When payment is pending:
- Acknowledges webhook receipt
- No state changes made
- Awaits final status update

## Security Features

### 1. HMAC Signature Verification
- Uses HMAC-SHA256 cryptographic hash
- Verifies payload integrity
- Prevents tampering

### 2. Timing-Safe Comparison
```javascript
crypto.timingSafeEqual(
  Buffer.from(expectedSignature, 'hex'),
  Buffer.from(receivedSignature, 'hex')
)
```
Prevents timing attack vulnerabilities.

### 3. Request Tracking
Each request gets a unique ID for debugging:
```
[WEBHOOK a1b2c3d4] Processing webhook...
```

### 4. Security Incident Logging
Failed verification attempts are logged:
```javascript
{
  timestamp: '2024-01-15T10:30:00Z',
  reason: 'Invalid signature',
  payload: { ... },
  severity: 'HIGH'
}
```

## Environment Variables

```bash
# Required
PAYMENT_GATEWAY_SECRET_KEY=your-secret-key-here

# Optional (defaults to mock implementations)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Testing

### Method 1: Using Test Script
```bash
# Start development server
npm run dev

# In another terminal, run test script
node scripts/test-webhook.js
```

### Method 2: Using curl
```bash
# Generate signature first (see examples above)
curl -X POST http://localhost:3000/api/payment-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "paymentId": "PAY_1234567890",
    "orderId": "ORD_9876543210",
    "status": "SUCCESS",
    "amount": 189.75,
    "timestamp": "2024-01-15T10:30:00Z",
    "signature": "your-generated-signature"
  }'
```

### Method 3: Using TypeScript Utility
```typescript
import { runAllTests } from '@/utils/test-webhook';

// Run all test cases
await runAllTests();
```

## Test Cases

### ✅ Valid Successful Payment
- Status: SUCCESS
- Signature: Valid
- Expected: 200 OK, order finalized

### ❌ Valid Failed Payment
- Status: FAILED
- Signature: Valid
- Expected: 200 OK, refund initiated

### 🔒 Invalid Signature
- Signature: Invalid/Wrong
- Expected: 400 Bad Request, security incident logged

### ⚠️ Tampered Payload
- Signature: Valid but payload modified
- Expected: 400 Bad Request, verification failure

### 📋 Missing Required Fields
- Missing: paymentId/orderId/status/amount
- Expected: 400 Bad Request, error message

## Integration Guide

### 1. Configure Secret Key
Add to `.env.local`:
```bash
PAYMENT_GATEWAY_SECRET_KEY=your-actual-secret-from-payment-gateway
```

### 2. Payment Gateway Configuration
Configure webhook URL in your payment gateway dashboard:
```
https://yourdomain.com/api/payment-webhook
```

### 3. Handle Webhooks in Order Flow
The webhook automatically:
- Updates database records
- Sends notifications
- Processes refunds
- Updates trust scores

### 4. Monitor Webhook Logs
Check server logs for webhook processing:
```
[WEBHOOK a1b2c3d4] Received webhook for order: ORD_123
[WEBHOOK a1b2c3d4] Signature verified successfully
[WEBHOOK a1b2c3d4] Payment successful, finalizing order
```

## Error Handling

### Webhook Retry Logic
Most payment gateways retry failed webhooks:
- Initial attempt: Immediate
- Retry 1: After 5 minutes
- Retry 2: After 15 minutes
- Retry 3: After 1 hour
- Retry 4: After 6 hours

Your endpoint returns 200 to acknowledge receipt and prevent retries.

### Failed Webhook Handling
If webhook processing fails:
1. Return 500 error
2. Payment gateway will retry
3. Check server logs for error details
4. Fix issue and wait for retry

## Production Checklist

- [ ] Set real `PAYMENT_GATEWAY_SECRET_KEY` environment variable
- [ ] Configure webhook URL in payment gateway dashboard
- [ ] Test with payment gateway's test mode
- [ ] Set up webhook monitoring/alerting
- [ ] Configure Supabase environment variables
- [ ] Replace mock functions with real implementations
- [ ] Set up email service (SendGrid/SES)
- [ ] Set up push notification service (FCM/APNS)
- [ ] Implement QR code generation library
- [ ] Configure security incident monitoring
- [ ] Set up webhook retry handling
- [ ] Add webhook request logging
- [ ] Test refund flow end-to-end

## Troubleshooting

### Signature Verification Fails
1. Check secret key matches payment gateway
2. Verify canonical string format
3. Check timestamp is ISO 8601 format
4. Ensure amount is number, not string

### Webhook Not Received
1. Check webhook URL is publicly accessible
2. Verify HTTPS is enabled (required in production)
3. Check firewall/security group rules
4. Test with payment gateway's webhook testing tool

### Database Updates Fail
1. Check Supabase environment variables
2. Verify service role key has proper permissions
3. Check database schema matches expectations
4. Review server logs for error details

## Support

For webhook integration issues:
1. Check server logs for request ID
2. Review security incident logs
3. Test with provided test scripts
4. Verify signature generation algorithm
5. Contact payment gateway support if needed
