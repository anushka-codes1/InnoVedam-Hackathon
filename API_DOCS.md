# API Documentation

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All authenticated endpoints require a valid Supabase session token in the Authorization header:

```
Authorization: Bearer <supabase_access_token>
```

---

## Authentication Routes

### POST /api/auth/register
Register a new user with college email verification.

**Request Body:**
```json
{
  "email": "user@example.com",
  "collegeEmail": "user@university.edu",
  "fullName": "John Doe",
  "collegeId": "CS2021001",
  "collegeName": "University Name",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "userId": "uuid",
  "message": "Registration successful! Please verify your college email."
}
```

### POST /api/auth/verify-email
Verify college email with OTP.

**Request Body:**
```json
{
  "userId": "uuid",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "College email verified successfully!"
}
```

### POST /api/auth/login
Login user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": { /* user object */ },
  "session": { /* session object */ }
}
```

---

## Items Routes

### POST /api/items
Create a new item listing.

**Auth Required:** Yes

**Request Body:**
```json
{
  "ownerId": "uuid",
  "title": "MacBook Pro 2021",
  "description": "Excellent condition, barely used",
  "category": "laptop",
  "condition": "excellent",
  "availableQuantity": 1,
  "images": ["https://..."],
  "pickupLocation": "Main Library",
  "campusBuilding": "Library Block",
  "allowsSelfDelivery": true,
  "allowsBuddyDelivery": true,
  "allowsPriorityDelivery": true,
  "customPrice": 100,
  "estimatedValue": 50000
}
```

**Response:**
```json
{
  "success": true,
  "item": { /* item object */ },
  "priceSuggestion": {
    "suggestedPrice": 100,
    "minPrice": 50,
    "maxPrice": 300,
    "explanation": "Based on laptop category..."
  }
}
```

### GET /api/items
Get all available items with optional filters.

**Query Parameters:**
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter
- `campus_building` (optional): Filter by building
- `search` (optional): Search in title/description

**Response:**
```json
{
  "success": true,
  "items": [/* array of items */],
  "count": 25
}
```

### GET /api/items/:id
Get item by ID.

**Response:**
```json
{
  "success": true,
  "item": {
    "id": "uuid",
    "title": "MacBook Pro 2021",
    "owner": { /* owner details */ },
    /* ...other fields */
  }
}
```

### PUT /api/items/:id
Update item.

**Auth Required:** Yes (must be owner)

**Request Body:** (partial update)
```json
{
  "title": "Updated Title",
  "isAvailable": false
}
```

### DELETE /api/items/:id
Delete item.

**Auth Required:** Yes (must be owner)

---

## Transactions Routes

### POST /api/transactions
Create a new borrowing transaction.

**Auth Required:** Yes

**Request Body:**
```json
{
  "itemId": "uuid",
  "borrowerId": "uuid",
  "lenderId": "uuid",
  "borrowStartTime": "2025-11-30T10:00:00Z",
  "expectedReturnTime": "2025-12-01T10:00:00Z",
  "agreedPrice": 100,
  "deliveryMethod": "self",
  "borrowerLocation": { "lat": 12.9716, "lng": 77.5946 },
  "lenderLocation": { "lat": 12.9720, "lng": 77.5950 },
  "userTrustScore": 85,
  "userReturnHistory": {
    "totalBorrows": 10,
    "onTimeReturns": 9,
    "lateReturns": 1,
    "disputes": 0
  },
  "userAccountAge": 45
}
```

**Response:**
```json
{
  "success": true,
  "transaction": { /* transaction object */ },
  "payment": {
    "clientSecret": "pi_xxx_secret_xxx",
    "amount": 123
  },
  "qrCodes": {
    "handoff": {
      "data": "JSON string",
      "image": "data:image/png;base64,..."
    },
    "return": {
      "data": "JSON string",
      "image": "data:image/png;base64,..."
    }
  },
  "riskAssessment": {
    "score": 35,
    "level": "medium",
    "factors": [/* risk factors */],
    "recommendations": [/* recommendations */]
  }
}
```

### POST /api/transactions/:id/verify-handoff
Verify item handoff with QR code.

**Auth Required:** Yes

**Request Body:**
```json
{
  "qrCode": "JSON string from QR scan"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": { /* updated transaction */ },
  "message": "Handoff verified! Transaction is now active."
}
```

### POST /api/transactions/:id/verify-return
Verify item return with QR code.

**Auth Required:** Yes

**Request Body:**
```json
{
  "qrCode": "JSON string from QR scan"
}
```

**Response:**
```json
{
  "success": true,
  "transaction": { /* updated transaction */ },
  "message": "Return verified! Transaction completed successfully."
}
```

### GET /api/transactions
Get user's transactions.

**Auth Required:** Yes

**Query Parameters:**
- `status` (optional): Filter by status (pending, active, completed, cancelled)

**Response:**
```json
{
  "success": true,
  "transactions": [/* array of transactions */],
  "count": 15
}
```

### GET /api/transactions/:id
Get transaction details.

**Auth Required:** Yes

**Response:**
```json
{
  "success": true,
  "transaction": {
    "id": "uuid",
    "item": { /* item details */ },
    "borrower": { /* borrower details */ },
    "lender": { /* lender details */ },
    "status": "active",
    /* ...other fields */
  }
}
```

### POST /api/transactions/:id/cancel
Cancel transaction.

**Auth Required:** Yes (must be borrower or lender)

**Request Body:**
```json
{
  "reason": "Changed my mind"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Transaction cancelled successfully"
}
```

### POST /api/transactions/:id/report-issue
Report issue with transaction.

**Auth Required:** Yes

**Request Body:**
```json
{
  "issueType": "item_damaged",
  "description": "Item was already damaged when received"
}
```

---

## Utility Endpoints

### POST /api/pricing/suggest
Get price suggestion for an item.

**Request Body:**
```json
{
  "category": "laptop",
  "durationHours": 24,
  "condition": "excellent",
  "demandLevel": "medium"
}
```

**Response:**
```json
{
  "suggestedPrice": 100,
  "minPrice": 50,
  "maxPrice": 300,
  "basePrice": 100,
  "breakdown": {
    "baseCost": 100,
    "durationCost": 25,
    "conditionAdjustment": 2.5,
    "demandAdjustment": 0
  },
  "explanation": "Based on laptop category, 24h duration..."
}
```

### POST /api/pricing/check-abuse
Check if price is potentially abusive.

**Request Body:**
```json
{
  "actualPrice": 200,
  "suggestedPrice": 100,
  "category": "laptop"
}
```

**Response:**
```json
{
  "isAbusive": true,
  "severity": "moderate",
  "message": "Price is 100% higher than fair price (₹100). Consider reporting."
}
```

### GET /api/meeting-points
Get popular campus meeting points.

**Response:**
```json
{
  "success": true,
  "meetingPoints": [
    {
      "id": "uuid",
      "name": "Main Library Entrance",
      "campus_building": "Library Block",
      "coordinates": { "lat": 12.9716, "lng": 77.5946 },
      "is_popular": true
    }
  ]
}
```

### POST /api/meeting-points/suggest
Get best meeting point suggestion.

**Request Body:**
```json
{
  "borrowerLocation": { "lat": 12.9716, "lng": 77.5946 },
  "lenderLocation": { "lat": 12.9720, "lng": 77.5950 }
}
```

**Response:**
```json
{
  "meetingPoint": { /* meeting point details */ },
  "reason": "Popular spot and very close to both of you",
  "distance": 0.5,
  "walkTime": 6
}
```

### POST /api/risk/calculate
Calculate return risk score.

**Request Body:**
```json
{
  "userTrustScore": 85,
  "userReturnHistory": {
    "totalBorrows": 10,
    "onTimeReturns": 9,
    "lateReturns": 1,
    "disputes": 0
  },
  "itemValue": 50000,
  "borrowDuration": 24,
  "hasCollateral": true,
  "userAccountAge": 45,
  "timeOfDay": 14,
  "dayOfWeek": 3
}
```

**Response:**
```json
{
  "score": 35,
  "level": "medium",
  "factors": [
    {
      "name": "Excellent Trust Score",
      "impact": "positive",
      "description": "User has high trust score of 85/100"
    }
  ],
  "recommendations": [
    "Enable auto-reminders 24 hours before due date"
  ],
  "shouldRequireCollateral": false
}
```

### GET /api/delivery/options
Get available delivery options.

**Query Parameters:**
- `itemId`: Item ID
- `distance`: Distance in km

**Response:**
```json
{
  "success": true,
  "options": [
    {
      "method": "self",
      "name": "Self Pickup & Return",
      "description": "Meet at a campus location...",
      "estimatedTime": "Flexible",
      "additionalCost": 0,
      "available": true,
      "icon": "🤝"
    },
    {
      "method": "buddy",
      "name": "Buddy Courier",
      "description": "A verified student courier...",
      "estimatedTime": "30-60 minutes",
      "additionalCost": 20,
      "available": true,
      "icon": "🚴"
    }
  ]
}
```

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- **Free tier**: 100 requests/minute per IP
- **Authenticated**: 1000 requests/minute per user

---

## Webhooks

### Stripe Webhook: POST /api/webhooks/stripe

Receives Stripe events.

**Events Handled:**
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `charge.refunded`

**Security:** Verifies webhook signature

---

## Testing

Use test credentials:
- Stripe Test Card: `4242 4242 4242 4242`
- Test Email: Any `@example.com` email
- Test Phone: Any 10-digit number

---

## Support

For API support:
- 📧 api-support@example.com
- 📚 Full docs: https://docs.example.com
