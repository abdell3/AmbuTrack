import { Badge } from "@/components/ui/badge"
import type { Incident } from "@/types"

interface StatusBadgeProps {
  status: Incident["status"]
  className?: string
}

const statusConfig: Record<
  Incident["status"],
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "emergencyLow" | "emergencyMedium" | "emergencyHigh" | "emergencyCritical" | "statusAvailable" | "statusBusy" | "statusMaintenance" | "statusOffline" }
> = {
  pending: {
    label: "En attente",
    variant: "secondary",
  },
  assigned: {
    label: "Assigné",
    variant: "statusBusy",
  },
  in_progress: {
    label: "En cours",
    variant: "emergencyMedium",
  },
  completed: {
    label: "Terminé",
    variant: "emergencyLow",
  },
  cancelled: {
    label: "Annulé",
    variant: "outline",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  )
}

