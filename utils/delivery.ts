/**
 * Delivery Options System
 * Self-Delivery, Buddy Couriers, and Priority Delivery
 */

export type DeliveryMethod = 'self' | 'buddy' | 'priority';

export interface DeliveryOption {
  method: DeliveryMethod;
  name: string;
  description: string;
  estimatedTime: string;
  additionalCost: number;
  available: boolean;
  icon: string;
}

export interface BuddyCourier {
  id: string;
  userId: string;
  name: string;
  rating: number;
  totalDeliveries: number;
  currentLocation: {
    lat: number;
    lng: number;
  };
  isAvailable: boolean;
  campusZone: string;
  deliveryRadiusKm: number;
  earningsTotal: number;
}

export interface DeliveryRequest {
  transactionId: string;
  itemId: string;
  pickupLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  dropoffLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  deliveryMethod: DeliveryMethod;
  courierId?: string;
  estimatedTime: string;
  deliveryFee: number;
}

/**
 * Get available delivery options for a transaction
 */
export const getDeliveryOptions = (
  itemAllowsSelfDelivery: boolean,
  itemAllowsBuddyDelivery: boolean,
  itemAllowsPriorityDelivery: boolean,
  distance: number // km between pickup and dropoff
): DeliveryOption[] => {
  const options: DeliveryOption[] = [];

  // Self-Delivery (always available if allowed)
  if (itemAllowsSelfDelivery) {
    options.push({
      method: 'self',
      name: 'Self Pickup & Return',
      description: 'Meet at a campus location to exchange the item',
      estimatedTime: 'Flexible',
      additionalCost: 0,
      available: true,
      icon: '🤝',
    });
  }

  // Buddy Courier Delivery
  if (itemAllowsBuddyDelivery && distance <= 3) {
    options.push({
      method: 'buddy',
      name: 'Buddy Courier',
      description: 'A verified student courier will deliver the item',
      estimatedTime: '30-60 minutes',
      additionalCost: calculateBuddyDeliveryFee(distance),
      available: true,
      icon: '🚴',
    });
  }

  // Priority Delivery (borrower picks up from lender)
  if (itemAllowsPriorityDelivery) {
    options.push({
      method: 'priority',
      name: 'Priority Pickup',
      description: 'You pick up directly from lender for faster access',
      estimatedTime: 'Immediate',
      additionalCost: 20, // ₹20 fee
      available: true,
      icon: '⚡',
    });
  }

  return options;
};

/**
 * Calculate buddy courier delivery fee based on distance
 */
export const calculateBuddyDeliveryFee = (distanceKm: number): number => {
  const baseFee = 15; // ₹15 base fee
  const perKmFee = 5; // ₹5 per km
  
  return baseFee + Math.ceil(distanceKm) * perKmFee;
};

/**
 * Find available buddy couriers near pickup location
 */
