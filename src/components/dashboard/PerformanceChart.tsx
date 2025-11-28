import { useMemo } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useIncidents } from "@/lib/api/queries"
import { Loader2 } from "lucide-react"

interface ChartDataPoint {
  hour: string
  incidents: number
  completed: number
}

export function PerformanceChart() {
  const { data: incidents = [], isLoading } = useIncidents()

  const chartData = useMemo(() => {
    // Generate data for the last 24 hours
    const hours: ChartDataPoint[] = []
    const now = new Date()

    for (let i = 23; i >= 0; i--) {
      const hourDate = new Date(now)
      hourDate.setHours(now.getHours() - i, 0, 0, 0)
      const hourLabel = hourDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })

      // Count incidents reported in this hour
      const hourStart = new Date(hourDate)
      const hourEnd = new Date(hourDate)
      hourEnd.setHours(hourEnd.getHours() + 1)

      const incidentsInHour = incidents.filter((incident) => {
        const reportedAt = new Date(incident.reportedAt)
        return reportedAt >= hourStart && reportedAt < hourEnd
      }).length

      const completedInHour = incidents.filter((incident) => {
        if (incident.status !== "completed" || !incident.completedAt) return false
        const completedAt = new Date(incident.completedAt)
        return completedAt >= hourStart && completedAt < hourEnd
      }).length

      hours.push({
        hour: hourLabel,
        incidents: incidentsInHour,
        completed: completedInHour,
      })
    }

    return hours
  }, [incidents])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance horaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Chargement...
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance horaire</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Volume d'incidents par heure (24 dernières heures)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="hour"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="incidents"
              stroke="#0ea5e9"
              strokeWidth={2}
              name="Incidents signalés"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#10b981"
              strokeWidth={2}
              name="Incidents terminés"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

