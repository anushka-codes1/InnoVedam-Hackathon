/**
 * Campus Fair Price Model
 * Prevents price exploitation with intelligent bounds and suggestions
 */

export interface ItemCategory {
  name: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  pricePerHour: number;
  pricePerDay: number;
}

/**
 * Pre-configured price ranges for common campus items
 */
export const ITEM_CATEGORIES: Record<string, ItemCategory> = {
  textbook: {
    name: 'Textbook',
    basePrice: 20,
    minPrice: 10,
    maxPrice: 50,
    pricePerHour: 5,
    pricePerDay: 20,
  },
  laptop: {
    name: 'Laptop',
    basePrice: 100,
    minPrice: 50,
    maxPrice: 300,
    pricePerHour: 25,
    pricePerDay: 100,
  },
  calculator: {
    name: 'Calculator',
    basePrice: 10,
    minPrice: 5,
    maxPrice: 30,
    pricePerHour: 3,
    pricePerDay: 10,
  },
  bicycle: {
    name: 'Bicycle',
    basePrice: 30,
    minPrice: 15,
    maxPrice: 80,
    pricePerHour: 10,
    pricePerDay: 30,
  },
  camera: {
    name: 'Camera',
    basePrice: 80,
    minPrice: 40,
    maxPrice: 250,
    pricePerHour: 20,
    pricePerDay: 80,
  },
  sports_equipment: {
    name: 'Sports Equipment',
    basePrice: 15,
    minPrice: 8,
    maxPrice: 50,
    pricePerHour: 5,
    pricePerDay: 15,
  },
  musical_instrument: {
    name: 'Musical Instrument',
    basePrice: 40,
    minPrice: 20,
    maxPrice: 120,
    pricePerHour: 12,
    pricePerDay: 40,
  },
  gaming_console: {
    name: 'Gaming Console',
    basePrice: 60,
    minPrice: 30,
    maxPrice: 180,
    pricePerHour: 18,
    pricePerDay: 60,
  },
  drone: {
    name: 'Drone',
    basePrice: 90,
    minPrice: 45,
    maxPrice: 270,
    pricePerHour: 22,
    pricePerDay: 90,
  },
  projector: {
    name: 'Projector',
    basePrice: 70,
    minPrice: 35,
    maxPrice: 200,
    pricePerHour: 20,
    pricePerDay: 70,
  },
  other: {
    name: 'Other',
    basePrice: 20,
    minPrice: 10,
    maxPrice: 100,
    pricePerHour: 5,
    pricePerDay: 20,
  },
};

export interface PriceSuggestion {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  basePrice: number;
  breakdown: {
    baseCost: number;
    durationCost: number;
    conditionAdjustment: number;
    demandAdjustment: number;
  };
  explanation: string;
}

/**
 * Auto-suggest fair price based on item category, duration, and condition
 */
export const autoSuggestPrice = (
  category: string,
  durationHours: number,
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor' = 'good',
  demandLevel: 'low' | 'medium' | 'high' = 'medium'
): PriceSuggestion => {
  const categoryData = ITEM_CATEGORIES[category] || ITEM_CATEGORIES.other;

  // Calculate base duration cost
  const durationDays = durationHours / 24;
  let durationCost: number;

  if (durationHours <= 24) {
    // Hourly rate for short durations
    durationCost = categoryData.pricePerHour * durationHours;
  } else {
    // Daily rate for longer durations with discount
    const fullDays = Math.floor(durationDays);
    const remainingHours = durationHours % 24;
    durationCost = 
      fullDays * categoryData.pricePerDay +
      remainingHours * categoryData.pricePerHour;

    // Apply discount for longer rentals
    if (fullDays >= 7) {
      durationCost *= 0.85; // 15% discount for weekly+
    } else if (fullDays >= 3) {
      durationCost *= 0.90; // 10% discount for 3+ days
    }
  }

  // Condition adjustment
  const conditionMultipliers = {
    new: 1.2,
    excellent: 1.1,
    good: 1.0,
    fair: 0.85,
    poor: 0.7,
  };
  const conditionAdjustment = durationCost * (conditionMultipliers[condition] - 1);

  // Demand adjustment
  const demandMultipliers = {
    low: 0.9,
    medium: 1.0,
    high: 1.15,
  };
  const demandAdjustment = durationCost * (demandMultipliers[demandLevel] - 1);

  // Calculate suggested price
  const baseCost = categoryData.basePrice;
  let suggestedPrice = baseCost + durationCost + conditionAdjustment + demandAdjustment;

  // Apply bounds
  suggestedPrice = Math.max(categoryData.minPrice, Math.min(categoryData.maxPrice, suggestedPrice));
  suggestedPrice = Math.round(suggestedPrice);

  // Generate explanation
  let explanation = `Based on ${categoryData.name} category, `;
  explanation += `${durationHours}h duration (₹${durationCost.toFixed(0)} duration cost), `;
  explanation += `${condition} condition `;
  
  if (conditionAdjustment > 0) {
    explanation += `(+₹${Math.abs(conditionAdjustment).toFixed(0)})`;
  } else if (conditionAdjustment < 0) {
    explanation += `(-₹${Math.abs(conditionAdjustment).toFixed(0)})`;
  }

  if (demandLevel === 'high') {
    explanation += `, and high demand (+₹${demandAdjustment.toFixed(0)})`;
  } else if (demandLevel === 'low') {
    explanation += `, and low demand (-₹${Math.abs(demandAdjustment).toFixed(0)})`;
  }

  return {
    suggestedPrice,
    minPrice: categoryData.minPrice,
    maxPrice: categoryData.maxPrice,
    basePrice: categoryData.basePrice,
    breakdown: {
      baseCost,
      durationCost,
      conditionAdjustment,
      demandAdjustment,
    },
    explanation,
  };
};

