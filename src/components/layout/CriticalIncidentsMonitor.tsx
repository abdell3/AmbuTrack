import { useEffect } from "react"
import { useIncidents } from "@/lib/api/queries"
import { useNotifications } from "@/contexts/NotificationContext"
import { CriticalIncidentsBanner } from "@/components/notifications"

export function CriticalIncidentsMonitor() {
  const { data: incidents = [] } = useIncidents()
  const { showCriticalIncident } = useNotifications()

  useEffect(() => {
    // Monitor for new critical incidents
    const criticalIncidents = incidents.filter(
      (incident) =>
        incident.emergencyLevel === "critical" &&
        incident.status !== "completed" &&
        incident.status !== "cancelled"
    )

    criticalIncidents.forEach((incident) => {
      // Check if incident was recently created (within last 5 seconds)
      const reportedAt = new Date(incident.reportedAt)
      const now = new Date()
      const diffSeconds = (now.getTime() - reportedAt.getTime()) / 1000

      if (diffSeconds < 5) {
        showCriticalIncident(incident)
      }
    })
  }, [incidents, showCriticalIncident])

  const criticalIncidents = incidents.filter(
    (incident) =>
      incident.emergencyLevel === "critical" &&
      incident.status !== "completed" &&
      incident.status !== "cancelled"
  )

  return <CriticalIncidentsBanner incidents={criticalIncidents} />
}

