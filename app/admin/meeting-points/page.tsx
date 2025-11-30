'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { 
  MapPin, 
  Users, 
  TrendingUp, 
  Navigation,
  ArrowLeft,
  Filter,
  Calendar,
  Download,
  Building2,
  AlertCircle,
  Loader2
} from 'lucide-react';

// Supabase Meeting Point Interface
interface MeetingPoint {
  id: number;
  name: string;
  description: string | null;
  campus_building: string;
  coordinates: string; // PostGIS POINT format: "POINT(longitude latitude)"
  usage_count: number;
  is_popular: boolean;
  created_at?: string;
}

// Parsed coordinates for map rendering
interface ParsedMeetingPoint extends MeetingPoint {
  latitude: number;
  longitude: number;
}

interface MapProps {
  center: [number, number];
  meetingPoints: ParsedMeetingPoint[];
}

// Dynamically import the Map component (client-side only)
const MapComponent = dynamic<MapProps>(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
        <p className="text-gray-600">Loading interactive map...</p>
      </div>
    </div>
  )
});

interface Stats {
  totalPoints: number;
  totalUsage: number;
  popularPoints: number;
  averageUsage: number;
  mostPopularPoint: string;
}

export default function MeetingPointsHeatmap() {
  const [meetingPoints, setMeetingPoints] = useState<ParsedMeetingPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalPoints: 0,
    totalUsage: 0,
    popularPoints: 0,
    averageUsage: 0,
    mostPopularPoint: ''
  });
  const [mapCenter] = useState<[number, number]>([18.6186, 73.7527]); // Ajeenkya DY Patil University, Pune
  const [mapReady, setMapReady] = useState(false);

  // Parse PostGIS POINT format: "POINT(longitude latitude)"
  const parseCoordinates = (pointString: string): { longitude: number; latitude: number } | null => {
    try {
      const match = pointString.match(/POINT\(([^)]+)\)/);
      if (!match) return null;
      
      const [lng, lat] = match[1].split(' ').map(Number);
      return { longitude: lng, latitude: lat };
    } catch (err) {
      console.error('Error parsing coordinates:', err);
      return null;
    }
  };

  // Fetch meeting points from Supabase
  useEffect(() => {
    const fetchMeetingPoints = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if Supabase is configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (!supabaseUrl || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          // Use mock data if Supabase is not configured
          const mockData: MeetingPoint[] = [
            {
              id: 1,
              name: 'Central Library',
              description: 'Main campus library with study areas and meeting rooms',
              campus_building: 'Library Building',
              coordinates: 'POINT(73.7527 18.6186)',
              usage_count: 45,
              is_popular: true,
              created_at: '2025-11-20'
            },
            {
              id: 2,
              name: 'Campus Cafe',
              description: 'Popular hangout spot for students',
              campus_building: 'Student Center',
              coordinates: 'POINT(73.7545 18.6165)',
              usage_count: 32,
              is_popular: true,
              created_at: '2025-11-21'
            },
            {
              id: 3,
              name: 'Sports Complex Entrance',
              description: 'Main entrance to sports facilities',
              campus_building: 'Sports Complex',
              coordinates: 'POINT(73.7510 18.6205)',
              usage_count: 28,
              is_popular: false,
              created_at: '2025-11-22'
            },
            {
              id: 4,
              name: 'Main Gate',
              description: 'Primary campus entrance point',
              campus_building: 'Security Gate',
              coordinates: 'POINT(73.7540 18.6195)',
              usage_count: 52,
              is_popular: true,
              created_at: '2025-11-18'
            },
            {
              id: 5,
              name: 'Student Center Lobby',
              description: 'Central meeting area with seating',
              campus_building: 'Student Center',
              coordinates: 'POINT(73.7505 18.6175)',
              usage_count: 38,
              is_popular: true,
              created_at: '2025-11-19'
            },
            {
              id: 6,
              name: 'Engineering Block Courtyard',
              description: 'Open courtyard between engineering buildings',
              campus_building: 'Engineering Block A',
              coordinates: 'POINT(73.7550 18.6210)',
              usage_count: 41,
              is_popular: true,
              created_at: '2025-11-17'
            },
            {
              id: 7,
              name: 'Food Court',
              description: 'Main dining area with multiple food options',
              campus_building: 'Food Court Building',
              coordinates: 'POINT(73.7520 18.6160)',
              usage_count: 35,
              is_popular: true,
              created_at: '2025-11-23'
            },
            {
              id: 8,
              name: 'Hostel Common Room',
              description: 'Shared common area in hostel block',
              campus_building: 'Hostel Block C',
              coordinates: 'POINT(73.7495 18.6155)',
              usage_count: 19,
              is_popular: false,
              created_at: '2025-11-24'
            }
          ];

          // Parse mock data
          const parsedPoints: ParsedMeetingPoint[] = mockData
            .map((point: MeetingPoint) => {
              const coords = parseCoordinates(point.coordinates);
              if (!coords) return null;
              
              return {
                ...point,
                latitude: coords.latitude,
                longitude: coords.longitude
              };
            })
            .filter((point): point is ParsedMeetingPoint => point !== null);

          setMeetingPoints(parsedPoints);

          // Calculate statistics
          const totalPoints = parsedPoints.length;
          const totalUsage = parsedPoints.reduce((sum, p) => sum + p.usage_count, 0);
          const popularPoints = parsedPoints.filter(p => p.is_popular).length;
          const averageUsage = totalPoints > 0 ? totalUsage / totalPoints : 0;
          const mostPopular = parsedPoints.length > 0 ? parsedPoints[0].name : 'N/A';

          setStats({
            totalPoints,
            totalUsage,
            popularPoints,
            averageUsage: Number(averageUsage.toFixed(1)),
            mostPopularPoint: mostPopular
          });

          setMapReady(true);
          setLoading(false);
          return;
        }

        // Dynamically import supabase only when configured
        const { supabase } = await import('@/lib/supabase');
        
        const { data, error: fetchError } = await supabase
          .from('meeting_points')
          .select('*')
          .order('usage_count', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        if (data) {
          // Parse coordinates and filter valid points
          const parsedPoints: ParsedMeetingPoint[] = data
            .map((point: MeetingPoint) => {
              const coords = parseCoordinates(point.coordinates);
              if (!coords) return null;
              
              return {
                ...point,
                latitude: coords.latitude,
                longitude: coords.longitude
              };
            })
            .filter((point): point is ParsedMeetingPoint => point !== null);

          setMeetingPoints(parsedPoints);

          // Calculate statistics
          const totalPoints = parsedPoints.length;
          const totalUsage = parsedPoints.reduce((sum, p) => sum + p.usage_count, 0);
          const popularPoints = parsedPoints.filter(p => p.is_popular).length;
          const averageUsage = totalPoints > 0 ? totalUsage / totalPoints : 0;
          const mostPopular = parsedPoints.length > 0 ? parsedPoints[0].name : 'N/A';

          setStats({
            totalPoints,
            totalUsage,
            popularPoints,
            averageUsage: Number(averageUsage.toFixed(1)),
            mostPopularPoint: mostPopular
          });

          setMapReady(true);
        }
      } catch (err) {
        console.error('Error fetching meeting points:', err);
        setError(err instanceof Error ? err.message : 'Failed to load meeting points');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetingPoints();
  }, []);

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

  // Export data to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'Building', 'Usage Count', 'Popular', 'Latitude', 'Longitude', 'Description'];
    const rows = meetingPoints.map(p => [
      p.name,
      p.campus_building,
      p.usage_count,
      p.is_popular ? 'Yes' : 'No',
      p.latitude.toFixed(6),
      p.longitude.toFixed(6),
      p.description || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-meeting-points-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-[#FFE5D9] to-[#E8D5F2]">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-xl border-b border-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-purple-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Campus Meeting Points Heatmap
                </h1>
                <p className="text-sm text-gray-600">
                  Ajeenkya DY Patil University - Interactive meeting location analytics
                </p>
              </div>
            </div>
            <button
              onClick={exportToCSV}
              disabled={loading || meetingPoints.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Loading meeting points data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-red-900 mb-1">Error Loading Data</h3>
                <p className="text-red-700">{error}</p>
                <p className="text-sm text-red-600 mt-2">
                  Please check your Supabase connection and ensure the meeting_points table exists.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Points</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.totalPoints}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Usage</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.totalUsage}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Popular Spots</p>
                    <p className="text-2xl font-bold text-green-600">{stats.popularPoints}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl">
                    <Navigation className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Usage</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.averageUsage}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Most Popular</p>
                    <p className="text-lg font-bold text-pink-600 truncate">{stats.mostPopularPoint}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-200 mb-6">
              <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">Interactive Campus Heatmap</h2>
                <p className="text-sm text-gray-600">
                  Pin size and color intensity represent usage count. Click pins for detailed information.
                </p>
              </div>

              {/* Legend */}
              <div className="mb-4 flex flex-wrap gap-4 items-center bg-gray-50 rounded-lg p-4">
                <span className="text-sm font-semibold text-gray-700">Usage Intensity:</span>
                <div className="flex gap-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600">Very High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-gray-600">High</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                    <span className="text-xs text-gray-600">Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-lime-500"></div>
                    <span className="text-xs text-gray-600">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Very Low</span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border-2 border-purple-300 shadow-lg" style={{ height: '600px' }}>
                {mapReady && meetingPoints.length > 0 ? (
                  <MapComponent
                    center={mapCenter}
                    meetingPoints={meetingPoints}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <p className="text-gray-500">No meeting points to display</p>
                  </div>
                )}
              </div>
            </div>

            {/* Details Table */}
            <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-purple-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Meeting Point Details
              </h2>
              
              {meetingPoints.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No meeting points found</p>
                  <p className="text-gray-400 text-sm mt-2">Add meeting points to the database to see them here</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-purple-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Building</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Usage Count</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Coordinates</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {meetingPoints.map((point) => (
                        <tr 
                          key={point.id} 
                          className="border-b border-purple-100 hover:bg-purple-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <MapPin 
                                className="w-4 h-4 flex-shrink-0" 
                                style={{ color: getHeatmapColor(point.usage_count) }} 
                              />
                              <span className="font-medium">{point.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-700">{point.campus_building}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span 
                              className="px-3 py-1 rounded-full text-white text-sm font-medium inline-block"
                              style={{ backgroundColor: getHeatmapColor(point.usage_count) }}
                            >
                              {point.usage_count}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {point.is_popular ? (
                              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium">
                                ⭐ Popular
                              </span>
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-gray-200 text-gray-600 text-xs font-medium">
                                Standard
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="text-xs text-gray-600 font-mono">
                              <div>{point.latitude.toFixed(6)}</div>
                              <div>{point.longitude.toFixed(6)}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <p className="text-sm text-gray-600 max-w-xs truncate">
                              {point.description || 'No description'}
                            </p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
