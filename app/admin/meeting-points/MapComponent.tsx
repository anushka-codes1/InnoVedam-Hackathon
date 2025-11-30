'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet in Next.js
if (typeof window !== 'undefined') {
  const L = require('leaflet');
  
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

interface MeetingPoint {
  id: number;
  name: string;
  description: string | null;
  campus_building: string;
  usage_count: number;
  is_popular: boolean;
  latitude: number;
  longitude: number;
}

interface MapProps {
  center: [number, number];
  meetingPoints: MeetingPoint[];
}

export default function MapComponent({ center, meetingPoints }: MapProps) {
  // Get color based on usage count (heatmap intensity)
  const getHeatmapColor = (usageCount: number): string => {
    if (meetingPoints.length === 0) return '#10B981';
    
    const maxUsage = Math.max(...meetingPoints.map(p => p.usage_count));
    const intensity = usageCount / maxUsage;
    
    if (intensity >= 0.8) return '#EF4444'; // Red - Very High
    if (intensity >= 0.6) return '#F97316'; // Orange - High
    if (intensity >= 0.4) return '#FBBF24'; // Yellow - Medium
    if (intensity >= 0.2) return '#84CC16'; // Lime - Low
    return '#10B981'; // Green - Very Low
  };

  // Get radius based on usage count
  const getCircleRadius = (usageCount: number): number => {
    if (meetingPoints.length === 0) return 100;
    
    const maxUsage = Math.max(...meetingPoints.map(p => p.usage_count));
    const intensity = usageCount / maxUsage;
    return 150 + (intensity * 400); // 150-550 meters
  };

  return (
    <MapContainer
      center={center}
      zoom={16}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render meeting points with heatmap styling */}
      {meetingPoints.map((point) => (
        <React.Fragment key={point.id}>
          {/* Meeting Point Circle */}
          <Circle
            center={[point.latitude, point.longitude]}
            radius={getCircleRadius(point.usage_count)}
            pathOptions={{
              color: getHeatmapColor(point.usage_count),
              fillColor: getHeatmapColor(point.usage_count),
              fillOpacity: 0.5,
              weight: 3
            }}
          >
            <Popup>
              <div className="p-3 min-w-[250px]">
                <div className="flex items-start gap-2 mb-3">
                  <h3 className="font-bold text-lg text-purple-600 flex-1">{point.name}</h3>
                  {point.is_popular && (
                    <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                      ⭐ Popular
                    </span>
                  )}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Building:</span>
                    <span className="text-gray-600">{point.campus_building}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-700">Usage Count:</span>
                    <span 
                      className="px-2 py-1 rounded-full text-white text-xs font-bold"
                      style={{ backgroundColor: getHeatmapColor(point.usage_count) }}
                    >
                      {point.usage_count} meetings
                    </span>
                  </div>
                  
                  {point.description && (
                    <div className="pt-2 border-t border-gray-200">
                      <span className="font-semibold text-gray-700 block mb-1">Description:</span>
                      <p className="text-gray-600 text-xs leading-relaxed">{point.description}</p>
                    </div>
                  )}
                  
                  <div className="pt-2 border-t border-gray-200 text-xs text-gray-500">
                    <div>Lat: {point.latitude.toFixed(6)}</div>
                    <div>Lng: {point.longitude.toFixed(6)}</div>
                  </div>
                </div>
              </div>
            </Popup>
          </Circle>
        </React.Fragment>
      ))}
    </MapContainer>
  );
}
