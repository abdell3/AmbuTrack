import { useEffect, useMemo } from "react"
import { MapContainer as LeafletMapContainer, TileLayer, useMap } from "react-leaflet"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setMapCenter, setMapZoom, selectMapCenter, selectMapZoom } from "@/store/slices/uiSlice"
import type { Ambulance, Incident } from "@/types"
import { AmbulanceMarker } from "./AmbulanceMarker"
import { IncidentMarker } from "./IncidentMarker"
import { MapControls } from "./MapControls"

interface MapContainerProps {
  ambulances?: Ambulance[]
  incidents?: Incident[]
  showAmbulances?: boolean
  showIncidents?: boolean
  className?: string
}

// Component to sync map view with Redux state
function MapSync() {
  const map = useMap()
  const center = useAppSelector(selectMapCenter)
  const zoom = useAppSelector(selectMapZoom)

  useEffect(() => {
    map.setView([center.lat, center.lng], zoom)
  }, [map, center.lat, center.lng, zoom])

  return null
}

// Component to handle map view changes
function MapViewHandler() {
  const map = useMap()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleMoveEnd = () => {
      const center = map.getCenter()
      const zoom = map.getZoom()
      dispatch(setMapCenter({ lat: center.lat, lng: center.lng }))
      dispatch(setMapZoom(zoom))
    }

    map.on("moveend", handleMoveEnd)
    map.on("zoomend", handleMoveEnd)

    return () => {
      map.off("moveend", handleMoveEnd)
      map.off("zoomend", handleMoveEnd)
    }
  }, [map, dispatch])

  return null
}

export function MapContainer({
  ambulances = [],
  incidents = [],
  showAmbulances = true,
  showIncidents = true,
  className = "",
}: MapContainerProps) {
  const center = useAppSelector(selectMapCenter)
  const zoom = useAppSelector(selectMapZoom)

  // Calculate center from data if no center is set
  const mapCenter = useMemo(() => {
    if (center.lat !== 48.8566 || center.lng !== 2.3522) {
      return [center.lat, center.lng] as [number, number]
    }

    // Auto-center on data if available
    const allLocations: Array<{ lat: number; lng: number }> = []
    
    if (showAmbulances) {
      allLocations.push(...ambulances.map((a) => a.location))
    }
    
    if (showIncidents) {
      allLocations.push(...incidents.map((i) => i.location))
    }

    if (allLocations.length === 0) {
      return [48.8566, 2.3522] as [number, number] // Paris default
    }

    // Calculate center of all locations
    const avgLat =
      allLocations.reduce((sum, loc) => sum + loc.lat, 0) / allLocations.length
    const avgLng =
      allLocations.reduce((sum, loc) => sum + loc.lng, 0) / allLocations.length

    return [avgLat, avgLng] as [number, number]
  }, [center, ambulances, incidents, showAmbulances, showIncidents])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <LeafletMapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        className="h-full w-full z-0"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapSync />
        <MapViewHandler />

        {showAmbulances &&
          ambulances.map((ambulance) => (
            <AmbulanceMarker key={ambulance.id} ambulance={ambulance} />
          ))}

        {showIncidents &&
          incidents.map((incident) => (
            <IncidentMarker key={incident.id} incident={incident} />
          ))}

        <MapControls />
      </LeafletMapContainer>
    </div>
  )
}

