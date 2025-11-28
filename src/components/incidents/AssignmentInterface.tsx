import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAmbulances } from "@/lib/api/queries"
import { useAssignAmbulance } from "@/lib/api/queries"
import { calculateDistance, calculateETA } from "@/lib/utils/geocoding"
import type { Incident } from "@/types"
import { Truck, MapPin, Clock, Loader2, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface AssignmentInterfaceProps {
  incident: Incident
  onAssigned?: () => void
}

interface AmbulanceWithDistance {
  id: string
  name: string
  status: string
  location: { lat: number; lng: number }
  distance: number
  eta: number
  plateNumber: string
  crew: { driver: string; medic: string }
}

export function AssignmentInterface({
  incident,
  onAssigned,
}: AssignmentInterfaceProps) {
  const { data: ambulances = [] } = useAmbulances()
  const assignMutation = useAssignAmbulance()
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string | null>(
    null
  )

  // Calculate distances and ETAs for available ambulances
  const availableAmbulances = useMemo(() => {
    return ambulances
      .filter((ambulance) => ambulance.status === "available")
      .map((ambulance) => {
        const distance = calculateDistance(
          incident.location.lat,
          incident.location.lng,
          ambulance.location.lat,
          ambulance.location.lng
        )
        const eta = calculateETA(distance)

        return {
          ...ambulance,
          distance: Math.round(distance * 10) / 10, // Round to 1 decimal
          eta,
        }
      })
      .sort((a, b) => a.distance - b.distance) // Sort by distance
  }, [ambulances, incident.location])

  const handleAssign = async (ambulanceId: string) => {
    try {
      await assignMutation.mutateAsync({
        incidentId: incident.id,
        ambulanceId,
      })
      setSelectedAmbulanceId(ambulanceId)
      onAssigned?.()
    } catch (error) {
      console.error("Error assigning ambulance:", error)
    }
  }

  if (incident.assignedAmbulanceId) {
    const assignedAmbulance = ambulances.find(
      (a) => a.id === incident.assignedAmbulanceId
    )

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emergency-low" />
            Ambulance assignée
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignedAmbulance ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">{assignedAmbulance.name}</span>
                <Badge variant="statusAvailable">Disponible</Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Plaque: {assignedAmbulance.plateNumber}</div>
                <div>Chauffeur: {assignedAmbulance.crew.driver}</div>
                <div>Médecin: {assignedAmbulance.crew.medic}</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Ambulance ID: {incident.assignedAmbulanceId}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  if (availableAmbulances.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Assignation d'ambulance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Aucune ambulance disponible pour le moment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Assignation d'ambulance
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Sélectionnez une ambulance disponible
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {availableAmbulances.map((ambulance) => {
            const isAssigning =
              assignMutation.isPending && selectedAmbulanceId === ambulance.id

            return (
              <div
                key={ambulance.id}
                className={cn(
                  "border rounded-lg p-3 transition-colors",
                  selectedAmbulanceId === ambulance.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-medium">{ambulance.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {ambulance.plateNumber}
                    </div>
                  </div>
                  <Badge variant="statusAvailable">Disponible</Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{ambulance.distance} km</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>~{ambulance.eta} min</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground mb-3">
                  <div>Chauffeur: {ambulance.crew.driver}</div>
                  <div>Médecin: {ambulance.crew.medic}</div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleAssign(ambulance.id)}
                  disabled={isAssigning || assignMutation.isPending}
                  className="w-full"
                >
                  {isAssigning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Assignation...
                    </>
                  ) : (
                    "Assigner"
                  )}
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