export const findNearbyBuddyCouriers = (
  pickupLocation: { lat: number; lng: number },
  couriers: BuddyCourier[],
  maxDistance: number = 2.0 // km
): BuddyCourier[] => {
  const calculateDistance = (
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number => {
    const R = 6371;
    const dLat = toRad(point2.lat - point1.lat);
    const dLng = toRad(point2.lng - point1.lng);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(point1.lat)) *
        Math.cos(toRad(point2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRad = (value: number): number => (value * Math.PI) / 180;

  return couriers
    .filter((courier) => courier.isAvailable)
    .map((courier) => ({
      ...courier,
      distanceFromPickup: calculateDistance(pickupLocation, courier.currentLocation),
    }))
    .filter((courier) => courier.distanceFromPickup <= maxDistance)
    .sort((a, b) => {
      // Sort by rating first, then by distance
      if (Math.abs(a.rating - b.rating) > 0.5) {
        return b.rating - a.rating;
      }
      return a.distanceFromPickup - b.distanceFromPickup;
    });
};

/**
 * Calculate estimated delivery time
 */
export const calculateDeliveryTime = (
  method: DeliveryMethod,
  distance: number
): string => {
  switch (method) {
    case 'self':
      return 'Flexible (arranged between users)';
    case 'buddy':
      const baseTime = 15; // minutes
      const timePerKm = 8; // minutes per km
      const totalMinutes = baseTime + Math.ceil(distance) * timePerKm;
      return `${totalMinutes}-${totalMinutes + 15} minutes`;
    case 'priority':
      return 'Immediate (you go to lender)';
    default:
      return 'Unknown';
  }
};

/**
 * Validate delivery request
 */
export const validateDeliveryRequest = (
  request: DeliveryRequest
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (request.deliveryMethod === 'buddy' && !request.courierId) {
    errors.push('Buddy courier must be selected for buddy delivery');
  }

  const distance = calculateDeliveryDistance(
    request.pickupLocation,
    request.dropoffLocation
  );

  if (request.deliveryMethod === 'buddy' && distance > 5) {
    errors.push('Buddy delivery is only available for distances up to 5km');
  }

  if (request.deliveryFee < 0) {
    errors.push('Delivery fee cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Calculate distance between pickup and dropoff
 */
export const calculateDeliveryDistance = (
  pickup: { lat: number; lng: number },
  dropoff: { lat: number; lng: number }
): number => {
  const R = 6371;
  const dLat = toRad(dropoff.lat - pickup.lat);
  const dLng = toRad(dropoff.lng - pickup.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(pickup.lat)) *
      Math.cos(toRad(dropoff.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (value: number): number => (value * Math.PI) / 180;

/**
 * Generate delivery instructions
 */
export const generateDeliveryInstructions = (
  method: DeliveryMethod,
  deliveryDetails: {
    itemTitle: string;
    lenderName: string;
    borrowerName: string;
    pickupAddress: string;
    dropoffAddress?: string;
    meetingPoint?: string;
    courierName?: string;
  }
): string => {
  switch (method) {
    case 'self':
      return `
📦 Self-Delivery Instructions
━━━━━━━━━━━━━━━━━━━━━━
Item: ${deliveryDetails.itemTitle}
Lender: ${deliveryDetails.lenderName}
Borrower: ${deliveryDetails.borrowerName}

📍 Meeting Point: ${deliveryDetails.meetingPoint || 'To be decided'}

Steps:
1. Coordinate meeting time with the other party
2. Meet at the agreed location
3. Verify item condition together
4. Scan the handoff QR code to confirm exchange
5. Transaction is now active!

💡 Tip: Choose a public, well-lit area on campus
      `.trim();

    case 'buddy':
      return `
🚴 Buddy Courier Delivery
━━━━━━━━━━━━━━━━━━━━━━
Item: ${deliveryDetails.itemTitle}
Courier: ${deliveryDetails.courierName || 'To be assigned'}

📍 Pickup: ${deliveryDetails.pickupAddress}
📍 Dropoff: ${deliveryDetails.dropoffAddress}

For Lender (${deliveryDetails.lenderName}):
1. Wait for courier at pickup location
2. Hand over item to courier
3. Courier will scan handoff QR code

For Borrower (${deliveryDetails.borrowerName}):
1. Wait at dropoff location
2. Receive item from courier
3. Verify item condition
4. Courier completes delivery

💡 Track your delivery in real-time via the app
      `.trim();

    case 'priority':
      return `
⚡ Priority Pickup Instructions
━━━━━━━━━━━━━━━━━━━━━━
Item: ${deliveryDetails.itemTitle}

📍 Pickup Location: ${deliveryDetails.pickupAddress}
👤 Lender: ${deliveryDetails.lenderName}
👤 Borrower: ${deliveryDetails.borrowerName}

For Borrower:
1. Go directly to lender's location
2. Call/message lender upon arrival
3. Collect the item
4. Scan handoff QR code to confirm

Priority Pickup Benefits:
✓ Immediate access to item
✓ No waiting for meeting coordination
✓ Faster transaction completion

💰 Priority fee (₹20) includes:
• Lender's convenience
• Immediate availability
• Fast-track processing
      `.trim();

    default:
      return 'Delivery instructions not available';
  }
};

/**
 * Calculate courier earnings after platform cut
 */
export const calculateCourierEarnings = (deliveryFee: number): {
  courierEarning: number;
  platformShare: number;
  total: number;
} => {
  const platformCutPercentage = 0.2; // 20% platform fee
  const platformShare = deliveryFee * platformCutPercentage;
  const courierEarning = deliveryFee - platformShare;

  return {
    courierEarning: Math.round(courierEarning * 100) / 100,
    platformShare: Math.round(platformShare * 100) / 100,
    total: deliveryFee,
  };
};

/**
 * Get courier performance metrics
 */
export const getCourierPerformanceMetrics = (courier: BuddyCourier): {
  rating: string;
  reliability: string;
  experience: string;
  badge: string;
} => {
  const rating =
    courier.rating >= 4.5
      ? 'Excellent'
      : courier.rating >= 4.0
      ? 'Good'
      : courier.rating >= 3.5
      ? 'Average'
      : 'Below Average';

  const reliability =
    courier.totalDeliveries >= 50
      ? 'Highly Reliable'
      : courier.totalDeliveries >= 20
      ? 'Reliable'
      : 'New Courier';

  const experience =
    courier.totalDeliveries >= 100
      ? 'Expert'
      : courier.totalDeliveries >= 50
      ? 'Experienced'
      : courier.totalDeliveries >= 10
      ? 'Intermediate'
      : 'Beginner';

  let badge = '';
  if (courier.rating >= 4.8 && courier.totalDeliveries >= 50) {
    badge = '⭐ Elite Courier';
  } else if (courier.rating >= 4.5) {
    badge = '✓ Verified';
  }

  return { rating, reliability, experience, badge };
};

/**
 * Estimate priority delivery earnings for lender
 */
export const estimatePriorityDeliveryValue = (): {
  lenderReceives: number;
  platformFee: number;
  totalFee: number;
  benefits: string[];
} => {
  const totalFee = 20;
  const platformFee = 15; // Platform takes ₹15
  const lenderReceives = 5; // Lender gets ₹5 for convenience

  return {
    lenderReceives,
    platformFee,
    totalFee,
    benefits: [
      'No travel required',
      'Borrower comes to you',
      'Immediate transaction',
      'Extra ₹5 compensation',
    ],
  };
};