/**
 * Validate if price is within fair bounds
 */
export const validatePrice = (
  price: number,
  category: string
): { valid: boolean; message?: string } => {
  const categoryData = ITEM_CATEGORIES[category] || ITEM_CATEGORIES.other;

  if (price < categoryData.minPrice) {
    return {
      valid: false,
      message: `Price is too low. Minimum price for ${categoryData.name} is ₹${categoryData.minPrice}`,
    };
  }

  if (price > categoryData.maxPrice) {
    return {
      valid: false,
      message: `Price is too high. Maximum price for ${categoryData.name} is ₹${categoryData.maxPrice}`,
    };
  }

  return { valid: true };
};

/**
 * Check if price seems exploitative compared to suggested price
 */
export const checkPriceAbuse = (
  actualPrice: number,
  suggestedPrice: number,
  category: string
): {
  isAbusive: boolean;
  severity: 'none' | 'minor' | 'moderate' | 'severe';
  message?: string;
} => {
  const difference = actualPrice - suggestedPrice;
  const percentageDiff = (difference / suggestedPrice) * 100;

  if (percentageDiff <= 20) {
    return { isAbusive: false, severity: 'none' };
  }

  if (percentageDiff <= 40) {
    return {
      isAbusive: true,
      severity: 'minor',
      message: `Price is ${percentageDiff.toFixed(0)}% higher than suggested (₹${suggestedPrice})`,
    };
  }

  if (percentageDiff <= 70) {
    return {
      isAbusive: true,
      severity: 'moderate',
      message: `Price is ${percentageDiff.toFixed(0)}% higher than fair price (₹${suggestedPrice}). Consider reporting.`,
    };
  }

  return {
    isAbusive: true,
    severity: 'severe',
    message: `⚠️ Price is ${percentageDiff.toFixed(0)}% higher than fair price (₹${suggestedPrice}). This may be price exploitation.`,
  };
};

/**
 * Get price comparison with market average
 */
export const getPriceComparison = (
  price: number,
  category: string
): {
  status: 'great-deal' | 'fair' | 'expensive' | 'overpriced';
  message: string;
  emoji: string;
} => {
  const categoryData = ITEM_CATEGORIES[category] || ITEM_CATEGORIES.other;
  const avgPrice = (categoryData.minPrice + categoryData.maxPrice) / 2;
  const percentOfAvg = (price / avgPrice) * 100;

  if (percentOfAvg < 75) {
    return {
      status: 'great-deal',
      message: 'Great deal! Below average market price',
      emoji: '🎉',
    };
  }

  if (percentOfAvg <= 110) {
    return {
      status: 'fair',
      message: 'Fair price, within normal range',
      emoji: '✓',
    };
  }

  if (percentOfAvg <= 140) {
    return {
      status: 'expensive',
      message: 'Above average price',
      emoji: '⚠️',
    };
  }

  return {
    status: 'overpriced',
    message: 'Significantly overpriced',
    emoji: '🚨',
  };
};

/**
 * Calculate dynamic pricing based on time and demand
 */
export const calculateDynamicPrice = (
  basePrice: number,
  timeOfDay: number,
  dayOfWeek: number,
  currentDemand: number = 0 // number of active listings in same category
): number => {
  let multiplier = 1.0;

  // Peak hours (12-2 PM, 5-7 PM) - slight increase
  if ((timeOfDay >= 12 && timeOfDay <= 14) || (timeOfDay >= 17 && timeOfDay <= 19)) {
    multiplier *= 1.05;
  }

  // Weekend premium
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    multiplier *= 1.08;
  }

  // High demand adjustment
  if (currentDemand > 10) {
    multiplier *= 1.10;
  } else if (currentDemand < 3) {
    multiplier *= 0.95;
  }

  return Math.round(basePrice * multiplier);
};

/**
 * Generate pricing recommendation display
 */
export const generatePricingDisplay = (suggestion: PriceSuggestion): string => {
  return `
💰 Smart Price Suggestion
━━━━━━━━━━━━━━━━━━━━━━
Suggested Price: ₹${suggestion.suggestedPrice}
Price Range: ₹${suggestion.minPrice} - ₹${suggestion.maxPrice}

📊 Breakdown:
• Base Cost: ₹${suggestion.breakdown.baseCost}
• Duration: ₹${suggestion.breakdown.durationCost.toFixed(0)}
${suggestion.breakdown.conditionAdjustment !== 0 ? `• Condition: ${suggestion.breakdown.conditionAdjustment > 0 ? '+' : ''}₹${suggestion.breakdown.conditionAdjustment.toFixed(0)}\n` : ''}${suggestion.breakdown.demandAdjustment !== 0 ? `• Demand: ${suggestion.breakdown.demandAdjustment > 0 ? '+' : ''}₹${suggestion.breakdown.demandAdjustment.toFixed(0)}\n` : ''}
💡 ${suggestion.explanation}
  `.trim();
};

/**
 * Get all available categories for selection
 */
export const getAvailableCategories = (): string[] => {
  return Object.keys(ITEM_CATEGORIES);
};

/**
 * Get category display name
 */
export const getCategoryDisplayName = (category: string): string => {
  return ITEM_CATEGORIES[category]?.name || category;
};

/**
 * Calculate late return penalty
 */
export const calculateLatePenalty = (
  agreedPrice: number,
  hoursLate: number
): number => {
  // 10% of agreed price per day late, capped at 200% of original price
  const penaltyPerDay = agreedPrice * 0.10;
  const daysLate = Math.ceil(hoursLate / 24);
  const penalty = penaltyPerDay * daysLate;
  
  return Math.min(penalty, agreedPrice * 2);
};
