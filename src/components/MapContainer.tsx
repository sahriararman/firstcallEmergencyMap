import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { EmergencyService, ServiceCategory } from '../types/emergency';
import { fetchEmergencyServices, serviceCategories } from '../services/overpassApi';
import { findClosestServices } from '../utils/locationUtils';

interface MapContainerProps {
  services: EmergencyService[];
  categories: ServiceCategory[];
  onServicesLoad: (services: EmergencyService[]) => void;
  onCategoryToggle: (categoryId: string) => void;
  userLocation: { lat: number; lon: number } | null;
}

const MapContainer: React.FC<MapContainerProps> = ({
  services,
  categories,
  onServicesLoad,
  onCategoryToggle,
  userLocation
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const closestMarkersRef = useRef<L.Marker[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('map').setView([23.8103, 90.4125], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapRef.current = map;
      markersRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Load emergency services
  useEffect(() => {
    const loadServices = async () => {
      setLoading(true);
      try {
        const emergencyServices = await fetchEmergencyServices(categories);
        onServicesLoad(emergencyServices);
      } catch (error) {
        console.error('Failed to load emergency services:', error);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, [categories, onServicesLoad]);

  // Update markers when services change
  useEffect(() => {
    if (!markersRef.current || !mapRef.current) return;

    markersRef.current.clearLayers();
    
    // Clear previous closest markers
    closestMarkersRef.current.forEach(marker => {
      if (mapRef.current) {
        mapRef.current.removeLayer(marker);
      }
    });
    closestMarkersRef.current = [];

    // Get closest services if user location is available
    const closestServices = userLocation ? findClosestServices(userLocation, services, categories) : [];
    const closestServiceIds = new Set(closestServices.map(cs => cs.service.id));

    services.forEach(service => {
      const category = serviceCategories.find(cat => cat.id === service.type);
      if (!category || !category.enabled) return;

      const isClosest = closestServiceIds.has(service.id);
      const closestRank = closestServices.findIndex(cs => cs.service.id === service.id);
      
      const icon = L.divIcon({
        html: `
          <div style="
            background-color: ${category.color};
            color: white;
            border-radius: 50%;
            width: ${isClosest ? '48px' : '40px'};
            height: ${isClosest ? '48px' : '40px'};
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: ${isClosest ? '18px' : '16px'};
            border: ${isClosest ? '4px solid #fbbf24' : '3px solid white'};
            box-shadow: ${isClosest ? '0 4px 16px rgba(251, 191, 36, 0.6), 0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.3)'};
            position: relative;
            z-index: ${isClosest ? '1000' : '100'};
            ${isClosest ? 'animation: pulse-glow 2s infinite;' : ''}
          ">
            ${category.icon}
            ${isClosest && closestRank === 0 ? '<div style="position: absolute; top: -8px; right: -8px; background: #fbbf24; color: white; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border: 2px solid white;">★</div>' : ''}
          </div>
          ${isClosest ? `
            <style>
              @keyframes pulse-glow {
                0% { 
                  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.6), 0 2px 8px rgba(0,0,0,0.3);
                  transform: scale(1);
                }
                50% { 
                  box-shadow: 0 6px 20px rgba(251, 191, 36, 0.8), 0 4px 12px rgba(0,0,0,0.4);
                  transform: scale(1.05);
                }
                100% { 
                  box-shadow: 0 4px 16px rgba(251, 191, 36, 0.6), 0 2px 8px rgba(0,0,0,0.3);
                  transform: scale(1);
                }
              }
            </style>
          ` : ''}
        `,
        className: 'custom-marker',
        iconSize: isClosest ? [48, 48] : [40, 40],
        iconAnchor: isClosest ? [24, 24] : [20, 20]
      });

      const distance = userLocation ? 
        closestServices.find(cs => cs.service.id === service.id)?.distance : null;
      
      const marker = L.marker([service.lat, service.lon], { icon })
        .bindPopup(`
          <div style="min-width: 200px;">
            ${isClosest ? `
              <div style="background: linear-gradient(45deg, #fbbf24, #f59e0b); color: white; padding: 4px 8px; border-radius: 4px; text-align: center; margin-bottom: 8px; font-size: 12px; font-weight: bold;">
                ${closestRank === 0 ? '⭐ NEAREST SERVICE' : `🎯 CLOSEST ${category.name.toUpperCase().slice(0, -1)}`}
                ${distance ? ` - ${distance} km` : ''}
              </div>
            ` : ''}
            <h3 style="margin: 0 0 8px 0; color: ${category.color}; font-size: 16px; font-weight: bold;">
              ${service.name}
            </h3>
            <p style="margin: 4px 0; color: #666; font-size: 14px;">
              <strong>Type:</strong> ${category.name.slice(0, -1)}
            </p>
            ${service.phone ? `
              <p style="margin: 4px 0; color: #666; font-size: 14px;">
                <strong>Phone:</strong> <a href="tel:${service.phone}" style="color: ${category.color};">${service.phone}</a>
              </p>
            ` : ''}
            ${service.address ? `
              <p style="margin: 4px 0; color: #666; font-size: 14px;">
                <strong>Address:</strong> ${service.address}
              </p>
            ` : ''}
            ${distance ? `
              <p style="margin: 4px 0; color: #10b981; font-size: 14px; font-weight: bold;">
                <strong>Distance:</strong> ${distance} km from your location
              </p>
            ` : ''}
            <button 
              onclick="getDirections(${service.lat}, ${service.lon})"
              style="
                background-color: ${category.color};
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                margin-top: 8px;
              "
            >
              Get Directions
            </button>
          </div>
        `);

      markersRef.current?.addLayer(marker);
      
      // Store closest markers for special handling
      if (isClosest) {
        closestMarkersRef.current.push(marker);
      }
    });
  }, [services, userLocation, categories]);

  // Update user location marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
    }

    if (userLocation) {
      // Center the map on user location
      mapRef.current.setView([userLocation.lat, userLocation.lon], 15);
      
      const userIcon = L.divIcon({
        html: `
          <div style="
            background: radial-gradient(circle, #10b981 0%, #059669 100%);
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            border: 4px solid white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
            animation: pulse 2s infinite;
          ">
            📍
          </div>
          <style>
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.1); }
              100% { transform: scale(1); }
            }
          </style>
        `,
        className: 'user-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lon], { icon: userIcon })
        .bindPopup(`
          <div style="text-align: center; min-width: 150px;">
            <h3 style="margin: 0 0 8px 0; color: #10b981; font-size: 16px; font-weight: bold;">
              📍 Your Location
            </h3>
            <p style="margin: 4px 0; color: #666; font-size: 14px;">
              Lat: ${userLocation.lat.toFixed(6)}<br>
              Lon: ${userLocation.lon.toFixed(6)}
            </p>
            <p style="margin: 8px 0 0 0; color: #10b981; font-size: 12px; font-weight: bold;">
              Click on any emergency service marker to get directions from here
            </p>
          </div>
        `)
        .addTo(mapRef.current);

      // Add a circle around user location to show accuracy
      const accuracyCircle = L.circle([userLocation.lat, userLocation.lon], {
        radius: 100, // 100 meters radius
        fillColor: '#10b981',
        fillOpacity: 0.1,
        color: '#10b981',
        weight: 2,
        opacity: 0.5
      }).addTo(mapRef.current);

      // Store reference to remove it later
      (userMarkerRef.current as any).accuracyCircle = accuracyCircle;
    }
  }, [userLocation]);

  // Add getDirections function to window for popup button
  useEffect(() => {
    (window as any).getDirections = (lat: number, lon: number) => {
      if (userLocation) {
        const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lon}/${lat},${lon}`;
        window.open(url, '_blank');
      } else {
        alert('Please enable location access to get directions');
      }
    };
  }, [userLocation]);

  return (
    <div className="relative">
      <div id="map" className="w-full h-96 md:h-[500px] rounded-lg shadow-lg"></div>
      
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="bg-white p-4 rounded-lg flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
            <span>Loading emergency services...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;