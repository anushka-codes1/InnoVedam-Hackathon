/**
 * Smart Meeting-Point Automation System
 * Simplifies delivery coordination on campus
 */

export interface MeetingPoint {
  id: string;
  name: string;
  description: string;
  campus_building: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  is_popular: boolean;
  usage_count: number;
}

export interface UserLocation {
  lat: number;
  lng: number;
  building?: string;
}

/**
 * Popular campus meeting points (pre-configured)
 */
export const POPULAR_MEETING_POINTS: MeetingPoint[] = [
  {
    id: '1',
    name: 'Main Library Entrance',
    description: 'Outside main library, near benches',
    campus_building: 'Library Block',
    coordinates: { lat: 77.5946, lng: 12.9716 },
    is_popular: true,
    usage_count: 150,
  },
  {
    id: '2',
    name: 'Student Cafeteria',
    description: 'Inside cafeteria, near counter',
    campus_building: 'Student Center',
    coordinates: { lat: 77.5950, lng: 12.9720 },
    is_popular: true,
    usage_count: 200,
  },
  {
    id: '3',
    name: 'Academic Block A - Ground Floor',
    description: 'Near water cooler',
    campus_building: 'Block A',
    coordinates: { lat: 77.5948, lng: 12.9718 },
    is_popular: true,
    usage_count: 120,
  },
  {
    id: '4',
    name: 'Sports Complex',
    description: 'Main entrance gate',
    campus_building: 'Sports Block',
    coordinates: { lat: 77.5952, lng: 12.9714 },
    is_popular: false,
    usage_count: 45,
  },
  {
    id: '5',
    name: 'Hostel Common Room',
    description: 'Boys hostel common area',
    campus_building: 'Hostel Block',
    coordinates: { lat: 77.5944, lng: 12.9722 },
    is_popular: false,
    usage_count: 80,
  },
];

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export const calculateDistance = (
  point1: { lat: number; lng: number },
  point2: { lat: number; lng: number }
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
      Math.cos(toRad(point2.lat)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance; // Returns distance in kilometers
};

const toRad = (value: number): number => {
  return (value * Math.PI) / 180;
};

/**
 * Find the optimal meeting point between borrower and lender
 */
export const findOptimalMeetingPoint = (
  borrowerLocation: UserLocation,
  lenderLocation: UserLocation,
  meetingPoints: MeetingPoint[] = POPULAR_MEETING_POINTS
): MeetingPoint => {
  let optimalPoint = meetingPoints[0];
  let minTotalDistance = Infinity;

  meetingPoints.forEach((point) => {
    const distanceToBorrower = calculateDistance(borrowerLocation, point.coordinates);
    const distanceToLender = calculateDistance(lenderLocation, point.coordinates);
    const totalDistance = distanceToBorrower + distanceToLender;

    // Factor in popularity (popular points get a slight boost)
    const adjustedDistance = point.is_popular ? totalDistance * 0.9 : totalDistance;

    if (adjustedDistance < minTotalDistance) {
      minTotalDistance = adjustedDistance;
      optimalPoint = point;
    }
  });

  return optimalPoint;
};

/**
 * Get meeting points sorted by proximity to user
 */
export const getNearbyMeetingPoints = (
  userLocation: UserLocation,
  meetingPoints: MeetingPoint[] = POPULAR_MEETING_POINTS,
  maxDistance: number = 2.0 // Default: 2km radius
): MeetingPoint[] => {
  return meetingPoints
    .map((point) => ({
      ...point,
      distance: calculateDistance(userLocation, point.coordinates),
    }))
    .filter((point) => point.distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance);
};

/**
 * Suggest meeting time based on both users' schedules
 */
export interface TimeSlot {
  time: string;
  label: string;
  isPopular: boolean;
}

export const suggestMeetingTimes = (
  borrowStartTime: Date
): TimeSlot[] => {
  const now = new Date();
  const suggestedTimes: TimeSlot[] = [];

  // Suggest times within the next 4 hours
  for (let i = 0; i < 4; i++) {
    const time = new Date(now.getTime() + (i + 1) * 30 * 60000); // Every 30 mins
    if (time < borrowStartTime) {
      const hour = time.getHours();
      const isPopular =
        (hour >= 12 && hour <= 13) || // Lunch time
        (hour >= 17 && hour <= 18); // Evening

      suggestedTimes.push({
        time: time.toISOString(),
        label: time.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isPopular,
      });
    }
  }

  return suggestedTimes;
};

/**
 * Generate meeting instructions
 */
export const generateMeetingInstructions = (
  meetingPoint: MeetingPoint,
  meetingTime: string,
  itemTitle: string,
  lenderName: string,
  borrowerName: string
): string => {
  const time = new Date(meetingTime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `
📍 Meeting Point: ${meetingPoint.name}
🏢 Location: ${meetingPoint.campus_building}
📝 Details: ${meetingPoint.description}
⏰ Time: ${time}

📦 Item: ${itemTitle}
👤 Lender: ${lenderName}
👤 Borrower: ${borrowerName}

Instructions:
1. Arrive at the meeting point on time
2. Look for the other person
3. Scan the handoff QR code to verify the exchange
4. Complete the transaction

Pro Tip: ${meetingPoint.is_popular ? 'This is a popular meeting spot - easy to find!' : 'Look for the landmarks mentioned in the description.'}
  `.trim();
};

/**
 * Get meeting point by building name
 */
export const getMeetingPointsByBuilding = (
  building: string,
  meetingPoints: MeetingPoint[] = POPULAR_MEETING_POINTS
): MeetingPoint[] => {
  return meetingPoints.filter(
    (point) =>
      point.campus_building.toLowerCase().includes(building.toLowerCase())
  );
};

/**
 * Calculate estimated walk time between two points
 */
export const calculateWalkTime = (distanceKm: number): number => {
  const averageWalkingSpeed = 5; // km/h
  const timeInHours = distanceKm / averageWalkingSpeed;
  const timeInMinutes = Math.ceil(timeInHours * 60);
  return timeInMinutes;
};

/**
 * Get meeting point details with distance and walk time
 */
export const getMeetingPointDetails = (
  meetingPoint: MeetingPoint,
  userLocation: UserLocation
) => {
  const distance = calculateDistance(userLocation, meetingPoint.coordinates);
  const walkTime = calculateWalkTime(distance);

  return {
    ...meetingPoint,
    distance: distance.toFixed(2),
    walkTime,
    distanceLabel: `${(distance * 1000).toFixed(0)}m away`,
    walkTimeLabel: `${walkTime} min walk`,
  };
};

/**
 * Suggest best meeting point with reasoning
 */
export interface MeetingPointSuggestion {
  meetingPoint: MeetingPoint;
  reason: string;
  distance: number;
  walkTime: number;
  score: number;
}

export const suggestBestMeetingPoint = (
  borrowerLocation: UserLocation,
  lenderLocation: UserLocation,
  meetingPoints: MeetingPoint[] = POPULAR_MEETING_POINTS
): MeetingPointSuggestion => {
  const suggestions = meetingPoints.map((point) => {
    const distanceToBorrower = calculateDistance(borrowerLocation, point.coordinates);
    const distanceToLender = calculateDistance(lenderLocation, point.coordinates);
    const totalDistance = distanceToBorrower + distanceToLender;
    const avgDistance = totalDistance / 2;
    const walkTime = calculateWalkTime(avgDistance);

    // Calculate score (lower is better)
    let score = totalDistance;
    if (point.is_popular) score *= 0.8; // 20% bonus for popular spots
    if (point.usage_count > 100) score *= 0.9; // 10% bonus for frequently used

    let reason = '';
    if (point.is_popular && totalDistance < 1.0) {
      reason = 'Popular spot and very close to both of you';
    } else if (point.is_popular) {
      reason = 'Well-known location, easy to find';
    } else if (totalDistance < 0.5) {
      reason = 'Closest option for both parties';
    } else {
      reason = 'Good middle-ground location';
    }

    return {
      meetingPoint: point,
      reason,
      distance: avgDistance,
      walkTime,
      score,
    };
  });

  // Return the best suggestion (lowest score)
  return suggestions.sort((a, b) => a.score - b.score)[0];
};

/**
 * Format meeting point for display
 */
export const formatMeetingPointDisplay = (
  meetingPoint: MeetingPoint,
  userLocation?: UserLocation
): string => {
  let display = `${meetingPoint.name} (${meetingPoint.campus_building})`;

  if (userLocation) {
    const details = getMeetingPointDetails(meetingPoint, userLocation);
    display += ` - ${details.distanceLabel}, ${details.walkTimeLabel}`;
  }

  if (meetingPoint.is_popular) {
    display += ' ⭐';
  }

  return display;
};
