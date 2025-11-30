#!/usr/bin/env node
/**
 * Simple Node.js script to test webhook endpoint
 * Run with: node scripts/test-webhook.js
 */

const crypto = require('crypto');

const PG_SECRET_KEY = process.env.PAYMENT_GATEWAY_SECRET_KEY || 'your-secret-key-here';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'http://localhost:3000/api/payment-webhook';

function generateSignature(payload) {
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

async function testWebhook(testName, payload, tamper = false) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🧪 ${testName}`);
  console.log(`${'='.repeat(60)}`);

  const signature = generateSignature(payload);
  
  // Optionally tamper with payload for security testing
  const finalPayload = tamper ? { ...payload, amount: 1.00 } : payload;
  
  const requestBody = {
    ...finalPayload,
    signature
  };

  console.log('\n📤 Request:');
  console.log(JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    
    console.log(`\n📥 Response (${response.status}):`);
    console.log(JSON.stringify(result, null, 2));

    if (response.status === 200) {
      console.log('\n✅ Test Passed');
    } else {
      console.log('\n❌ Test Failed');
    }

    return { success: response.status === 200, result };
  } catch (error) {
    console.error('\n💥 Error:', error.message);
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║       Payment Webhook Verification Test Suite             ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log(`\nWebhook URL: ${WEBHOOK_URL}`);
  console.log(`Secret Key: ${PG_SECRET_KEY.substring(0, 10)}...`);

  const tests = [
    {
      name: 'Test 1: Successful Payment',
      payload: {
        paymentId: `PAY_${Date.now()}`,
        orderId: `ORD_${Date.now()}`,
        status: 'SUCCESS',
        amount: 189.75,
        timestamp: new Date().toISOString()
      },
      tamper: false
    },
    {
      name: 'Test 2: Failed Payment',
      payload: {
        paymentId: `PAY_${Date.now() + 1}`,
        orderId: `ORD_${Date.now() + 1}`,
        status: 'FAILED',
        amount: 189.75,
        timestamp: new Date().toISOString()
      },
      tamper: false
    },
    {
      name: 'Test 3: Tampered Payload (Security Test - Should Fail)',
      payload: {
        paymentId: `PAY_${Date.now() + 2}`,
        orderId: `ORD_${Date.now() + 2}`,
        status: 'SUCCESS',
        amount: 189.75,
        timestamp: new Date().toISOString()
      },
      tamper: true
    }
  ];

  const results = [];

  for (const test of tests) {
    const result = await testWebhook(test.name, test.payload, test.tamper);
    results.push({ ...test, ...result });
    
    // Wait a bit between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Summary
  console.log('\n\n╔════════════════════════════════════════════════════════════╗');
  console.log('║                    Test Summary                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  results.forEach((result, index) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} - ${result.name}`);
  });

  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log(`\n📊 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed');
  }
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testWebhook, runTests, generateSignature };
