export interface EmergencyService {
  id: string;
  name: string;
  type: 'hospital' | 'police' | 'fire_station';
  lat: number;
  lon: number;
  phone?: string;
  address?: string;
  tags: Record<string, string>;
}

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  query: string;
}