import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

export function Map() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Carte de dispatch</h1>
        <p className="text-muted-foreground mt-2">
          Visualisation en temps réel des interventions et des ambulances
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Carte interactive
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] bg-muted rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">
              La carte sera intégrée ici avec React-Leaflet
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

