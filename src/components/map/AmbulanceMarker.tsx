import { useMemo } from "react"
import { Marker, Popup, useMap } from "react-leaflet"
import { Icon, type LatLngExpression } from "leaflet"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSelectedAmbulanceId, selectSelectedAmbulanceId } from "@/store/slices/uiSlice"
import { Badge } from "@/components/ui/badge"
import { Truck } from "lucide-react"
import type { Ambulance } from "@/types"
import { cn } from "@/lib/utils"

interface AmbulanceMarkerProps {
  ambulance: Ambulance
}

// Status colors
const statusColors: Record<Ambulance["status"], string> = {
  available: "#10b981", // green
  busy: "#f59e0b", // orange
  maintenance: "#6b7280", // gray
  offline: "#ef4444", // red
}

// Create custom icon for ambulance
function createAmbulanceIcon(status: Ambulance["status"]) {
  const color = statusColors[status]
  
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" fill="${color}" opacity="0.2" stroke="${color}" stroke-width="2"/>
        <path d="M16 8 L20 12 L20 16 L24 16 L24 20 L20 20 L20 24 L12 24 L12 20 L8 20 L8 16 L12 16 L12 12 Z" fill="${color}" stroke="white" stroke-width="1"/>
        <circle cx="16" cy="16" r="3" fill="white"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

export function AmbulanceMarker({ ambulance }: AmbulanceMarkerProps) {
  const dispatch = useAppDispatch()
  const selectedId = useAppSelector(selectSelectedAmbulanceId)
  const map = useMap()

  const isSelected = selectedId === ambulance.id
  const position: LatLngExpression = [ambulance.location.lat, ambulance.location.lng]

  const icon = useMemo(
    () => createAmbulanceIcon(ambulance.status),
    [ambulance.status]
  )

  const handleClick = () => {
    dispatch(setSelectedAmbulanceId(ambulance.id))
    map.setView(position, Math.max(map.getZoom(), 15))
  }

  const statusLabels: Record<Ambulance["status"], string> = {
    available: "Disponible",
    busy: "Occupée",
    maintenance: "Maintenance",
    offline: "Hors ligne",
  }

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
      zIndexOffset={isSelected ? 1000 : 0}
    >
      <Popup className="ambulance-popup" maxWidth={300}>
        <div className="space-y-2 p-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">{ambulance.name}</h3>
            <Badge
              variant={
                ambulance.status === "available"
                  ? "statusAvailable"
                  : ambulance.status === "busy"
                  ? "statusBusy"
                  : ambulance.status === "maintenance"
                  ? "statusMaintenance"
                  : "statusOffline"
              }
            >
              {statusLabels[ambulance.status]}
            </Badge>
          </div>

          <div className="space-y-1 text-sm">
            <div>
              <span className="font-medium">Plaque:</span> {ambulance.plateNumber}
            </div>
            <div>
              <span className="font-medium">Chauffeur:</span> {ambulance.crew.driver}
            </div>
            <div>
              <span className="font-medium">Médecin:</span> {ambulance.crew.medic}
            </div>
            {ambulance.currentIncidentId && (
              <div className="text-xs text-muted-foreground">
                En intervention: {ambulance.currentIncidentId}
              </div>
            )}
            {ambulance.equipment && ambulance.equipment.length > 0 && (
              <div className="mt-2">
                <span className="font-medium text-xs">Équipements:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ambulance.equipment.map((eq, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-1.5 py-0.5 bg-muted rounded"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-2">
              Dernière mise à jour:{" "}
              {new Date(ambulance.lastUpdate).toLocaleTimeString("fr-FR")}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

