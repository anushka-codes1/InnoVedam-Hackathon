import { v4 as uuidv4 } from 'uuid';

/**
 * QR-Based Hand-Off & Return Verification System
 * Super Easy Demo Feature for Trust Building
 */

export interface QRCodeData {
  transactionId: string;
  type: 'handoff' | 'return';
  itemId: string;
  borrowerId: string;
  lenderId: string;
  timestamp: string;
  verificationCode: string;
}

/**
 * Generate unique QR code for transaction handoff
 */
export const generateHandoffQRCode = (
  transactionId: string,
  itemId: string,
  borrowerId: string,
  lenderId: string
): string => {
  const verificationCode = uuidv4();
  
  const qrData: QRCodeData = {
    transactionId,
    type: 'handoff',
    itemId,
    borrowerId,
    lenderId,
    timestamp: new Date().toISOString(),
    verificationCode,
  };

  return JSON.stringify(qrData);
};

/**
 * Generate unique QR code for transaction return
 */
export const generateReturnQRCode = (
  transactionId: string,
  itemId: string,
  borrowerId: string,
  lenderId: string
): string => {
  const verificationCode = uuidv4();
  
  const qrData: QRCodeData = {
    transactionId,
    type: 'return',
    itemId,
    borrowerId,
    lenderId,
    timestamp: new Date().toISOString(),
    verificationCode,
  };

  return JSON.stringify(qrData);
};

/**
 * Parse QR code data from scanned code
 */
export const parseQRCodeData = (qrCodeString: string): QRCodeData | null => {
  try {
    const data = JSON.parse(qrCodeString);
    
    // Validate required fields
    if (
      !data.transactionId ||
      !data.type ||
      !data.itemId ||
      !data.borrowerId ||
      !data.lenderId ||
      !data.verificationCode
    ) {
      return null;
    }

    return data as QRCodeData;
  } catch (error) {
    console.error('Error parsing QR code:', error);
    return null;
  }
};

/**
 * Verify QR code matches transaction
 */
export const verifyQRCode = (
  qrData: QRCodeData,
  expectedTransactionId: string,
  expectedType: 'handoff' | 'return'
): boolean => {
  return (
    qrData.transactionId === expectedTransactionId &&
    qrData.type === expectedType
  );
};

/**
 * Generate QR code image as data URL
 */
export const generateQRCodeImage = async (
  qrCodeData: string,
  size: number = 256
): Promise<string> => {
  try {
    // Using dynamic import for qrcode library
    const QRCode = require('qrcode');
    const dataUrl = await QRCode.toDataURL(qrCodeData, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code image:', error);
    throw error;
  }
};

/**
 * QR Code Component Props for React
 */
export interface QRCodeComponentProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
}

/**
 * Check if QR code has expired (24 hours validity)
 */
export const isQRCodeExpired = (qrData: QRCodeData): boolean => {
  const qrTimestamp = new Date(qrData.timestamp);
  const now = new Date();
  const hoursDiff = (now.getTime() - qrTimestamp.getTime()) / (1000 * 60 * 60);
  
  return hoursDiff > 24; // QR codes expire after 24 hours
};

/**
 * Generate verification summary for display
 */
export const getQRVerificationSummary = (qrData: QRCodeData) => {
  return {
    transactionId: qrData.transactionId,
    type: qrData.type === 'handoff' ? 'Item Handoff' : 'Item Return',
    timestamp: new Date(qrData.timestamp).toLocaleString(),
    isExpired: isQRCodeExpired(qrData),
    verificationCode: qrData.verificationCode.slice(0, 8), // Show first 8 chars
  };
};

/**
 * Handle QR code scan result
 */
export interface QRScanResult {
  success: boolean;
  data?: QRCodeData;
  error?: string;
}

export const handleQRScan = (scannedData: string): QRScanResult => {
  const qrData = parseQRCodeData(scannedData);

  if (!qrData) {
    return {
      success: false,
      error: 'Invalid QR code format',
    };
  }

  if (isQRCodeExpired(qrData)) {
    return {
      success: false,
      error: 'QR code has expired',
    };
  }

  return {
    success: true,
    data: qrData,
  };
};

/**
 * Create handoff and return QR codes for a transaction
 */
export const createTransactionQRCodes = async (
  transactionId: string,
  itemId: string,
  borrowerId: string,
  lenderId: string
) => {
  const handoffQRData = generateHandoffQRCode(transactionId, itemId, borrowerId, lenderId);
  const returnQRData = generateReturnQRCode(transactionId, itemId, borrowerId, lenderId);

  const handoffQRImage = await generateQRCodeImage(handoffQRData);
  const returnQRImage = await generateQRCodeImage(returnQRData);

  return {
    handoff: {
      data: handoffQRData,
      image: handoffQRImage,
    },
    return: {
      data: returnQRData,
      image: returnQRImage,
    },
  };
};

/**
 * Validate QR code before verification
 */
export const validateQRCodeForVerification = (
  qrData: QRCodeData,
  transactionId: string,
  userId: string,
  verificationType: 'handoff' | 'return'
): { valid: boolean; error?: string } => {
  // Check if QR code type matches verification type
  if (qrData.type !== verificationType) {
    return {
      valid: false,
      error: `Wrong QR code type. Expected ${verificationType} QR code.`,
    };
  }

  // Check if transaction ID matches
  if (qrData.transactionId !== transactionId) {
    return {
      valid: false,
      error: 'QR code does not match this transaction.',
    };
  }

  // Check if user is authorized (either borrower or lender)
  if (qrData.borrowerId !== userId && qrData.lenderId !== userId) {
    return {
      valid: false,
      error: 'You are not authorized to verify this transaction.',
    };
  }

  // Check if QR code is expired
  if (isQRCodeExpired(qrData)) {
    return {
      valid: false,
      error: 'QR code has expired. Please request a new one.',
    };
  }

  return { valid: true };
};

/**
 * Generate shareable QR code for easy scanning
 */
export const generateShareableQR = async (
  qrData: string,
  transactionDetails: {
    itemTitle: string;
    lenderName: string;
    borrowerName: string;
  }
) => {
  const qrImage = await generateQRCodeImage(qrData, 512); // Larger for sharing

  return {
    qrImage,
    shareText: `Scan this QR code to verify the ${qrData.includes('handoff') ? 'handoff' : 'return'} of "${transactionDetails.itemTitle}" between ${transactionDetails.lenderName} and ${transactionDetails.borrowerName}.`,
  };
};
