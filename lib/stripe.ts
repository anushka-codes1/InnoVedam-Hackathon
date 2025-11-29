import Stripe from 'stripe';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

// Platform fees configuration (₹3 for normal, ₹15 for priority boost, ₹20 for convenience pickup)
export const PLATFORM_FEES = {
  NORMAL_TRANSACTION: 3.00,
  PRIORITY_BOOST: 15.00,
  CONVENIENCE_PICKUP: 20.00,
  CONVENIENCE_PICKUP_SHARE: 4.00, // ₹4 goes to platform from ₹20
};

export interface PaymentIntentData {
  amount: number;
  borrowerId: string;
  lenderId: string;
  transactionId: string;
  itemTitle: string;
  requiresCollateral: boolean;
  collateralAmount?: number;
}

/**
 * Pre-Authorized Payment: The Magic Feature
 * Creates a payment intent with authorization hold
 * Funds are held but not captured until item is returned
 */
export const createPreAuthorizedPayment = async (data: PaymentIntentData) => {
  const {
    amount,
    borrowerId,
    lenderId,
    transactionId,
    itemTitle,
    requiresCollateral,
    collateralAmount = 0,
  } = data;

  // Calculate total pre-auth amount (rental + collateral if needed)
  const totalPreAuthAmount = requiresCollateral ? amount + collateralAmount : amount;

  try {
    // Create a Payment Intent with capture_method: manual for pre-authorization
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalPreAuthAmount * 100), // Convert to paise/cents
      currency: 'inr',
      capture_method: 'manual', // This creates a pre-auth hold
      metadata: {
        borrower_id: borrowerId,
        lender_id: lenderId,
        transaction_id: transactionId,
        item_title: itemTitle,
        rental_amount: amount.toString(),
        collateral_amount: collateralAmount.toString(),
        requires_collateral: requiresCollateral.toString(),
      },
      description: `Campus Borrow: ${itemTitle}`,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: totalPreAuthAmount,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Error creating pre-authorized payment:', error);
    throw error;
  }
};

/**
 * Capture the pre-authorized payment after successful return
 * This charges the card that was held
 */
export const capturePreAuthorizedPayment = async (
  paymentIntentId: string,
  actualAmount?: number
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Calculate amount to capture (can be less than authorized if returning collateral)
    const captureAmount = actualAmount
      ? Math.round(actualAmount * 100)
      : paymentIntent.amount;

    const captured = await stripe.paymentIntents.capture(paymentIntentId, {
      amount_to_capture: captureAmount,
    });

    return {
      success: true,
      paymentIntentId: captured.id,
      amountCaptured: captured.amount_received / 100,
      status: captured.status,
    };
  } catch (error) {
    console.error('Error capturing payment:', error);
    throw error;
  }
};

/**
 * Cancel pre-authorization if transaction is cancelled
 * This releases the hold on the card
 */
export const cancelPreAuthorization = async (paymentIntentId: string) => {
  try {
    const cancelled = await stripe.paymentIntents.cancel(paymentIntentId);

    return {
      success: true,
      paymentIntentId: cancelled.id,
      status: cancelled.status,
    };
  } catch (error) {
    console.error('Error cancelling pre-authorization:', error);
    throw error;
  }
};

/**
 * Process platform fee distribution
 * Splits payment between lender and platform
 */
export const processPlatformFees = async (
  paymentIntentId: string,
  lenderAccountId: string,
  rentalAmount: number,
  platformFee: number,
  priorityBoostFee: number = 0,
  conveniencePickupFee: number = 0
) => {
  try {
    // Calculate lender's share (rental amount - fees that go to platform)
    const lenderShare = rentalAmount;
    const platformShare = platformFee + priorityBoostFee + PLATFORM_FEES.CONVENIENCE_PICKUP_SHARE;

    // Create a transfer to the lender (requires Stripe Connect setup)
    const transfer = await stripe.transfers.create({
      amount: Math.round(lenderShare * 100),
      currency: 'inr',
      destination: lenderAccountId,
      metadata: {
        payment_intent_id: paymentIntentId,
        rental_amount: rentalAmount.toString(),
        platform_fee: platformFee.toString(),
      },
    });

    return {
      success: true,
      lenderShare,
      platformShare,
      transferId: transfer.id,
    };
  } catch (error) {
    console.error('Error processing platform fees:', error);
    throw error;
  }
};

