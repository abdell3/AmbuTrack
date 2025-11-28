import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useActivity } from "@/lib/api/queries"
import { Loader2, AlertCircle, Truck, CheckCircle, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityItem {
  id: string
  type: string
  description: string
  timestamp: string
  incidentId?: string
  ambulanceId?: string
  userId?: string
  metadata?: Record<string, unknown>
}

const activityIcons: Record<string, React.ReactNode> = {
  incident_created: <AlertCircle className="h-4 w-4 text-emergency-high" />,
  ambulance_assigned: <Truck className="h-4 w-4 text-primary" />,
  incident_started: <AlertCircle className="h-4 w-4 text-emergency-medium" />,
  incident_completed: <CheckCircle className="h-4 w-4 text-emergency-low" />,
  ambulance_status_changed: <Truck className="h-4 w-4 text-muted-foreground" />,
}

const activityColors: Record<string, string> = {
  incident_created: "border-l-emergency-high",
  ambulance_assigned: "border-l-primary",
  incident_started: "border-l-emergency-medium",
  incident_completed: "border-l-emergency-low",
  ambulance_status_changed: "border-l-muted",
}

export function ActivityFeed() {
  const { data: activities = [], isLoading, error } = useActivity(10)

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="ml-2 text-sm text-muted-foreground">
              Chargement...
            </span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-sm text-destructive">
            Erreur lors du chargement de l'activité
          </div>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            Aucune activité récente
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {activities.map((activity: ActivityItem) => (
            <div
              key={activity.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border-l-4 bg-muted/30 transition-colors hover:bg-muted/50",
                activityColors[activity.type] || "border-l-muted"
              )}
            >
              <div className="mt-0.5 flex-shrink-0">
                {activityIcons[activity.type] || (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatTime(activity.timestamp)}
                  </span>
                  {activity.incidentId && (
                    <Badge variant="outline" className="text-xs">
                      {activity.incidentId}
                    </Badge>
                  )}
                  {activity.ambulanceId && (
                    <Badge variant="outline" className="text-xs">
                      {activity.ambulanceId}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

