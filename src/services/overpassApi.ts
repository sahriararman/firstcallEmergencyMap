import { EmergencyService, ServiceCategory } from '../types/emergency';

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Dhaka city bounds (approximate)
const DHAKA_BOUNDS = {
  south: 23.6850,
  west: 90.3563,
  north: 23.9036,
  east: 90.4264
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'hospital',
    name: 'Hospitals',
    icon: '🏥',
    color: '#ef4444',
    enabled: true,
    query: 'amenity=hospital'
  },
  {
    id: 'police',
    name: 'Police Stations',
    icon: '👮',
    color: '#3b82f6',
    enabled: true,
    query: 'amenity=police'
  },
  {
    id: 'fire_station',
    name: 'Fire Stations',
    icon: '🚒',
    color: '#f97316',
    enabled: true,
    query: 'amenity=fire_station'
  }
];

export const fetchEmergencyServices = async (categories: ServiceCategory[]): Promise<EmergencyService[]> => {
  const enabledCategories = categories.filter(cat => cat.enabled);
  
  if (enabledCategories.length === 0) {
    return [];
  }

  const queries = enabledCategories.map(category => {
    if (category.id === 'fire_station') {
      // Fire stations can be tagged with either emergency=fire_station or amenity=fire_station
      return `
        (
          node["emergency"="fire_station"](${DHAKA_BOUNDS.south},${DHAKA_BOUNDS.west},${DHAKA_BOUNDS.north},${DHAKA_BOUNDS.east});
          way["emergency"="fire_station"](${DHAKA_BOUNDS.south},${DHAKA_BOUNDS.west},${DHAKA_BOUNDS.north},${DHAKA_BOUNDS.east});
          relation["emergency"="fire_station"](${DHAKA_BOUNDS.south},${DHAKA_BOUNDS.west},${DHAKA_BOUNDS.north},${DHAKA_BOUNDS.east});
          node["amenity"="fire_station"](${DHAKA_BOUNDS.south},${DHAKA_BOUNDS.west},${DHAKA_BOUNDS.north},${DHAKA_BOUNDS.east});
          way["amenity"="fire_station"](${DHAKA_BOUNDS.south},${DHAKA_BOUNDS.west},${DHAKA_BOUNDS.north},${DHAKA_BOUNDS.east});
          relation["amenity"="fire_station"](${DHAKA_BOUNDS.south},${DHAKA_BOUNDS.west},${DHAKA_BOUNDS.north},${DHAKA_BOUNDS.east});
        );
      `;
    } else {
      return `
        (
          node["amenity"="${category.id}"](${DHAKA_BOUNDS.south},${DHAKA_BOUNDS.west},${DHAKA_BOUNDS.north},${DHAKA_BOUNDS.east});
          way["amenity"="${category.id}"](${DHAKA_BOUNDS.south},${DHAKA_BOUNDS.west},${DHAKA_BOUNDS.north},${DHAKA_BOUNDS.east});
          relation["amenity"="${category.id}"](${DHAKA_BOUNDS.south},${DHAKA_BOUNDS.west},${DHAKA_BOUNDS.north},${DHAKA_BOUNDS.east});
        );
      `;
    }
  });

  const overpassQuery = `
    [out:json][timeout:25];
    (
      ${queries.join('')}
    );
    out geom;
  `;

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: overpassQuery
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return parseOverpassResponse(data);
  } catch (error) {
    console.error('Error fetching emergency services:', error);
    return [];
  }
};

const parseOverpassResponse = (data: any): EmergencyService[] => {
  const services: EmergencyService[] = [];

  data.elements.forEach((element: any) => {
    if (!element.lat && !element.lon) {
      // For ways and relations, use the first coordinate
      if (element.geometry && element.geometry.length > 0) {
        element.lat = element.geometry[0].lat;
        element.lon = element.geometry[0].lon;
      } else {
        return; // Skip if no coordinates
      }
    }

    const tags = element.tags || {};
    let type: 'hospital' | 'police' | 'fire_station' = 'hospital';

    if (tags.amenity === 'hospital') {
      type = 'hospital';
    } else if (tags.amenity === 'police') {
      type = 'police';
    } else if (tags.emergency === 'fire_station' || tags.amenity === 'fire_station') {
      type = 'fire_station';
    }

    services.push({
      id: element.id.toString(),
      name: tags.name || tags['name:en'] || tags['name:bn'] || `${type.charAt(0).toUpperCase() + type.slice(1)} Service`,
      type,
      lat: element.lat,
      lon: element.lon,
      phone: tags.phone || tags['contact:phone'] || tags.telephone,
      address: tags['addr:full'] || tags.address,
      tags
    });
  });

  return services;
};