import React from 'react';
import { EmergencyService, ServiceCategory } from '../types/emergency';

interface ServiceStatsProps {
  services: EmergencyService[];
  categories: ServiceCategory[];
}

const ServiceStats: React.FC<ServiceStatsProps> = ({ services, categories }) => {
  const getServiceCount = (type: string) => {
    return services.filter(service => service.type === type).length;
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Service Statistics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {categories.map(category => (
          <div key={category.id} className="text-center">
            <div 
              className="text-2xl p-3 rounded-full w-16 h-16 mx-auto flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: category.color }}
            >
              {category.icon}
            </div>
            <h4 className="mt-2 font-medium text-gray-700">{category.name}</h4>
            <p className="text-2xl font-bold" style={{ color: category.color }}>
              {getServiceCount(category.id)}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-center text-gray-600">
          Total: <span className="font-bold text-gray-800">{services.length}</span> emergency services
        </p>
      </div>
    </div>
  );
};

export default ServiceStats;