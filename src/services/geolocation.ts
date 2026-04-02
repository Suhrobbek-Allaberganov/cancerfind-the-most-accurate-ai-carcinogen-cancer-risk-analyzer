import { Geolocation } from '@capacitor/geolocation';

export interface HazardMapData {
  region: string;
  pollutants: {
    medium: 'Water' | 'Air' | 'Soil';
    substance: string;
    level: 'Low' | 'Moderate' | 'High';
    source: string;
  }[];
  assessment: string;
}

export async function getRegionalHazards(): Promise<HazardMapData> {
  const coordinates = await Geolocation.getCurrentPosition();
  const { latitude, longitude } = coordinates.coords;

  // In a real app, we would call an API with these coordinates.
  // For now, we'll simulate based on coordinates or default to a region.
  
  // Example data for Uzbekistan regions if detected
  const isUzbekistan = latitude > 37 && latitude < 46 && longitude > 56 && longitude < 74;

  if (isUzbekistan) {
    return {
      region: "Uzbekistan (Central)",
      pollutants: [
        { medium: 'Water', substance: 'Agricultural Pesticides (Organochlorines)', level: 'Moderate', source: 'Regional Monitoring 2026' },
        { medium: 'Air', substance: 'Particulate Matter (PM2.5)', level: 'High', source: 'IQAir / NASA 2026' },
        { medium: 'Soil', substance: 'Salinization & Mineral Fertilizers', level: 'Moderate', source: 'Environmental Dept' }
      ],
      assessment: "Regional hazards primarily linked to agricultural history and urban air quality. PM2.5 levels often exceed WHO limits."
    };
  }

  return {
    region: "Global Standard",
    pollutants: [
      { medium: 'Air', substance: 'CO2 / Nitrogen Dioxide', level: 'Moderate', source: 'Global Air Index' }
    ],
    assessment: "General urban environmental pollutants detected."
  };
}
