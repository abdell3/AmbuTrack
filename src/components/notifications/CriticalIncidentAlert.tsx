import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/contexts/NotificationContext"
import type { Incident } from "@/types"
import { AlertTriangle, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

interface CriticalIncidentAlertProps {
  incident: Incident
  onDismiss?: () => void
  className?: string
}

export function CriticalIncidentAlert({
  incident,
  onDismiss,
  className,
}: CriticalIncidentAlertProps) {
  const [isVisible, setIsVisible] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Auto-dismiss after 30 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      onDismiss?.()
    }, 30000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!isVisible) return null

  const handleViewIncident = () => {
    navigate(`/incidents?incidentId=${incident.id}`)
  }

  return (
    <Alert
      variant="destructive"
      className={cn(
        "animate-pulse border-emergency-critical/50 bg-emergency-critical/10 ring-2 ring-emergency-critical/50",
        className
      )}
      role="alert"
      aria-live="assertive"
    >
      <AlertTriangle className="h-5 w-5 text-emergency-critical animate-pulse" />
      <div className="flex-1">
        <AlertTitle className="text-emergency-critical font-bold">
          🚨 Incident Critique
        </AlertTitle>
        <AlertDescription className="mt-2">
          <div className="font-semibold mb-1">{incident.title}</div>
          <div className="text-sm">{incident.description}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {incident.location.address}
          </div>
        </AlertDescription>
        <div className="flex gap-2 mt-3">
          <Button
            variant="default"
            size="sm"
            onClick={handleViewIncident}
            className="bg-emergency-critical hover:bg-emergency-critical/90"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Voir l'incident
          </Button>
          {onDismiss && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false)
                onDismiss()
              }}
            >
              <X className="mr-2 h-4 w-4" />
              Ignorer
            </Button>
          )}
        </div>
      </div>
    </Alert>
  )
}
