import { KPIGrid, ActivityFeed, PerformanceChart } from "@/components/dashboard"

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de l'activité en temps réel
        </p>
      </div>

      {/* KPIs Grid */}
      <KPIGrid />

      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  )
}

