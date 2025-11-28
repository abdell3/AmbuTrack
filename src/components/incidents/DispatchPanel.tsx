import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "./StatusBadge"
import { AssignmentInterface } from "./AssignmentInterface"
import { useUpdateIncident } from "@/lib/api/queries"
import type { Incident } from "@/types"
import {
  X,
  AlertTriangle,
  MapPin,
  Clock,
  User,
  Phone,
  Loader2,
  CheckCircle,
  PlayCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DispatchPanelProps {
  incident: Incident | null
  onClose: () => void
  onUpdate?: () => void
}

export function DispatchPanel({
  incident,
  onClose,
  onUpdate,
}: DispatchPanelProps) {
  const updateMutation = useUpdateIncident()
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null)

  if (!incident) {
    return null
  }

  const isCritical = incident.emergencyLevel === "critical"
  const canStart = incident.status === "assigned"
  const canComplete =
    incident.status === "in_progress" || incident.status === "assigned"

  const handleStatusUpdate = async (newStatus: Incident["status"]) => {
    setUpdatingStatus(newStatus)
    try {
      await updateMutation.mutateAsync({
        id: incident.id,
        status: newStatus,
        ...(newStatus === "in_progress" && !incident.startedAt
          ? { startedAt: new Date().toISOString() }
          : {}),
        ...(newStatus === "completed" && !incident.completedAt
          ? { completedAt: new Date().toISOString() }
          : {}),
      })
      onUpdate?.()
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setUpdatingStatus(null)
    }
  }

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "N/A"
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

  const levelLabels: Record<Incident["emergencyLevel"], string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Élevée",
    critical: "Critique",
  }

  return (
    <div className="fixed right-0 top-0 h-full w-full sm:max-w-lg bg-background border-l border-border shadow-xl z-50 overflow-y-auto">
      <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
        <h2 className="text-xl font-semibold">Gestion d'incident</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          aria-label="Fermer le panneau"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        {/* Critical Alert */}
        {isCritical && (
          <Alert variant="destructive" className="animate-pulse">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="font-semibold">
              Incident critique - Intervention urgente requise !
            </AlertDescription>
          </Alert>
        )}

        {/* Incident Details */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{incident.title}</CardTitle>
              <StatusBadge status={incident.status} />
            </div>
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
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                {incident.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                Localisation
              </h3>
              <p className="text-sm text-muted-foreground">
                {incident.location.address}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-2 flex items-center gap-1">
                <User className="h-4 w-4" />
                Déclarant
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>{incident.reporter.name}</div>
                <div className="flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  {incident.reporter.phone}
                </div>
              </div>
            </div>

            {incident.patient && (
              <div>
                <h3 className="text-sm font-semibold mb-2">Patient</h3>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>
                    {incident.patient.name}
                    {incident.patient.age && `, ${incident.patient.age} ans`}
                  </div>
                  <div>{incident.patient.condition}</div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <div className="text-xs text-muted-foreground">Signalé</div>
                <div className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {getTimeAgo(incident.reportedAt)}
                </div>
              </div>
              {incident.assignedAt && (
                <div>
                  <div className="text-xs text-muted-foreground">Assigné</div>
                  <div className="text-sm font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {getTimeAgo(incident.assignedAt)}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Assignment Interface */}
        {incident.status === "pending" && (
          <AssignmentInterface
            incident={incident}
            onAssigned={() => onUpdate?.()}
          />
        )}

        {/* Status Update Actions */}
        {incident.status !== "pending" && (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {canStart && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleStatusUpdate("in_progress")}
                  disabled={updatingStatus !== null || updateMutation.isPending}
                >
                  {updatingStatus === "in_progress" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Démarrer l'intervention
                    </>
                  )}
                </Button>
              )}

              {canComplete && (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => handleStatusUpdate("completed")}
                  disabled={updatingStatus !== null || updateMutation.isPending}
                >
                  {updatingStatus === "completed" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marquer comme terminé
                    </>
                  )}
                </Button>
              )}

              {incident.status === "in_progress" && (
                <p className="text-xs text-muted-foreground text-center">
                  Intervention en cours depuis {getTimeAgo(incident.startedAt)}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

