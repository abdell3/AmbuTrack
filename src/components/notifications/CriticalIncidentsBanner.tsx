import { CriticalIncidentAlert } from "./CriticalIncidentAlert"
import type { Incident } from "@/types"

interface CriticalIncidentsBannerProps {
  incidents: Incident[]
}

export function CriticalIncidentsBanner({ incidents }: CriticalIncidentsBannerProps) {
  if (incidents.length === 0) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 space-y-2">
      {incidents.map((incident) => (
        <CriticalIncidentAlert key={incident.id} incident={incident} />
      ))}
    </div>
  )
}

