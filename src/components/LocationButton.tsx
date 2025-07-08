import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface LocationButtonProps {
  onLocationFound: (location: { lat: number; lon: number }) => void;
}

const LocationButton: React.FC<LocationButtonProps> = ({ onLocationFound }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Location found:', { lat: latitude, lon: longitude });
        onLocationFound({ lat: latitude, lon: longitude });
        setLoading(false);
        setError(null); // Clear any previous errors
      },
      (err) => {
        console.error('Geolocation error:', err);
        let errorMessage = 'Unable to get your location. ';
        switch(err.code) {
          case err.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += err.message;
            break;
        }
        setError(errorMessage);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Your Location</h3>
      <button
        onClick={handleLocateMe}
        disabled={loading}
        className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
      >
        <MapPin size={20} />
        <span>{loading ? 'Locating...' : 'Locate Me'}</span>
      </button>
      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationButton;