import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck } from "lucide-react"

export function Fleet() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestion de la flotte</h1>
        <p className="text-muted-foreground mt-2">
          Suivi et gestion des ambulances
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Liste des ambulances
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Liste des ambulances à venir
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

