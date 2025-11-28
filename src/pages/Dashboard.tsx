import { Card, CardContent, CardHeader, CardTitle, KPICard } from "@/components/ui/card"
import { Activity, AlertTriangle, Truck, Clock } from "lucide-react"

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de l'activité en temps réel
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="Incidents actifs"
          value={12}
          description="En cours de traitement"
          trend={{ value: 5, label: "vs hier", isPositive: false }}
          icon={<AlertTriangle className="h-4 w-4" />}
        />
        <KPICard
          title="Ambulances disponibles"
          value={8}
          description="Sur 15 au total"
          trend={{ value: 2, label: "vs hier", isPositive: true }}
          icon={<Truck className="h-4 w-4" />}
        />
        <KPICard
          title="Temps moyen de réponse"
          value="4m 32s"
          description="Moyenne sur 24h"
          trend={{ value: 8, label: "vs hier", isPositive: true }}
          icon={<Clock className="h-4 w-4" />}
        />
        <KPICard
          title="Activité totale"
          value={156}
          description="Interventions aujourd'hui"
          trend={{ value: 12, label: "vs hier", isPositive: true }}
          icon={<Activity className="h-4 w-4" />}
        />
      </div>

      {/* Additional content */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Aucune activité récente à afficher
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Statistiques</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Statistiques à venir
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

