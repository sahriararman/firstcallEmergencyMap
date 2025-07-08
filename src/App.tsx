import React, { useState, useCallback } from 'react';
import { Shield, Phone, MapPin } from 'lucide-react';
import MapContainer from './components/MapContainer';
import CategoryFilter from './components/CategoryFilter';
import LocationButton from './components/LocationButton';
import ClosestServiceDisplay from './components/ClosestServiceDisplay';
import ServiceStats from './components/ServiceStats';
import { EmergencyService, ServiceCategory } from './types/emergency';
import { serviceCategories } from './services/overpassApi';

function App() {
  const [services, setServices] = useState<EmergencyService[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>(serviceCategories);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>({
    lat: 23.8103,
    lon: 90.4125
  });

  const handleServicesLoad = useCallback((loadedServices: EmergencyService[]) => {
    setServices(loadedServices);
  }, []);

  const handleCategoryToggle = useCallback((categoryId: string) => {
    setCategories(prev => 
      prev.map(cat => 
        cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat
      )
    );
  }, []);

  const handleLocationFound = useCallback((location: { lat: number; lon: number }) => {
    setUserLocation(location);
  }, []);

  const emergencyNumbers = [
    { label: 'Fire Service', number: '999', icon: '🚒' },
    { label: 'Police', number: '999', icon: '👮' },
    { label: 'Ambulance', number: '999', icon: '🚑' },
    { label: 'National Emergency', number: '999', icon: '🆘' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-red-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">FirstCalls</h1>
                <p className="text-sm text-gray-500">Quick access to life-saving services</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">Live Location Services</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Emergency Numbers Banner */}
        <div className="bg-green-600 text-white p-4 rounded-lg mb-8 shadow-lg">
          <div className="flex items-center mb-2">
            <Phone className="h-5 w-5 mr-2" />
            <h2 className="text-lg font-semibold">Emergency Hotlines</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emergencyNumbers.map((emergency, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl mb-1">{emergency.icon}</div>
                <div className="text-sm font-medium">{emergency.label}</div>
                <a 
                  href={`tel:${emergency.number}`}
                  className="text-lg font-bold hover:underline"
                >
                  {emergency.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <CategoryFilter 
              categories={categories} 
              onToggle={handleCategoryToggle} 
            />
            <LocationButton onLocationFound={handleLocationFound} />
            <ClosestServiceDisplay 
              userLocation={userLocation}
              services={services}
              categories={categories}
            />
            <ServiceStats services={services} categories={categories} />
          </div>

          {/* Map Container */}
          <div className="lg:col-span-3">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Emergency Services Map
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Live Data</span>
                </div>
              </div>
              <MapContainer
                services={services}
                categories={categories}
                onServicesLoad={handleServicesLoad}
                onCategoryToggle={handleCategoryToggle}
                userLocation={userLocation}
              />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">How to Use</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Click on map markers for service details</li>
                <li>• Use filters to show/hide service types</li>
                <li>• Enable location for directions</li>
                <li>• Call emergency numbers for immediate help</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Data Source</h3>
              <p className="text-sm text-gray-600">
                Emergency services data is provided by OpenStreetMap contributors 
                and updated regularly through the Overpass API.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Coverage Area</h3>
              <p className="text-sm text-gray-600">
                Currently showing services within Dhaka city limits. 
                This app can be easily adapted for other cities worldwide.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;