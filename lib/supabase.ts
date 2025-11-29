import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database Types
export interface User {
  id: string;
  email: string;
  college_email: string;
  full_name: string;
  phone?: string;
  college_id: string;
  college_name: string;
  is_email_verified: boolean;
  trust_score: number;
  total_borrows: number;
  total_lends: number;
  on_time_returns: number;
  late_returns: number;
  is_buddy_courier: boolean;
  buddy_courier_rating: number;
}

export interface Item {
  id: string;
  owner_id: string;
  title: string;
  description?: string;
  category: string;
  base_price: number;
  min_price: number;
  max_price: number;
  suggested_price: number;
  requires_collateral: boolean;
  collateral_amount?: number;
  is_high_value: boolean;
  condition: string;
  available_quantity: number;
  images?: string[];
  allows_self_delivery: boolean;
  allows_buddy_delivery: boolean;
  allows_priority_delivery: boolean;
  pickup_location?: string;
  campus_building?: string;
  is_available: boolean;
}

export interface Transaction {
  id: string;
  item_id: string;
  borrower_id: string;
  lender_id: string;
  borrow_start_time: string;
  expected_return_time: string;
  actual_return_time?: string;
  duration_hours: number;
  agreed_price: number;
  platform_fee: number;
  priority_boost_fee: number;
  convenience_pickup_fee: number;
  total_amount: number;
  payment_intent_id?: string;
  payment_status: string;
  pre_auth_amount?: number;
  security_deposit?: number;
  handoff_qr_code?: string;
  return_qr_code?: string;
  handoff_verified: boolean;
  return_verified: boolean;
  delivery_method: 'self' | 'buddy' | 'priority';
  buddy_courier_id?: string;
  meeting_point?: string;
  risk_score?: number;
  risk_factors?: any;
  status: string;
}

// Authentication Functions
export const verifyCollegeEmail = async (email: string, userId: string) => {
  // Send verification email
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) throw error;

  // Update user record
  await supabase
    .from('users')
    .update({ college_email: email, is_email_verified: false })
    .eq('id', userId);

  return data;
};

export const confirmEmailVerification = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .update({ is_email_verified: true })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// User Functions
export const getUserById = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as User;
};

export const updateUserTrustScore = async (userId: string, scoreChange: number) => {
  const user = await getUserById(userId);
  const newScore = Math.max(0, Math.min(100, user.trust_score + scoreChange));

  const { data, error } = await supabase
    .from('users')
    .update({ trust_score: newScore })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Item Functions
export const createItem = async (itemData: Partial<Item>) => {
  const { data, error } = await supabase
    .from('items')
    .insert(itemData)
    .select()
    .single();

  if (error) throw error;
  return data as Item;
};

export const getAvailableItems = async (category?: string) => {
  let query = supabase
    .from('items')
    .select('*, users:owner_id(*)')
    .eq('is_available', true);

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getItemById = async (itemId: string) => {
  const { data, error } = await supabase
    .from('items')
    .select('*, users:owner_id(*)')
    .eq('id', itemId)
    .single();

  if (error) throw error;
  return data;
};

// Transaction Functions
export const createTransaction = async (transactionData: Partial<Transaction>) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert(transactionData)
    .select()
    .single();

  if (error) throw error;
  return data as Transaction;
};

export const getTransactionById = async (transactionId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      items(*),
      borrower:borrower_id(*),
      lender:lender_id(*),
      buddy_courier:buddy_courier_id(*)
    `)
    .eq('id', transactionId)
    .single();

  if (error) throw error;
  return data;
};

export const getUserTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      items(*),
      borrower:borrower_id(*),
      lender:lender_id(*)
    `)
    .or(`borrower_id.eq.${userId},lender_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const updateTransactionStatus = async (
  transactionId: string,
  status: string,
  additionalData?: any
) => {
  const { data, error } = await supabase
    .from('transactions')
    .update({ status, ...additionalData })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// QR Verification Functions
export const verifyHandoff = async (transactionId: string, qrCode: string) => {
  const transaction = await getTransactionById(transactionId);

  if (transaction.handoff_qr_code !== qrCode) {
    throw new Error('Invalid QR code');
  }

  const { data, error } = await supabase
    .from('transactions')
    .update({
      handoff_verified: true,
      handoff_timestamp: new Date().toISOString(),
      status: 'active',
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const verifyReturn = async (transactionId: string, qrCode: string) => {
  const transaction = await getTransactionById(transactionId);

  if (transaction.return_qr_code !== qrCode) {
    throw new Error('Invalid QR code');
  }

  const isOnTime = new Date() <= new Date(transaction.expected_return_time);

  // Update transaction
  const { data, error } = await supabase
    .from('transactions')
    .update({
      return_verified: true,
      return_timestamp: new Date().toISOString(),
      actual_return_time: new Date().toISOString(),
      status: 'completed',
    })
    .eq('id', transactionId)
    .select()
    .single();

  if (error) throw error;

  // Update user metrics
  await supabase.rpc('update_return_metrics', {
    borrower_id: transaction.borrower_id,
    is_on_time: isOnTime,
  });

  return data;
};

// Meeting Point Functions
export const getPopularMeetingPoints = async () => {
  const { data, error } = await supabase
    .from('meeting_points')
    .select('*')
    .eq('is_popular', true)
    .order('usage_count', { ascending: false });

  if (error) throw error;
  return data;
};

export const incrementMeetingPointUsage = async (meetingPointId: string) => {
  const { data, error } = await supabase
    .from('meeting_points')
    .select('usage_count')
    .eq('id', meetingPointId)
    .single();

  if (error) throw error;

  await supabase
    .from('meeting_points')
    .update({ usage_count: data.usage_count + 1 })
    .eq('id', meetingPointId);
};

// Buddy Courier Functions
export const getAvailableBuddyCouriers = async (campusZone?: string) => {
  let query = supabase
    .from('buddy_couriers')
    .select('*, users:user_id(*)')
    .eq('is_available', true);

  if (campusZone) {
    query = query.eq('campus_zone', campusZone);
  }

  const { data, error } = await query.order('rating', { ascending: false });

  if (error) throw error;
  return data;
};

// Price Reporting Functions
export const reportPriceAbuse = async (
  itemId: string,
  reporterId: string,
  reportedPrice: number,
  fairPriceEstimate: number,
  reason: string
) => {
  const { data, error } = await supabase
    .from('price_reports')
    .insert({
      item_id: itemId,
      reporter_id: reporterId,
      reported_price: reportedPrice,
      fair_price_estimate: fairPriceEstimate,
      reason,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Notification Functions
export const createNotification = async (
  userId: string,
  title: string,
  message: string,
  type: string,
  relatedTransactionId?: string
) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      type,
      related_transaction_id: relatedTransactionId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) throw error;
  return data;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
  return data;
};
