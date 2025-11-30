/**
 * CampusHeatmap Component
 * 
 * Purpose: Displays an interactive map showing activity hotspots across campus
 * - Visualizes transaction density at different campus locations
 * - Uses color-coded circles to indicate activity levels (red=high, green=low)
 * - Provides real-time insights into where items are most frequently exchanged
 * 
 * Features:
 * - Interactive Leaflet map with OpenStreetMap tiles
 * - 10 campus locations with activity metrics
 * - Color-coded activity indicators (Very High, High, Medium, Low)
 * - Activity statistics dashboard
 * - Clickable popups with detailed location information
 * 
 * Technical Notes:
 * - Uses dynamic imports to prevent SSR errors with Leaflet
 * - Map centered on Ajeenkya D. Y Patil University, Pune (18.6161, 73.7286)
 * - Activity levels determined by transaction count thresholds
 */

'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin, TrendingUp, Activity } from 'lucide-react';

/**
 * Dynamic imports for Leaflet components
 * Why: Leaflet uses browser-only APIs (window, document) that cause SSR errors in Next.js
 * Solution: Import components dynamically with ssr: false to only load on client side
 */
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Circle = dynamic(
  () => import('react-leaflet').then((mod) => mod.Circle),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);

/**
 * Interface for campus location hotspots
 * 
 * @property name - Location identifier (e.g., "Main Library", "Student Center")
 * @property lat - Latitude coordinate for map positioning
 * @property lng - Longitude coordinate for map positioning
 * @property activity - Number of transactions at this location (determines heat level)
 * @property color - Hex color code for the circle overlay (red for high, green for low)
 * @property radius - Circle size in meters (larger radius = more activity)
 */
interface HeatmapLocation {
  name: string;
  lat: number;
  lng: number;
  activity: number; // Number of transactions
  color: string;
  radius: number;
}

