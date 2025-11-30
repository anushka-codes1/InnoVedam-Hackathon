import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Types
interface WebhookPayload {
  paymentId: string;
  orderId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  timestamp: string;
  signature: string;
  metadata?: {
    itemId?: string;
    buyerId?: string;
    sellerId?: string;
  };
}

interface OrderUpdate {
  orderId: string;
  status: string;
  paymentId: string;
  paymentStatus: string;
  updatedAt: string;
}

// Payment Gateway Secret Key - In production, store in environment variables
const PG_SECRET_KEY = process.env.PAYMENT_GATEWAY_SECRET_KEY || 'your-secret-key-here';

/**
 * Verify the signature sent by Payment Gateway
 * Uses HMAC-SHA256 for cryptographic verification
 */
function verifySignature(data: Omit<WebhookPayload, 'signature'>, receivedSignature: string): boolean {
  try {
    // Create canonical string from payload (excluding signature)
    const canonicalString = [
      data.paymentId,
      data.orderId,
      data.status,
      data.amount.toString(),
      data.timestamp
    ].join('|');

    // Generate HMAC signature using secret key
    const expectedSignature = crypto
      .createHmac('sha256', PG_SECRET_KEY)
      .update(canonicalString)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(receivedSignature)
    );
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

/**
 * Handle successful payment - Post-verification actions
 */
async function handleSuccessfulPayment(orderId: string, paymentId: string): Promise<void> {
  try {
    console.log(`[SUCCESS] Processing successful payment for order: ${orderId}`);

    // 1. Update order status in database
    await updateOrderStatus(orderId, 'PAYMENT_RECEIVED', paymentId);

    // 2. Release meet-up location to both parties
    await releaseMeetupLocation(orderId);

    // 3. Notify seller about successful payment
    await notifySeller(orderId);

    // 4. Update buyer's trust score
    await updateBuyerTrustScore(orderId);

    // 5. Send confirmation emails
    await sendPaymentConfirmationEmails(orderId);

    // 6. Generate QR codes for handoff verification
    await generateHandoffQRCodes(orderId);

    console.log(`[SUCCESS] Order ${orderId} processed successfully`);
  } catch (error) {
    console.error(`[ERROR] Failed to process successful payment for order ${orderId}:`, error);
    throw error;
  }
}

/**
 * Handle failed payment
 */
async function handleFailedPayment(orderId: string, paymentId: string): Promise<void> {
  try {
    console.log(`[FAILED] Processing failed payment for order: ${orderId}`);

    // 1. Update order status
    await updateOrderStatus(orderId, 'PAYMENT_FAILED', paymentId);

    // 2. Initiate refund if payment was captured
    await initiateRefund(paymentId, orderId);

    // 3. Notify buyer about payment failure
    await notifyBuyer(orderId, 'PAYMENT_FAILED');

    // 4. Release inventory/item back to available
    await releaseItemInventory(orderId);

    console.log(`[FAILED] Order ${orderId} marked as failed and refund initiated`);
  } catch (error) {
    console.error(`[ERROR] Failed to process payment failure for order ${orderId}:`, error);
    throw error;
  }
}

/**
 * Update order status in database
 */
async function updateOrderStatus(
  orderId: string,
  status: string,
  paymentId: string
): Promise<void> {
  // In production, update Supabase database
  // const { error } = await supabase
  //   .from('transactions')
  //   .update({
  //     status: status,
  //     payment_status: status,
  //     payment_intent_id: paymentId,
  //     updated_at: new Date().toISOString()
  //   })
  //   .eq('id', orderId);

  console.log(`[DB] Updated order ${orderId} status to ${status}`);
}

/**
 * Release meet-up location to buyer and seller
 */
async function releaseMeetupLocation(orderId: string): Promise<void> {
  // Fetch order details and meeting point
  // Send notifications with location details
  console.log(`[MEETUP] Released meeting location for order ${orderId}`);
}

/**
 * Notify seller about successful payment
 */
async function notifySeller(orderId: string): Promise<void> {
  // Send push notification/email to seller
  // const { error } = await supabase
  //   .from('notifications')
  //   .insert({
  //     user_id: sellerId,
  //     type: 'PAYMENT_RECEIVED',
  //     message: 'Payment received for your item',
  //     order_id: orderId
  //   });

  console.log(`[NOTIFY] Seller notified for order ${orderId}`);
}

/**
 * Update buyer's trust score after successful payment
 */
async function updateBuyerTrustScore(orderId: string): Promise<void> {
  // Increment trust score for timely payment
  // const { error } = await supabase.rpc('increment_trust_score', {
  //   user_id: buyerId,
  //   increment: 2
  // });

  console.log(`[TRUST] Updated buyer trust score for order ${orderId}`);
}

/**
 * Send payment confirmation emails
 */
async function sendPaymentConfirmationEmails(orderId: string): Promise<void> {
  // Send emails to both buyer and seller
  console.log(`[EMAIL] Sent confirmation emails for order ${orderId}`);
}

/**
 * Generate QR codes for handoff verification
 */
async function generateHandoffQRCodes(orderId: string): Promise<void> {
  // Generate unique QR codes for item handoff and return
  // const handoffQR = await generateQRCode({ orderId, type: 'HANDOFF' });
  // const returnQR = await generateQRCode({ orderId, type: 'RETURN' });

  console.log(`[QR] Generated QR codes for order ${orderId}`);
}

/**
 * Notify buyer about payment status
 */
async function notifyBuyer(orderId: string, status: string): Promise<void> {
  console.log(`[NOTIFY] Buyer notified about status ${status} for order ${orderId}`);
}

/**
 * Initiate refund through Payment Gateway
 */
async function initiateRefund(paymentId: string, orderId: string): Promise<void> {
  try {
    // Mock Payment Gateway refund API call
    // In production, call actual PG API:
    // const refundResponse = await PaymentGatewayService.initiateRefund({
    //   paymentId: paymentId,
    //   orderId: orderId,
    //   reason: 'PAYMENT_FAILED'
    // });

    console.log(`[REFUND] Initiated refund for payment ${paymentId}, order ${orderId}`);
  } catch (error) {
    console.error(`[REFUND ERROR] Failed to initiate refund for ${paymentId}:`, error);
    // Log to monitoring system for manual intervention
  }
}

/**
 * Release item inventory back to available
 */
async function releaseItemInventory(orderId: string): Promise<void> {
  // Mark item as available again
  // const { error } = await supabase
  //   .from('items')
  //   .update({ is_available: true })
  //   .eq('id', itemId);

  console.log(`[INVENTORY] Released item inventory for order ${orderId}`);
}

/**
 * Log security incident
 */
function logSecurityIncident(payload: any, reason: string): void {
  const incident = {
    timestamp: new Date().toISOString(),
    reason: reason,
    payload: payload,
    severity: 'HIGH',
    type: 'SIGNATURE_VERIFICATION_FAILED'
  };

  console.error('[SECURITY INCIDENT]', JSON.stringify(incident, null, 2));

  // In production, send to security monitoring service
  // SecurityMonitoringService.logIncident(incident);
}

/**
 * Webhook endpoint handler
 */
export async function POST(request: NextRequest) {
  const requestId = crypto.randomBytes(8).toString('hex');
  console.log(`[WEBHOOK ${requestId}] Received payment webhook`);

  try {
    // Parse request body
    const payload: WebhookPayload = await request.json();

    // Validate required fields
    if (!payload.paymentId || !payload.orderId || !payload.status || !payload.signature) {
      console.error(`[WEBHOOK ${requestId}] Missing required fields`);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          requestId 
        },
        { status: 400 }
      );
    }

    console.log(`[WEBHOOK ${requestId}] Processing payment ${payload.paymentId} for order ${payload.orderId}`);

    // Extract signature from payload
    const { signature: receivedSignature, ...dataToVerify } = payload;

    // CRITICAL: Verify signature before processing
    const isValid = verifySignature(dataToVerify, receivedSignature);

    if (!isValid) {
      // Security incident - signature verification failed
      logSecurityIncident(payload, 'Invalid signature - possible tampering or unauthorized request');
      
      console.error(`[WEBHOOK ${requestId}] SECURITY: Signature verification failed`);
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Signature verification failed',
          requestId 
        },
        { status: 400 }
      );
    }

    console.log(`[WEBHOOK ${requestId}] Signature verified successfully`);

    // Process based on payment status
    switch (payload.status) {
      case 'SUCCESS':
        console.log(`[WEBHOOK ${requestId}] Processing successful payment`);
        await handleSuccessfulPayment(payload.orderId, payload.paymentId);
        
        return NextResponse.json(
          {
            success: true,
            message: 'Payment processed successfully',
            orderId: payload.orderId,
            paymentId: payload.paymentId,
            requestId
          },
          { status: 200 }
        );

      case 'FAILED':
        console.log(`[WEBHOOK ${requestId}] Processing failed payment`);
        await handleFailedPayment(payload.orderId, payload.paymentId);
        
        return NextResponse.json(
          {
            success: true,
            message: 'Payment failure processed',
            orderId: payload.orderId,
            paymentId: payload.paymentId,
            requestId
          },
          { status: 200 }
        );

      case 'PENDING':
        console.log(`[WEBHOOK ${requestId}] Payment pending, no action required`);
        
        return NextResponse.json(
          {
            success: true,
            message: 'Payment pending, will retry',
            orderId: payload.orderId,
            paymentId: payload.paymentId,
            requestId
          },
          { status: 200 }
        );

      default:
        console.error(`[WEBHOOK ${requestId}] Unknown payment status: ${payload.status}`);
        
        return NextResponse.json(
          {
            success: false,
            error: 'Unknown payment status',
            requestId
          },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error(`[WEBHOOK ${requestId}] Error processing webhook:`, error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: error.message,
        requestId
      },
      { status: 500 }
    );
  }
}

/**
 * GET method to check webhook endpoint health
 */
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    endpoint: '/api/payment-webhook',
    timestamp: new Date().toISOString()
  });
}
