/**
 * Transactions API Routes
 * Handle borrowing, returns, payments, and QR verification
 */

import {
  supabase,
  createTransaction,
  getTransactionById,
  getUserTransactions,
  updateTransactionStatus,
  verifyHandoff,
  verifyReturn,
  Transaction,
} from '../../lib/supabase';
import {
  createPreAuthorizedPayment,
  capturePreAuthorizedPayment,
  cancelPreAuthorization,
  calculateTransactionTotal,
} from '../../lib/stripe';
import { createTransactionQRCodes } from '../../utils/qr';
import { calculateReturnRiskScore, RiskFactors } from '../../utils/riskScore';
import { suggestBestMeetingPoint } from '../../utils/meetingPoint';
import { getDeliveryOptions } from '../../utils/delivery';

export interface CreateTransactionRequest {
  itemId: string;
  borrowerId: string;
  lenderId: string;
  borrowStartTime: string;
  expectedReturnTime: string;
  agreedPrice: number;
  deliveryMethod: 'self' | 'buddy' | 'priority';
  buddyCourierId?: string;
  borrowerLocation?: { lat: number; lng: number };
  lenderLocation?: { lat: number; lng: number };
  userTrustScore: number;
  userReturnHistory: RiskFactors['userReturnHistory'];
  userAccountAge: number;
}

/**
 * Create new borrowing transaction
 */
