/**
 * Authentication Routes
 * College Email Verification System
 */

import { supabase, verifyCollegeEmail, confirmEmailVerification } from '../../lib/supabase';

export interface AuthRequest {
  email: string;
  collegeEmail: string;
  fullName: string;
  collegeId: string;
  collegeName: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

/**
 * Register new user with college email verification
 */
export const registerUser = async (request: AuthRequest) => {
  try {
    // Validate college email format
    if (!isValidCollegeEmail(request.collegeEmail, request.collegeName)) {
      throw new Error('Invalid college email address');
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: request.email,
      password: generateTemporaryPassword(), // User will set password after verification
      options: {
        data: {
          full_name: request.fullName,
          college_id: request.collegeId,
          college_name: request.collegeName,
        },
      },
    });

    if (authError) throw authError;

    // Create user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        email: request.email,
        college_email: request.collegeEmail,
        full_name: request.fullName,
        phone: request.phone,
        college_id: request.collegeId,
        college_name: request.collegeName,
        is_email_verified: false,
      })
      .select()
      .single();

    if (userError) throw userError;

    // Send college email verification
    await verifyCollegeEmail(request.collegeEmail, authData.user!.id);

    return {
      success: true,
      userId: authData.user?.id,
      message: 'Registration successful! Please verify your college email.',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Verify college email with OTP
 */
export const verifyCollegeEmailOTP = async (
  userId: string,
  email: string,
  otp: string
) => {
  try {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });

    if (error) throw error;

    // Update user verification status
    await confirmEmailVerification(userId);

    return {
      success: true,
      message: 'College email verified successfully!',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Login user
 */
export const loginUser = async (request: LoginRequest) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: request.email,
      password: request.password || '',
    });

    if (error) throw error;

    // Check if college email is verified
    const { data: userData } = await supabase
      .from('users')
      .select('is_email_verified')
      .eq('id', data.user.id)
      .single();

    if (!userData?.is_email_verified) {
      return {
        success: false,
        error: 'Please verify your college email before logging in',
        requiresVerification: true,
      };
    }

    return {
      success: true,
      user: data.user,
      session: data.session,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;

    return {
      success: true,
      message: 'Logged out successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get current authenticated user
 */
export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    if (!user) return null;

    // Get full user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    return profile;
  } catch (error: any) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Validate college email format
 */
const isValidCollegeEmail = (email: string, collegeName: string): boolean => {
  // Check if email ends with .edu or .ac.in
  const eduPattern = /\.(edu|ac\.in)$/i;
  if (!eduPattern.test(email)) {
    return false;
  }

  // Additional validation can be added here for specific colleges
  return true;
};

/**
 * Generate temporary password for initial registration
 */
const generateTemporaryPassword = (): string => {
  return Math.random().toString(36).slice(-12) + 'Aa1!';
};

/**
 * Reset password
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password reset email sent',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Update user password
 */
export const updatePassword = async (newPassword: string) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;

    return {
      success: true,
      message: 'Password updated successfully',
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};
