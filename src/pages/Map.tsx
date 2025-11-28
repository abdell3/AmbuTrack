import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Loader2 } from "lucide-react"
import { MapContainer } from "@/components/map/MapContainer"
import { useAmbulances } from "@/lib/api/queries"
import { useIncidents } from "@/lib/api/queries"
import { useAppSelector } from "@/store/hooks"
import {
  selectFilteredAmbulancesWithUIFilters,
} from "@/store/slices/ambulancesSlice"
import {
  selectFilteredIncidentsWithUIFilters,
} from "@/store/slices/incidentsSlice"

export function Map() {
  const { data: ambulances = [], isLoading: loadingAmbulances } = useAmbulances()
  const { data: incidents = [], isLoading: loadingIncidents } = useIncidents()

  // Get filtered data from Redux using UI filters
  const filteredAmbulances = useAppSelector(selectFilteredAmbulancesWithUIFilters)
  const filteredIncidents = useAppSelector(selectFilteredIncidentsWithUIFilters)

  const isLoading = loadingAmbulances || loadingIncidents

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Carte de dispatch</h1>
        <p className="text-muted-foreground mt-2">
          Visualisation en temps réel des interventions et des ambulances
        </p>
      </div>

      <Card className="flex-1 flex flex-col min-h-[600px]">
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
        <CardContent className="flex-1 p-0 overflow-hidden">
          {isLoading ? (
            <div className="h-full flex items-center justify-center min-h-[500px]">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  Chargement de la carte...
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full w-full relative min-h-[500px]">
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
    </div>
  )
}

