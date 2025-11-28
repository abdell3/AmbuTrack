import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm dark:bg-card dark:text-card-foreground",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-xl sm:text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0 sm:p-6 sm:pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-4 pt-0 sm:p-6 sm:pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export interface KPICardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  description?: string
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  icon?: React.ReactNode
  loading?: boolean
  error?: string
}

const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  (
    {
      className,
      title,
      value,
      description,
      trend,
      icon,
      loading = false,
      error,
      ...props
    },
    ref
  ) => {
    if (error) {
      return (
        <Card
          ref={ref}
          className={cn("border-destructive", className)}
          {...props}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon && <div className="h-4 w-4 text-muted-foreground" aria-hidden="true">{icon}</div>}
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-destructive" role="alert" aria-live="polite">
              Erreur
            </div>
            <p className="text-xs text-muted-foreground mt-1">{error}</p>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card
        ref={ref}
        className={cn("w-full", className)}
        {...props}
        aria-label={`${title}: ${value}`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && (
            <div className="h-4 w-4 text-muted-foreground" aria-hidden="true">
              {icon}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center space-x-2" aria-busy="true" aria-live="polite">
              <div className="h-8 w-20 animate-pulse bg-muted rounded" />
              <span className="sr-only">Chargement...</span>
            </div>
          ) : (
            <>
              <div className="text-xl sm:text-2xl font-bold">{value}</div>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              )}
              {trend && (
                <div className="flex items-center mt-2">
                  <span
                    className={cn(
                      "text-xs font-medium",
                      trend.isPositive
                        ? "text-emergency-low"
                        : "text-destructive"
                    )}
                    aria-label={`Tendance ${trend.isPositive ? "positive" : "négative"} de ${Math.abs(trend.value)}%`}
                  >
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    {trend.label}
                  </span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    )
  }
)
KPICard.displayName = "KPICard"

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  KPICard,
}

