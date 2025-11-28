import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        // Statuts d'urgence
        emergencyLow: "border-transparent bg-emergency-low/10 text-emergency-low",
        emergencyMedium: "border-transparent bg-emergency-medium/10 text-emergency-medium",
        emergencyHigh: "border-transparent bg-emergency-high/10 text-emergency-high",
        emergencyCritical: "border-transparent bg-emergency-critical/10 text-emergency-critical",
        // Statuts ambulances
        statusAvailable: "border-transparent bg-status-available/10 text-status-available",
        statusBusy: "border-transparent bg-status-busy/10 text-status-busy",
        statusMaintenance: "border-transparent bg-status-maintenance/10 text-status-maintenance",
        statusOffline: "border-transparent bg-status-offline/10 text-status-offline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      role="status"
      {...props} 
    />
  )
}

export { Badge, badgeVariants }