/**
 * Handle late return penalty
 * Charges additional amount for late returns
 */
export const chargeLateReturnPenalty = async (
  customerId: string,
  penaltyAmount: number,
  transactionId: string,
  hoursLate: number
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(penaltyAmount * 100),
      currency: 'inr',
      customer: customerId,
      metadata: {
        transaction_id: transactionId,
        penalty_type: 'late_return',
        hours_late: hoursLate.toString(),
      },
      description: `Late return penalty - ${hoursLate} hours overdue`,
    });

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      penaltyAmount,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Error charging late penalty:', error);
    throw error;
  }
};

/**
 * Handle collateral return
 * Returns collateral amount to borrower after successful return
 */
export const returnCollateral = async (
  customerId: string,
  collateralAmount: number,
  transactionId: string
) => {
  try {
    // Create a refund for the collateral portion
    const refund = await stripe.refunds.create({
      amount: Math.round(collateralAmount * 100),
      metadata: {
        transaction_id: transactionId,
        refund_type: 'collateral_return',
      },
    });

    return {
      success: true,
      refundId: refund.id,
      amountReturned: collateralAmount,
      status: refund.status,
    };
  } catch (error) {
    console.error('Error returning collateral:', error);
    throw error;
  }
};

/**
 * Create Stripe Connect account for lenders
 * Allows lenders to receive direct payments
 */
export const createConnectedAccount = async (
  email: string,
  userId: string,
  fullName: string
) => {
  try {
    const account = await stripe.accounts.create({
      type: 'express',
      email,
      capabilities: {
        transfers: { requested: true },
      },
      metadata: {
        user_id: userId,
        platform: 'campus_borrow',
      },
      business_profile: {
        name: fullName,
      },
    });

    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/payments/complete`,
      type: 'account_onboarding',
    });

    return {
      accountId: account.id,
      onboardingUrl: accountLink.url,
    };
  } catch (error) {
    console.error('Error creating connected account:', error);
    throw error;
  }
};

/**
 * Process buddy courier payment
 * Pays courier for delivery service
 */
export const processCourierPayment = async (
  courierId: string,
  courierAccountId: string,
  deliveryFee: number,
  transactionId: string
) => {
  try {
    const transfer = await stripe.transfers.create({
      amount: Math.round(deliveryFee * 100),
      currency: 'inr',
      destination: courierAccountId,
      metadata: {
        courier_id: courierId,
        transaction_id: transactionId,
        payment_type: 'delivery_fee',
      },
    });

    return {
      success: true,
      transferId: transfer.id,
      amountPaid: deliveryFee,
    };
  } catch (error) {
    console.error('Error processing courier payment:', error);
    throw error;
  }
};

/**
 * Calculate total transaction amount including all fees
 */
export const calculateTransactionTotal = (
  rentalPrice: number,
  isPriorityDelivery: boolean = false,
  isConveniencePickup: boolean = false,
  requiresCollateral: boolean = false,
  collateralAmount: number = 0
): {
  rentalAmount: number;
  platformFee: number;
  priorityBoostFee: number;
  conveniencePickupFee: number;
  collateralAmount: number;
  totalAmount: number;
  preAuthAmount: number;
} => {
  const platformFee = PLATFORM_FEES.NORMAL_TRANSACTION;
  const priorityBoostFee = isPriorityDelivery ? PLATFORM_FEES.PRIORITY_BOOST : 0;
  const conveniencePickupFee = isConveniencePickup ? PLATFORM_FEES.CONVENIENCE_PICKUP : 0;

  const totalAmount = rentalPrice + platformFee + priorityBoostFee + conveniencePickupFee;
  const preAuthAmount = requiresCollateral ? totalAmount + collateralAmount : totalAmount;

  return {
    rentalAmount: rentalPrice,
    platformFee,
    priorityBoostFee,
    conveniencePickupFee,
    collateralAmount: requiresCollateral ? collateralAmount : 0,
    totalAmount,
    preAuthAmount,
  };
};

/**
 * Verify payment status
 */
export const verifyPaymentStatus = async (paymentIntentId: string) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      status: paymentIntent.status,
      amount: paymentIntent.amount / 100,
      captured: paymentIntent.status === 'succeeded',
      requiresAction: paymentIntent.status === 'requires_action',
    };
  } catch (error) {
    console.error('Error verifying payment status:', error);
    throw error;
  }
};

export default stripe;
