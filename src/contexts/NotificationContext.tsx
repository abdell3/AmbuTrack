import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { useToast } from "@/hooks/use-toast"
import type { Incident } from "@/types"

export type NotificationType = "success" | "error" | "warning" | "info" | "critical"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  duration?: number
  incident?: Incident
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, "id">) => void
  showSuccess: (title: string, message?: string) => void
  showError: (title: string, message?: string) => void
  showWarning: (title: string, message?: string) => void
  showInfo: (title: string, message?: string) => void
  showCriticalIncident: (incident: Incident) => void
  clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
  const [criticalIncidents, setCriticalIncidents] = useState<Set<string>>(new Set())

  const showNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      const variant =
        notification.type === "success"
          ? "success"
          : notification.type === "error"
          ? "error"
          : notification.type === "warning"
          ? "warning"
          : notification.type === "critical"
          ? "critical"
          : "info"

      toast({
        variant,
        title: notification.title,
        description: notification.message,
        duration: notification.duration || (notification.type === "critical" ? 10000 : 5000),
      })
    },
    [toast]
  )

  const showSuccess = useCallback(
    (title: string, message?: string) => {
      showNotification({ type: "success", title, message })
    },
    [showNotification]
  )

  const showError = useCallback(
    (title: string, message?: string) => {
      showNotification({ type: "error", title, message })
    },
    [showNotification]
  )

  const showWarning = useCallback(
    (title: string, message?: string) => {
      showNotification({ type: "warning", title, message })
    },
    [showNotification]
  )

  const showInfo = useCallback(
    (title: string, message?: string) => {
      showNotification({ type: "info", title, message })
    },
    [showNotification]
  )

  const showCriticalIncident = useCallback(
    (incident: Incident) => {
      // Avoid duplicate notifications for the same incident
      if (criticalIncidents.has(incident.id)) {
        return
      }

      setCriticalIncidents((prev) => new Set(prev).add(incident.id))

      showNotification({
        type: "critical",
        title: "🚨 Incident critique détecté",
        message: `${incident.title} - Intervention urgente requise !`,
        duration: 10000,
        incident,
      })

      // Remove from set after notification duration
      setTimeout(() => {
        setCriticalIncidents((prev) => {
          const next = new Set(prev)
          next.delete(incident.id)
          return next
        })
      }, 10000)
    },
    [showNotification, criticalIncidents]
  )

  const clearNotifications = useCallback(() => {
    // Toast dismiss is handled by the toast component
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        showCriticalIncident,
        clearNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}