export const createBorrowTransaction = async (request: CreateTransactionRequest) => {
  try {
    // Get item details
    const { data: item, error: itemError } = await supabase
      .from('items')
      .select('*')
      .eq('id', request.itemId)
      .single();

    if (itemError || !item) {
      return { success: false, error: 'Item not found' };
    }

    // Calculate duration
    const startTime = new Date(request.borrowStartTime);
    const endTime = new Date(request.expectedReturnTime);
    const durationHours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));

    // Calculate risk score
    const riskFactors: RiskFactors = {
      userTrustScore: request.userTrustScore,
      userReturnHistory: request.userReturnHistory,
      itemValue: item.suggested_price * 10, // Estimate item value
      borrowDuration: durationHours,
      hasCollateral: item.requires_collateral,
      userAccountAge: request.userAccountAge,
      timeOfDay: new Date().getHours(),
      dayOfWeek: new Date().getDay(),
    };

    const riskAssessment = calculateReturnRiskScore(riskFactors);

    // Calculate pricing
    const isPriority = request.deliveryMethod === 'priority';
    const isConvenience = request.deliveryMethod === 'buddy';
    
    const pricing = calculateTransactionTotal(
      request.agreedPrice,
      isPriority,
      isConvenience,
      item.requires_collateral,
      item.collateral_amount || 0
    );

    // Find optimal meeting point for self-delivery
    let meetingPoint: string | undefined = undefined;
    if (request.deliveryMethod === 'self' && request.borrowerLocation && request.lenderLocation) {
      const suggestion = suggestBestMeetingPoint(
        request.borrowerLocation,
        request.lenderLocation
      );
      meetingPoint = suggestion.meetingPoint.name;
    }

    // Generate QR codes for handoff and return
    const qrCodes = await createTransactionQRCodes(
      '', // Transaction ID will be filled after creation
      request.itemId,
      request.borrowerId,
      request.lenderId
    );

    // Create pre-authorized payment
    const payment = await createPreAuthorizedPayment({
      amount: pricing.totalAmount,
      borrowerId: request.borrowerId,
      lenderId: request.lenderId,
      transactionId: '', // Will be updated
      itemTitle: item.title,
      requiresCollateral: item.requires_collateral,
      collateralAmount: item.collateral_amount,
    });

    // Create transaction record
    const transaction = await createTransaction({
      item_id: request.itemId,
      borrower_id: request.borrowerId,
      lender_id: request.lenderId,
      borrow_start_time: request.borrowStartTime,
      expected_return_time: request.expectedReturnTime,
      duration_hours: durationHours,
      agreed_price: request.agreedPrice,
      platform_fee: pricing.platformFee,
      priority_boost_fee: pricing.priorityBoostFee,
      convenience_pickup_fee: pricing.conveniencePickupFee,
      total_amount: pricing.totalAmount,
      payment_intent_id: payment.paymentIntentId,
      payment_status: 'pre-authorized',
      pre_auth_amount: pricing.preAuthAmount,
      security_deposit: pricing.collateralAmount,
      handoff_qr_code: qrCodes.handoff.data,
      return_qr_code: qrCodes.return.data,
      handoff_verified: false,
      return_verified: false,
      delivery_method: request.deliveryMethod,
      buddy_courier_id: request.buddyCourierId,
      meeting_point: meetingPoint,
      risk_score: riskAssessment.score,
      risk_factors: riskAssessment,
      status: 'pending',
    });

    // Mark item as unavailable
    await supabase
      .from('items')
      .update({ is_available: false })
      .eq('id', request.itemId);

    return {
      success: true,
      transaction,
      payment: {
        clientSecret: payment.clientSecret,
        amount: pricing.preAuthAmount,
      },
      qrCodes,
      riskAssessment,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify handoff with QR code
 */
export const verifyTransactionHandoff = async (
  transactionId: string,
  qrCode: string
) => {
  try {
    const transaction = await verifyHandoff(transactionId, qrCode);

    return {
      success: true,
      transaction,
      message: 'Handoff verified! Transaction is now active.',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify return with QR code
 */
export const verifyTransactionReturn = async (
  transactionId: string,
  qrCode: string
) => {
  try {
    const transaction = await verifyReturn(transactionId, qrCode);

    // Capture payment
    const fullTransaction = await getTransactionById(transactionId);
    
    if (fullTransaction.payment_intent_id) {
      // Calculate actual amount to charge (return collateral if on-time)
      const isOnTime = new Date() <= new Date(fullTransaction.expected_return_time);
      const actualAmount = isOnTime
        ? fullTransaction.total_amount
        : fullTransaction.total_amount; // Could add late fees here

      await capturePreAuthorizedPayment(
        fullTransaction.payment_intent_id,
        actualAmount
      );

      await updateTransactionStatus(transactionId, 'completed', {
        payment_status: 'captured',
      });
    }

    // Make item available again
    await supabase
      .from('items')
      .update({ is_available: true })
      .eq('id', fullTransaction.item_id);

    return {
      success: true,
      transaction,
      message: 'Return verified! Transaction completed successfully.',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Cancel transaction
 */
export const cancelTransaction = async (
  transactionId: string,
  userId: string,
  reason: string
) => {
  try {
    const transaction = await getTransactionById(transactionId);

    // Only allow cancellation if not yet handed off
    if (transaction.handoff_verified) {
      return {
        success: false,
        error: 'Cannot cancel transaction after handoff',
      };
    }

    // Verify user is part of transaction
    if (transaction.borrower_id !== userId && transaction.lender_id !== userId) {
      return {
        success: false,
        error: 'You are not authorized to cancel this transaction',
      };
    }

    // Cancel pre-authorization
    if (transaction.payment_intent_id) {
      await cancelPreAuthorization(transaction.payment_intent_id);
    }

    // Update transaction status
    await updateTransactionStatus(transactionId, 'cancelled', {
      payment_status: 'cancelled',
    });

    // Make item available again
    await supabase
      .from('items')
      .update({ is_available: true })
      .eq('id', transaction.item_id);

    return {
      success: true,
      message: 'Transaction cancelled successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get user's transactions
 */
export const getTransactions = async (userId: string, status?: string) => {
  try {
    let query = supabase
      .from('transactions')
      .select(`
        *,
        items(*),
        borrower:borrower_id(*),
        lender:lender_id(*),
        buddy_courier:buddy_courier_id(*)
      `)
      .or(`borrower_id.eq.${userId},lender_id.eq.${userId}`);

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    return {
      success: true,
      transactions: data,
      count: data?.length || 0,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get transaction details
 */
export const getTransaction = async (transactionId: string) => {
  try {
    const transaction = await getTransactionById(transactionId);

    return {
      success: true,
      transaction,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Report issue with transaction
 */
export const reportTransactionIssue = async (
  transactionId: string,
  reporterId: string,
  issueType: string,
  description: string
) => {
  try {
    // Update transaction status to disputed
    await updateTransactionStatus(transactionId, 'disputed');

    // Create notification for admin review
    await supabase
      .from('notifications')
      .insert({
        user_id: reporterId,
        title: 'Dispute Reported',
        message: `Your dispute for transaction ${transactionId} has been submitted for review.`,
        type: 'dispute',
        related_transaction_id: transactionId,
      });

    return {
      success: true,
      message: 'Issue reported successfully. Admin will review.',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};
