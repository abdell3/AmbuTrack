import { Alert, AlertDescription, AlertTitle } from "./alert"
import { AlertCircle, X } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  className?: string
  variant?: "default" | "destructive" | "warning"
}

export function ErrorMessage({
  title = "Erreur",
  message,
  onRetry,
  onDismiss,
  className,
  variant = "destructive",
}: ErrorMessageProps) {
  return (
    <Alert
      variant={variant}
      className={cn("relative", className)}
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-4 w-4" aria-hidden="true" />
      <div className="flex-1">
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
        {onRetry && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="mt-3"
          >
            Réessayer
          </Button>
        )}
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="absolute right-2 top-2 h-6 w-6"
          aria-label="Fermer le message d'erreur"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </Alert>
  )
}

interface InlineErrorProps {
  message: string
  className?: string
}

export function InlineError({ message, className }: InlineErrorProps) {
  return (
    <p
      className={cn(
        "text-sm text-destructive mt-1.5 flex items-center gap-1",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-3 w-3" aria-hidden="true" />
      {message}
    </p>
  )
}
