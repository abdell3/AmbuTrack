import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
  fullScreen?: boolean
}

export function Loading({ size = "md", className, text, fullScreen = false }: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  const spinner = (
    <Loader2
      className={cn(
        "animate-spin text-primary",
        sizeClasses[size],
        className
      )}
      aria-hidden="true"
    />
  )

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        role="status"
        aria-live="polite"
        aria-label="Chargement en cours"
      >
        <div className="flex flex-col items-center gap-4">
          {spinner}
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-2">
        {spinner}
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    </div>
  )
}

interface LoadingOverlayProps {
  isLoading: boolean
  children: React.ReactNode
  text?: string
}

export function LoadingOverlay({ isLoading, children, text }: LoadingOverlayProps) {
  if (!isLoading) return <>{children}</>

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div
        className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10"
        role="status"
        aria-live="polite"
        aria-label="Chargement en cours"
      >
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          {text && <p className="text-sm text-muted-foreground">{text}</p>}
        </div>
      </div>
    </div>
  )
}

interface LoadingButtonProps {
  isLoading: boolean
  children: React.ReactNode
  className?: string
}

export function LoadingButton({ isLoading, children, className }: LoadingButtonProps) {
  return (
    <div className={cn("relative inline-flex", className)}>
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          role="status"
          aria-live="polite"
        >
          <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />
        </div>
      )}
      <div className={cn(isLoading && "opacity-50")}>{children}</div>
    </div>
  )
}
