/**
 * Test Utility for Payment Webhook
 * Simulates Payment Gateway webhook calls with proper signature generation
 */

import crypto from 'crypto';

// Must match the secret in webhook route
const PG_SECRET_KEY = process.env.PAYMENT_GATEWAY_SECRET_KEY || 'your-secret-key-here';

interface TestWebhookPayload {
  paymentId: string;
  orderId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  timestamp: string;
}

/**
 * Generate valid signature for testing
 */
function generateSignature(payload: TestWebhookPayload): string {
  const canonicalString = [
    payload.paymentId,
    payload.orderId,
    payload.status,
    payload.amount.toString(),
    payload.timestamp
  ].join('|');

  return crypto
    .createHmac('sha256', PG_SECRET_KEY)
    .update(canonicalString)
    .digest('hex');
}

/**
 * Test successful payment webhook
 */
export async function testSuccessfulPayment() {
  const payload: TestWebhookPayload = {
    paymentId: `PAY_${Date.now()}`,
    orderId: `ORD_${Date.now()}`,
    status: 'SUCCESS',
    amount: 189.75,
    timestamp: new Date().toISOString()
  };

  const signature = generateSignature(payload);

  const response = await fetch('http://localhost:3000/api/payment-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...payload,
      signature
    })
  });

  const result = await response.json();
  console.log('✅ Successful Payment Test:', result);
  return result;
}

/**
 * Test failed payment webhook
 */
export async function testFailedPayment() {
  const payload: TestWebhookPayload = {
    paymentId: `PAY_${Date.now()}`,
    orderId: `ORD_${Date.now()}`,
    status: 'FAILED',
    amount: 189.75,
    timestamp: new Date().toISOString()
  };

  const signature = generateSignature(payload);

  const response = await fetch('http://localhost:3000/api/payment-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...payload,
      signature
    })
  });

  const result = await response.json();
  console.log('❌ Failed Payment Test:', result);
  return result;
}

/**
 * Test invalid signature (security test)
 */
export async function testInvalidSignature() {
  const payload: TestWebhookPayload = {
    paymentId: `PAY_${Date.now()}`,
    orderId: `ORD_${Date.now()}`,
    status: 'SUCCESS',
    amount: 189.75,
    timestamp: new Date().toISOString()
  };

  // Use wrong signature
  const invalidSignature = 'invalid_signature_12345';

  const response = await fetch('http://localhost:3000/api/payment-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...payload,
      signature: invalidSignature
    })
  });

  const result = await response.json();
  console.log('🔒 Invalid Signature Test:', result);
  return result;
}

/**
 * Test tampered payload (security test)
 */
export async function testTamperedPayload() {
  const payload: TestWebhookPayload = {
    paymentId: `PAY_${Date.now()}`,
    orderId: `ORD_${Date.now()}`,
    status: 'SUCCESS',
    amount: 189.75,
    timestamp: new Date().toISOString()
  };

  const signature = generateSignature(payload);

  // Tamper with amount after generating signature
  const tamperedPayload = {
    ...payload,
    amount: 10.00, // Changed amount
    signature
  };

  const response = await fetch('http://localhost:3000/api/payment-webhook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(tamperedPayload)
  });

  const result = await response.json();
  console.log('⚠️ Tampered Payload Test:', result);
  return result;
}

/**
 * Run all tests
 */
export async function runAllTests() {
  console.log('🧪 Starting Payment Webhook Tests...\n');

  console.log('1️⃣ Testing Successful Payment...');
  await testSuccessfulPayment();
  console.log('\n');

  console.log('2️⃣ Testing Failed Payment...');
  await testFailedPayment();
  console.log('\n');

  console.log('3️⃣ Testing Invalid Signature (Should Fail)...');
  await testInvalidSignature();
  console.log('\n');

  console.log('4️⃣ Testing Tampered Payload (Should Fail)...');
  await testTamperedPayload();
  console.log('\n');

  console.log('✅ All tests completed!');
}

// Export for use in other files
export {
  generateSignature,
  PG_SECRET_KEY
};