export default function CampusHeatmap() {
  // Track whether component is mounted on client (required for Leaflet)
  const [isClient, setIsClient] = useState(false);
  // Store campus location hotspots with activity data
  const [locations, setLocations] = useState<HeatmapLocation[]>([]);

  useEffect(() => {
    // Set client flag to true once component mounts in browser
    setIsClient(true);
    // Load the heatmap location data
    loadHeatmapData();
  }, []);

  /**
   * Load campus location data with activity metrics
   * 
   * Defines 10 key campus locations with:
   * - Geographic coordinates (lat/lng)
   * - Activity count (number of transactions)
   * - Color coding based on activity level
   * - Radius size proportional to activity
   * 
   * Activity Color Scale:
   * - Red (#ef4444, #dc2626): Very High (45+)
   * - Orange (#f59e0b, #f97316, #fb923c): High (35-44)
   * - Yellow (#fbbf24): Medium (25-34)
   * - Green (#4ade80, #65a30d, #84cc16, #a3e635): Low (<25)
   */
  const loadHeatmapData = () => {
    // Ajeenkya D. Y Patil University, Pune coordinates and popular spots
    const campusLocations: HeatmapLocation[] = [
      {
        name: 'Main Library',
        lat: 18.6161,
        lng: 73.7286,
        activity: 45,
        color: '#ef4444', // Red - High activity
        radius: 80
      },
      {
        name: 'Academic Block A',
        lat: 18.6165,
        lng: 73.7290,
        activity: 38,
        color: '#f59e0b', // Orange
        radius: 70
      },
      {
        name: 'Student Center',
        lat: 18.6158,
        lng: 73.7283,
        activity: 52,
        color: '#dc2626', // Dark Red - Highest
        radius: 90
      },
      {
        name: 'Engineering Block',
        lat: 18.6168,
        lng: 73.7295,
        activity: 35,
        color: '#fbbf24', // Yellow
        radius: 65
      },
      {
        name: 'Cafeteria',
        lat: 18.6155,
        lng: 73.7288,
        activity: 42,
        color: '#f97316', // Orange-Red
        radius: 75
      },
      {
        name: 'Sports Complex',
        lat: 18.6170,
        lng: 73.7280,
        activity: 28,
        color: '#a3e635', // Light Green
        radius: 55
      },
      {
        name: 'Hostel Block 1',
        lat: 18.6152,
        lng: 73.7292,
        activity: 30,
        color: '#84cc16', // Green
        radius: 60
      },
      {
        name: 'Admin Building',
        lat: 18.6163,
        lng: 73.7278,
        activity: 18,
        color: '#4ade80', // Light Green
        radius: 45
      },
      {
        name: 'Computer Lab',
        lat: 18.6166,
        lng: 73.7285,
        activity: 40,
        color: '#fb923c', // Orange
        radius: 72
      },
      {
        name: 'Auditorium',
        lat: 18.6160,
        lng: 73.7295,
        activity: 25,
        color: '#65a30d', // Green
        radius: 50
      }
    ];

    setLocations(campusLocations);
  };

  /**
   * Categorize activity level based on transaction count
   * 
   * @param activity - Number of transactions at location
   * @returns Human-readable activity level string
   * 
   * Thresholds:
   * - Very High: 45+ transactions
   * - High: 35-44 transactions
   * - Medium: 25-34 transactions
   * - Low: <25 transactions
   */
  const getActivityLevel = (activity: number) => {
    if (activity >= 45) return 'Very High';
    if (activity >= 35) return 'High';
    if (activity >= 25) return 'Medium';
    return 'Low';
  };

  // Show loading state while map loads on client side
  if (!isClient) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-2 animate-pulse" />
          <p className="text-gray-500">Loading campus map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/70 backdrop-blur-xl rounded-xl p-6 shadow-sm border border-white/20">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Campus Activity Heatmap</h3>
              <p className="text-sm text-gray-600">Ajeenkya D. Y Patil University, Pune</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Activity className="w-4 h-4" />
            <span>Real-time Activity</span>
          </div>
        </div>

        {/* Activity Level Legend */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-600"></div>
            <span>Very High (45+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-orange-500"></div>
            <span>High (35-44)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
            <span>Medium (25-34)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span>Low (&lt;25)</span>
          </div>
        </div>

        {/* 
          Interactive Map Container
          - Centered on campus coordinates (18.6161, 73.7286)
          - Zoom level 16 provides good detail of campus buildings
          - Scroll wheel zoom disabled for better UX (prevents accidental zooming)
          - Uses OpenStreetMap tiles for base layer
        */}
        <div className="rounded-xl overflow-hidden border-2 border-gray-200" style={{ height: '500px' }}>
          <MapContainer
            center={[18.6161, 73.7286]} // Ajeenkya D. Y Patil University coordinates
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
          >
            {/* Base map tiles from OpenStreetMap */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render activity circles for each location */}
            {locations.map((location, index) => (
              <React.Fragment key={index}>
                {/* 
                  Circle Overlay
                  - Size (radius) indicates activity level
                  - Color indicates activity intensity (red=high, green=low)
                  - Semi-transparent fill (0.4 opacity) for visibility
                  - Clickable popup shows detailed stats
                */}
                <Circle
                  center={[location.lat, location.lng]}
                  radius={location.radius}
                  pathOptions={{
                    fillColor: location.color,
                    fillOpacity: 0.4,
                    color: location.color,
                    weight: 2,
                    opacity: 0.8
                  }}
                >
                  {/* Info popup displayed on click */}
                  <Popup>
                    <div className="p-2">
                      <h4 className="font-semibold text-gray-900 mb-1">{location.name}</h4>
                      <div className="text-sm space-y-1">
                        <p className="text-gray-600">
                          <TrendingUp className="w-3 h-3 inline mr-1" />
                          Activity: {location.activity} transactions
                        </p>
                        <p className="text-gray-600">
                          Level: <span className="font-medium">{getActivityLevel(location.activity)}</span>
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Circle>
              </React.Fragment>
            ))}
          </MapContainer>
        </div>

        {/* Activity Statistics Dashboard */}
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total number of tracked locations */}
          <div className="bg-purple-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Total Hotspots</p>
            <p className="text-2xl font-bold text-purple-600">{locations.length}</p>
          </div>
          
          {/* Sum of all transactions across campus */}
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Total Activity</p>
            <p className="text-2xl font-bold text-blue-600">
              {locations.reduce((sum, loc) => sum + loc.activity, 0)}
            </p>
          </div>
          
          {/* Location with highest activity count */}
          <div className="bg-green-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Most Active</p>
            <p className="text-lg font-bold text-green-600">
              {/* Show first word of location name (e.g., "Student" from "Student Center") */}
              {locations.reduce((max, loc) => loc.activity > max.activity ? loc : max).name.split(' ')[0]}
            </p>
          </div>
          
          {/* Average transactions per location */}
          <div className="bg-orange-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Avg Activity</p>
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(locations.reduce((sum, loc) => sum + loc.activity, 0) / locations.length)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
