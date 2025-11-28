import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/incidents/StatusBadge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAmbulances } from "@/lib/api/queries"
import type { Incident } from "@/types"
import {
  X,
  Calendar,
  MapPin,
  Phone,
  User,
  Clock,
  Truck,
  FileText,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface IncidentDetailsProps {
  incident: Incident
  onClose?: () => void
}

export function IncidentDetails({ incident, onClose }: IncidentDetailsProps) {
  const { data: ambulances = [] } = useAmbulances()
  const assignedAmbulance = incident.assignedAmbulanceId
    ? ambulances.find((a) => a.id === incident.assignedAmbulanceId)
    : null

  const formatDate = (dateString?: string) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const getDuration = () => {
    if (!incident.startedAt || !incident.completedAt) return null
    const start = new Date(incident.startedAt)
    const end = new Date(incident.completedAt)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return diffMins
  }

  const getResponseTime = () => {
    if (!incident.reportedAt || !incident.assignedAt) return null
    const reported = new Date(incident.reportedAt)
    const assigned = new Date(incident.assignedAt)
    const diffMs = assigned.getTime() - reported.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return diffMins
  }

  const levelLabels: Record<Incident["emergencyLevel"], string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Élevée",
    critical: "Critique",
  }

  const reportedDate = formatDate(incident.reportedAt)
  const assignedDate = formatDate(incident.assignedAt)
  const startedDate = formatDate(incident.startedAt)
  const completedDate = formatDate(incident.completedAt)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{incident.title}</h2>
          <div className="flex items-center gap-2 mt-2">
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
            <StatusBadge status={incident.status} />
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Description
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{incident.description}</p>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Chronologie
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportedDate && (
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Signalé</div>
                  <div className="text-sm text-muted-foreground">
                    {reportedDate.date} à {reportedDate.time}
                  </div>
                </div>
              </div>
            )}
            {assignedDate && (
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Assigné</div>
                  <div className="text-sm text-muted-foreground">
                    {assignedDate.date} à {assignedDate.time}
                  </div>
                  {getResponseTime() && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Temps de réponse: {getResponseTime()} min
                    </div>
                  )}
                </div>
              </div>
            )}
            {startedDate && (
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Intervention démarrée</div>
                  <div className="text-sm text-muted-foreground">
                    {startedDate.date} à {startedDate.time}
                  </div>
                </div>
              </div>
            )}
            {completedDate && (
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <div className="h-2 w-2 rounded-full bg-emergency-low" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">Intervention terminée</div>
                  <div className="text-sm text-muted-foreground">
                    {completedDate.date} à {completedDate.time}
                  </div>
                  {getDuration() && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Durée totale: {getDuration()} min
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">{incident.location.address}</p>
            <p className="text-xs text-muted-foreground">
              {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Reporter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Déclarant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">{incident.reporter.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-4 w-4" />
              {incident.reporter.phone}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient */}
      {incident.patient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Patient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium">
                  {incident.patient.name}
                  {incident.patient.age && `, ${incident.patient.age} ans`}
                </div>
                {incident.patient.condition && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {incident.patient.condition}
                  </div>
                )}
              </div>
              {incident.patient.vitalSigns && (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Fréquence cardiaque</div>
                    <div className="font-medium">
                      {incident.patient.vitalSigns.heartRate} bpm
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Tension artérielle</div>
                    <div className="font-medium">
                      {incident.patient.vitalSigns.bloodPressure}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Saturation O₂</div>
                    <div className="font-medium">
                      {incident.patient.vitalSigns.oxygenSaturation}%
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Ambulance */}
      {assignedAmbulance && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Ambulance assignée
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">{assignedAmbulance.name}</span>
                <span className="text-muted-foreground ml-2">
                  ({assignedAmbulance.plateNumber})
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <div>Chauffeur: {assignedAmbulance.crew.driver}</div>
                <div>Médecin: {assignedAmbulance.crew.medic}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

