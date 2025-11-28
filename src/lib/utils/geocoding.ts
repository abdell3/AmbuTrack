/**
 * Simulated geocoding service
 * In a real app, this would call a geocoding API like Google Maps or OpenStreetMap Nominatim
 */
export interface GeocodeResult {
  lat: number
  lng: number
  address: string
}

export async function geocodeAddress(address: string): Promise<GeocodeResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Simulated geocoding - in real app, use actual geocoding service
  // For demo, return Paris coordinates with slight variation based on address hash
  const hash = address.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const latVariation = (hash % 100) / 1000 // ±0.05 degrees
  const lngVariation = ((hash * 7) % 100) / 1000

  return {
    lat: 48.8566 + latVariation,
    lng: 2.3522 + lngVariation,
    address: address,
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Calculate estimated time of arrival (ETA) in minutes
 * Assumes average speed of 50 km/h in urban areas
 */
export function calculateETA(distanceKm: number): number {
  const averageSpeedKmh = 50
  const etaHours = distanceKm / averageSpeedKmh
  return Math.ceil(etaHours * 60) // Convert to minutes and round up
}

