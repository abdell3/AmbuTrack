import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Loader2, Plus } from "lucide-react"
import { MapContainer } from "@/components/map/MapContainer"
import { useAmbulances } from "@/lib/api/queries"
import { useIncidents } from "@/lib/api/queries"
import { IncidentForm } from "@/components/incidents/IncidentForm"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function Map() {
  const { data: ambulances = [], isLoading: loadingAmbulances } = useAmbulances()
  const { data: incidents = [], isLoading: loadingIncidents } = useIncidents()
  const [showForm, setShowForm] = useState(false)

  const isLoading = loadingAmbulances || loadingIncidents

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Carte de dispatch</h1>
          <p className="text-muted-foreground mt-2">
            Visualisation en temps réel des interventions et des ambulances
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel incident
        </Button>
      </div>

      <Card className="flex flex-col" style={{ height: "calc(100vh - 280px)", minHeight: "600px" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Carte interactive
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin ml-2" />
            )}
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>
              {ambulances.length} ambulance
              {ambulances.length > 1 ? "s" : ""}
            </span>
            <span>
              {incidents.length} incident
              {incidents.length > 1 ? "s" : ""}
            </span>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Chargement de la carte...
                </p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 w-full h-full">
              <MapContainer
                ambulances={ambulances}
                incidents={incidents}
                showAmbulances={true}
                showIncidents={true}
                className="rounded-b-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <IncidentForm
            onSuccess={() => {
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

