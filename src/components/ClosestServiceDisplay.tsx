import React from 'react';
import { Navigation, MapPin, Phone, Star } from 'lucide-react';
import { EmergencyService, ServiceCategory } from '../types/emergency';
import { findClosestServices } from '../utils/locationUtils';

interface ClosestServiceDisplayProps {
  userLocation: { lat: number; lon: number } | null;
  services: EmergencyService[];
  categories: ServiceCategory[];
}

const ClosestServiceDisplay: React.FC<ClosestServiceDisplayProps> = ({
  userLocation,
  services,
  categories
}) => {
  if (!userLocation) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
          <Star className="mr-2 h-5 w-5 text-yellow-500" />
          Closest Services
        </h3>
        <div className="text-center py-6">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-500 text-sm">
            Enable location access to find the nearest emergency services
          </p>
        </div>
      </div>
    );
  }

  const closestServices = findClosestServices(userLocation, services, categories);

  if (closestServices.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
          <Star className="mr-2 h-5 w-5 text-yellow-500" />
          Closest Services
        </h3>
        <div className="text-center py-6">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-gray-500 text-sm">
            No services available. Enable service categories to find nearby options.
          </p>
        </div>
      </div>
    );
  }

  const handleGetDirections = (service: EmergencyService) => {
    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lon}/${service.lat},${service.lon}`;
    window.open(url, '_blank');
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <Star className="mr-2 h-5 w-5 text-yellow-500" />
        Closest Services
      </h3>
      
      <div className="space-y-3">
        {closestServices.map(({ service, distance, category }, index) => (
          <div 
            key={`${service.id}-${category.id}`}
            className="relative border rounded-lg p-3 bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-shadow"
          >
            {/* Closest badge for the nearest service */}
            {index === 0 && (
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-lg flex items-center">
                <Star className="h-3 w-3 mr-1" />
                NEAREST
              </div>
            )}
            
            <div className="flex items-start space-x-3">
              <div 
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold shadow-md"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate">
                  {service.name}
                </h4>
                <p className="text-xs text-gray-600 mb-1">
                  {category.name.slice(0, -1)}
                </p>
                
                <div className="flex items-center space-x-1 mb-2">
                  <MapPin className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-green-600">
                    {distance} km away
                  </span>
                </div>
                
                {service.address && (
                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                    {service.address}
                  </p>
                )}
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleGetDirections(service)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1.5 rounded font-medium transition-colors flex items-center justify-center space-x-1"
                  >
                    <Navigation className="h-3 w-3" />
                    <span>Directions</span>
                  </button>
                  
                  {service.phone && (
                    <button
                      onClick={() => handleCall(service.phone)}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1.5 rounded font-medium transition-colors flex items-center justify-center space-x-1"
                    >
                      <Phone className="h-3 w-3" />
                      <span>Call</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 text-xs text-gray-500 text-center">
        Showing closest service from each active category
      </div>
    </div>
  );
};

export default ClosestServiceDisplay;