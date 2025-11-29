/**
 * Smart Return Risk Score System - Unique Twist!
 * Predicts likelihood of on-time return based on multiple factors
 */

export interface RiskFactors {
  userTrustScore: number;
  userReturnHistory: {
    totalBorrows: number;
    onTimeReturns: number;
    lateReturns: number;
    disputes: number;
  };
  itemValue: number;
  borrowDuration: number;
  hasCollateral: boolean;
  userAccountAge: number; // days since account creation
  timeOfDay: number; // hour of day (0-23)
  dayOfWeek: number; // 0 = Sunday, 6 = Saturday
}

export interface RiskAssessment {
  score: number; // 0-100, lower is better
  level: 'low' | 'medium' | 'high' | 'very-high';
  factors: {
    name: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
  recommendations: string[];
  shouldRequireCollateral: boolean;
  suggestedSecurityDeposit?: number;
}

/**
 * Calculate comprehensive return risk score
 */
export const calculateReturnRiskScore = (factors: RiskFactors): RiskAssessment => {
  let score = 50; // Start at neutral
  const impactFactors: RiskAssessment['factors'] = [];
  const recommendations: string[] = [];

  // 1. User Trust Score (Most Important - 40% weight)
  const trustScoreImpact = (factors.userTrustScore - 50) * 0.4;
  score -= trustScoreImpact;

  if (factors.userTrustScore >= 80) {
    impactFactors.push({
      name: 'Excellent Trust Score',
      impact: 'positive',
      description: `User has high trust score of ${factors.userTrustScore}/100`,
    });
  } else if (factors.userTrustScore < 50) {
    impactFactors.push({
      name: 'Low Trust Score',
      impact: 'negative',
      description: `User trust score is ${factors.userTrustScore}/100`,
    });
    recommendations.push('Consider requiring collateral for this transaction');
  }

  // 2. Return History (30% weight)
  const { totalBorrows, onTimeReturns, lateReturns, disputes } = factors.userReturnHistory;
  
  if (totalBorrows > 0) {
    const onTimeRate = onTimeReturns / totalBorrows;
    const historyImpact = (onTimeRate - 0.7) * 30;
    score -= historyImpact;

    if (onTimeRate >= 0.9) {
      impactFactors.push({
        name: 'Excellent Return History',
        impact: 'positive',
        description: `${Math.round(onTimeRate * 100)}% on-time return rate`,
      });
    } else if (onTimeRate < 0.6) {
      impactFactors.push({
        name: 'Poor Return History',
        impact: 'negative',
        description: `Only ${Math.round(onTimeRate * 100)}% on-time returns`,
      });
      recommendations.push('User has history of late returns');
    }

    if (disputes > 0) {
      score += disputes * 5;
      impactFactors.push({
        name: 'Past Disputes',
        impact: 'negative',
        description: `${disputes} dispute(s) on record`,
      });
    }
  } else {
    score += 10; // New users get slight penalty
    impactFactors.push({
      name: 'New User',
      impact: 'negative',
      description: 'No borrowing history yet',
    });
    recommendations.push('Consider shorter initial loan period');
  }

  // 3. Item Value (15% weight)
  if (factors.itemValue > 1000) {
    score += 10;
    impactFactors.push({
      name: 'High-Value Item',
      impact: 'negative',
      description: `Item valued at ₹${factors.itemValue}`,
    });
    recommendations.push('Recommend collateral for high-value item');
  } else if (factors.itemValue < 200) {
    score -= 5;
    impactFactors.push({
      name: 'Low-Value Item',
      impact: 'positive',
      description: `Lower-risk item (₹${factors.itemValue})`,
    });
  }

  // 4. Borrow Duration (10% weight)
  if (factors.borrowDuration > 168) {
    // > 7 days
    score += 8;
    impactFactors.push({
      name: 'Long Borrow Period',
      impact: 'negative',
      description: `${Math.round(factors.borrowDuration / 24)} days duration`,
    });
  } else if (factors.borrowDuration <= 24) {
    // <= 1 day
    score -= 5;
    impactFactors.push({
      name: 'Short Borrow Period',
      impact: 'positive',
      description: 'Quick return expected',
    });
  }

  // 5. Collateral Status (5% weight)
  if (factors.hasCollateral) {
    score -= 10;
    impactFactors.push({
      name: 'Collateral Provided',
      impact: 'positive',
      description: 'Security deposit reduces risk',
    });
  }

  // 6. Account Age (5% weight)
  if (factors.userAccountAge < 7) {
    score += 5;
    impactFactors.push({
      name: 'Very New Account',
      impact: 'negative',
      description: `Account created ${factors.userAccountAge} days ago`,
    });
  } else if (factors.userAccountAge > 90) {
    score -= 3;
    impactFactors.push({
      name: 'Established Account',
      impact: 'positive',
      description: 'Long-standing account',
    });
  }

  // 7. Time-Based Patterns (5% weight)
  // Late night borrowing (11 PM - 5 AM) slightly increases risk
  if (factors.timeOfDay >= 23 || factors.timeOfDay <= 5) {
    score += 3;
    impactFactors.push({
      name: 'Late Night Transaction',
      impact: 'neutral',
      description: 'Unusual transaction time',
    });
  }

  // Weekend borrowing
  if (factors.dayOfWeek === 0 || factors.dayOfWeek === 6) {
    score += 2;
  }

  // Normalize score to 0-100 range
  score = Math.max(0, Math.min(100, score));

  // Determine risk level
  let level: RiskAssessment['level'];
  if (score < 25) level = 'low';
  else if (score < 50) level = 'medium';
  else if (score < 75) level = 'high';
  else level = 'very-high';

  // Determine collateral requirement
  const shouldRequireCollateral =
    score > 60 || factors.itemValue > 1000 || factors.userTrustScore < 40;

  // Calculate suggested security deposit
  let suggestedSecurityDeposit: number | undefined;
  if (shouldRequireCollateral) {
    if (factors.itemValue > 2000) {
      suggestedSecurityDeposit = factors.itemValue * 0.5; // 50% for very high value
    } else if (factors.itemValue > 1000) {
      suggestedSecurityDeposit = factors.itemValue * 0.3; // 30%
    } else {
      suggestedSecurityDeposit = factors.itemValue * 0.2; // 20%
    }
  }

  // Add level-specific recommendations
  if (level === 'high' || level === 'very-high') {
    recommendations.push('Enable auto-reminders 24 hours before due date');
    recommendations.push('Consider video/photo verification of item condition');
  }

  if (level === 'very-high') {
    recommendations.push('⚠️ High risk - strongly recommend collateral');
    recommendations.push('Limit loan duration to maximum 3 days');
  }

  return {
    score: Math.round(score),
    level,
    factors: impactFactors,
    recommendations,
    shouldRequireCollateral,
    suggestedSecurityDeposit,
  };
};

/**
 * Get risk score color for UI display
 */
export const getRiskScoreColor = (score: number): string => {
  if (score < 25) return '#10b981'; // Green
  if (score < 50) return '#f59e0b'; // Amber
  if (score < 75) return '#ef4444'; // Red
  return '#dc2626'; // Dark Red
};

/**
 * Get risk level badge
 */
export const getRiskLevelBadge = (level: RiskAssessment['level']): {
  label: string;
  color: string;
  icon: string;
} => {
  switch (level) {
    case 'low':
      return { label: 'Low Risk', color: '#10b981', icon: '✓' };
    case 'medium':
      return { label: 'Medium Risk', color: '#f59e0b', icon: '⚠' };
    case 'high':
      return { label: 'High Risk', color: '#ef4444', icon: '⚠⚠' };
    case 'very-high':
      return { label: 'Very High Risk', color: '#dc2626', icon: '🚨' };
  }
};

/**
 * Calculate optimal reminder schedule based on risk
 */
export const calculateReminderSchedule = (
  expectedReturnTime: Date,
  riskScore: number
): Date[] => {
  const reminders: Date[] = [];
  const returnTime = new Date(expectedReturnTime);

  if (riskScore < 25) {
    // Low risk: Just one reminder
    reminders.push(new Date(returnTime.getTime() - 4 * 60 * 60 * 1000)); // 4 hours before
  } else if (riskScore < 50) {
    // Medium risk: Two reminders
    reminders.push(new Date(returnTime.getTime() - 24 * 60 * 60 * 1000)); // 24 hours
    reminders.push(new Date(returnTime.getTime() - 2 * 60 * 60 * 1000)); // 2 hours
  } else if (riskScore < 75) {
    // High risk: Three reminders
    reminders.push(new Date(returnTime.getTime() - 48 * 60 * 60 * 1000)); // 48 hours
    reminders.push(new Date(returnTime.getTime() - 12 * 60 * 60 * 1000)); // 12 hours
    reminders.push(new Date(returnTime.getTime() - 1 * 60 * 60 * 1000)); // 1 hour
  } else {
    // Very high risk: Four reminders
    reminders.push(new Date(returnTime.getTime() - 72 * 60 * 60 * 1000)); // 72 hours
    reminders.push(new Date(returnTime.getTime() - 24 * 60 * 60 * 1000)); // 24 hours
    reminders.push(new Date(returnTime.getTime() - 6 * 60 * 60 * 1000)); // 6 hours
    reminders.push(new Date(returnTime.getTime() - 30 * 60 * 1000)); // 30 minutes
  }

  return reminders.filter((reminder) => reminder > new Date()); // Only future reminders
};

/**
 * Generate risk assessment report
 */
export const generateRiskReport = (assessment: RiskAssessment): string => {
  const badge = getRiskLevelBadge(assessment.level);

  let report = `
🔍 Return Risk Assessment
━━━━━━━━━━━━━━━━━━━━━━
${badge.icon} Risk Level: ${badge.label}
📊 Risk Score: ${assessment.score}/100

`;

  if (assessment.factors.length > 0) {
    report += `\n📋 Key Factors:\n`;
    assessment.factors.forEach((factor) => {
      const emoji = factor.impact === 'positive' ? '✓' : factor.impact === 'negative' ? '✗' : '•';
      report += `${emoji} ${factor.name}: ${factor.description}\n`;
    });
  }

  if (assessment.recommendations.length > 0) {
    report += `\n💡 Recommendations:\n`;
    assessment.recommendations.forEach((rec, index) => {
      report += `${index + 1}. ${rec}\n`;
    });
  }

  if (assessment.shouldRequireCollateral && assessment.suggestedSecurityDeposit) {
    report += `\n💰 Suggested Security Deposit: ₹${assessment.suggestedSecurityDeposit.toFixed(2)}\n`;
  }

  return report.trim();
};

/**
 * Update user trust score based on transaction outcome
 */
export const calculateTrustScoreUpdate = (
  currentScore: number,
  outcome: 'on-time' | 'late' | 'very-late' | 'disputed'
): number => {
  let change = 0;

  switch (outcome) {
    case 'on-time':
      change = 2; // +2 for on-time return
      break;
    case 'late':
      change = -5; // -5 for late return (within 24 hours)
      break;
    case 'very-late':
      change = -15; // -15 for very late return (>24 hours)
      break;
    case 'disputed':
      change = -20; // -20 for disputed transaction
      break;
  }

  const newScore = currentScore + change;
  return Math.max(0, Math.min(100, newScore)); // Keep within 0-100
};
