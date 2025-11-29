import { KPIGrid, ActivityFeed, PerformanceChart } from "@/components/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de l'activité en temps réel</p>
      </div>

      {/* KPIs Grid */}
      <KPIGrid />

      {/* Charts and Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card className="bg-white border border-gray-200 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Activité récente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityFeed />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
