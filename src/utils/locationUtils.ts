/**
 * Calculate the distance between two geographical points using the Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Find the closest service of each type to a given location
 */
export const findClosestServices = (
  userLocation: { lat: number; lon: number },
  services: any[],
  categories: any[]
) => {
  if (!services.length) return [];
  
  const closestServices: Array<{
    service: any;
    distance: number;
    category: any;
  }> = [];
  
  // Find closest service for each enabled category
  categories.forEach(category => {
    if (!category.enabled) return;
    
    const categoryServices = services.filter(service => service.type === category.id);
    if (categoryServices.length === 0) return;
    
    let closestService = categoryServices[0];
    let minDistance = calculateDistance(
      userLocation.lat,
      userLocation.lon,
      categoryServices[0].lat,
      categoryServices[0].lon
    );
    
    for (let i = 1; i < categoryServices.length; i++) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        categoryServices[i].lat,
        categoryServices[i].lon
      );
      
      if (distance < minDistance) {
        minDistance = distance;
        closestService = categoryServices[i];
      }
    }
    
    closestServices.push({
      service: closestService,
      distance: minDistance,
      category
    });
  });
  
  // Sort by distance
  return closestServices.sort((a, b) => a.distance - b.distance);
};

/**
 * Find the closest service to a given location (legacy function for backward compatibility)
 */
export const findClosestService = (
  userLocation: { lat: number; lon: number },
  services: any[]
) => {
  if (!services.length) return null;
  
  let closestService = services[0];
  let minDistance = calculateDistance(
    userLocation.lat,
    userLocation.lon,
    services[0].lat,
    services[0].lon
  );
  
  for (let i = 1; i < services.length; i++) {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lon,
      services[i].lat,
      services[i].lon
    );
    
    if (distance < minDistance) {
      minDistance = distance;
      closestService = services[i];
    }
  }
  
  return {
    service: closestService,
    distance: minDistance
  };
};