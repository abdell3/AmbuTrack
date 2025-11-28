import { useMemo, useEffect, useState } from "react"
import { Marker, Popup, useMap } from "react-leaflet"
import { Icon, DivIcon, type LatLngExpression } from "leaflet"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSelectedIncidentId, selectSelectedIncidentId } from "@/store/slices/uiSlice"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, MapPin } from "lucide-react"
import type { Incident } from "@/types"
import { cn } from "@/lib/utils"

interface IncidentMarkerProps {
  incident: Incident
}

// Emergency level colors
const emergencyColors: Record<Incident["emergencyLevel"], string> = {
  low: "#10b981", // green
  medium: "#f59e0b", // orange
  high: "#ef4444", // red
  critical: "#dc2626", // dark red
}

// Create pulsing icon for incidents
function createIncidentIcon(
  level: Incident["emergencyLevel"],
  isPulsing: boolean
) {
  const color = emergencyColors[level]
  
  const pulseClass = isPulsing ? "animate-pulse" : ""
  
  return new DivIcon({
    html: `
      <div class="incident-marker ${pulseClass}" style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background-color: ${color};
        border: 3px solid white;
        box-shadow: 0 0 0 0 ${color}40, 0 0 0 0 ${color}40;
        animation: ${isPulsing ? "pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none"};
      ">
        <div style="
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 12px;
        ">!</div>
      </div>
      <style>
        @keyframes pulse-ring {
          0% {
            box-shadow: 0 0 0 0 ${color}80, 0 0 0 0 ${color}80;
          }
          50% {
            box-shadow: 0 0 0 10px ${color}00, 0 0 0 20px ${color}00;
          }
          100% {
            box-shadow: 0 0 0 0 ${color}00, 0 0 0 0 ${color}00;
          }
        }
      </style>
    `,
    className: "incident-marker-container",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  })
}

export function IncidentMarker({ incident }: IncidentMarkerProps) {
  const dispatch = useAppDispatch()
  const selectedId = useAppSelector(selectSelectedIncidentId)
  const map = useMap()
  const [isPulsing, setIsPulsing] = useState(true)

  const isSelected = selectedId === incident.id
  const position: LatLngExpression = [incident.location.lat, incident.location.lng]

  // Pulse for pending/assigned incidents
  useEffect(() => {
    if (
      incident.status === "pending" ||
      incident.status === "assigned" ||
      incident.status === "in_progress"
    ) {
      setIsPulsing(true)
    } else {
      setIsPulsing(false)
    }
  }, [incident.status])

  const icon = useMemo(
    () => createIncidentIcon(incident.emergencyLevel, isPulsing),
    [incident.emergencyLevel, isPulsing]
  )

  const handleClick = () => {
    dispatch(setSelectedIncidentId(incident.id))
    map.setView(position, Math.max(map.getZoom(), 15))
  }

  const levelLabels: Record<Incident["emergencyLevel"], string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Élevée",
    critical: "Critique",
  }

  const statusLabels: Record<Incident["status"], string> = {
    pending: "En attente",
    assigned: "Assigné",
    in_progress: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    
    if (diffMins < 1) return "À l'instant"
    if (diffMins < 60) return `Il y a ${diffMins} min`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `Il y a ${diffHours}h`
    const diffDays = Math.floor(diffHours / 24)
    return `Il y a ${diffDays}j`
  }

  return (
    <Marker
      position={position}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
      zIndexOffset={isSelected ? 1000 : 500}
    >
      <Popup className="incident-popup" maxWidth={350}>
        <div className="space-y-3 p-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg leading-tight">{incident.title}</h3>
            <Badge
              variant={
                incident.emergencyLevel === "low"
                  ? "emergencyLow"
                  : incident.emergencyLevel === "medium"
                  ? "emergencyMedium"
                  : incident.emergencyLevel === "high"
                  ? "emergencyHigh"
                  : "emergencyCritical"
              }
            >
              {levelLabels[incident.emergencyLevel]}
            </Badge>
          </div>

          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Adresse:
              </span>
              <div className="text-muted-foreground mt-0.5">
                {incident.location.address}
              </div>
            </div>

            <div>
              <span className="font-medium">Description:</span>
              <div className="text-muted-foreground mt-0.5">
                {incident.description}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div>
                <span className="font-medium">Statut:</span>{" "}
                <span className="text-muted-foreground">
                  {statusLabels[incident.status]}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span className="text-muted-foreground">
                  {getTimeAgo(incident.reportedAt)}
                </span>
              </div>
            </div>

            {incident.assignedAmbulanceId && (
              <div className="text-xs">
                <span className="font-medium">Ambulance assignée:</span>{" "}
                <span className="text-muted-foreground">
                  {incident.assignedAmbulanceId}
                </span>
              </div>
            )}

            {incident.patient && (
              <div className="mt-2 pt-2 border-t">
                <span className="font-medium text-xs">Patient:</span>
                <div className="text-muted-foreground text-xs mt-0.5">
                  {incident.patient.name}
                  {incident.patient.age && `, ${incident.patient.age} ans`}
                </div>
                <div className="text-muted-foreground text-xs mt-0.5">
                  {incident.patient.condition}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground mt-2">
              Signalé par: {incident.reporter.name}
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

