import { Badge } from "@/components/ui/badge"
import type { AmbulanceStatus } from "@/types"

interface AmbulanceStatusBadgeProps {
  status: AmbulanceStatus
  className?: string
}

const statusConfig: Record<
  AmbulanceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "statusAvailable" | "statusBusy" | "statusMaintenance" | "statusOffline" }
> = {
  available: {
    label: "En service",
    variant: "statusAvailable",
  },
  busy: {
    label: "Pause",
    variant: "statusBusy",
  },
  maintenance: {
    label: "Maintenance",
    variant: "statusMaintenance",
  },
  offline: {
    label: "Hors ligne",
    variant: "statusOffline",
  },
}

export function AmbulanceStatusBadge({ status, className }: AmbulanceStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

