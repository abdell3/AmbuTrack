import { cn } from "@/lib/utils"
import type { ComponentType } from "react"
import type { LucideProps } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  label?: string
  icon: ComponentType<LucideProps>
  trend?: {
    value: string
    isPositive: boolean
    period: string
  }
  className?: string
}

export function KPICard({
  title,
  value,
  label,
  icon: Icon,
  trend,
  className,
}: KPICardProps) {
  return (
    <div className={cn(
      "bg-white rounded-lg border border-gray-200 shadow-sm p-6",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <Icon className="w-5 h-5 text-gray-400" />
      </div>
      <div className="space-y-2">
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        {label && (
          <p className="text-sm text-gray-600">{label}</p>
        )}
        {trend && (
          <div className="flex items-center gap-1 text-sm">
            <span
              className={cn(
                "font-medium",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}
            >
              {trend.isPositive ? "▲" : "▼"} {trend.value}
            </span>
            <span className="text-gray-500">vs {trend.period}</span>
          </div>
        )}
      </div>
    </div>
  )
}

