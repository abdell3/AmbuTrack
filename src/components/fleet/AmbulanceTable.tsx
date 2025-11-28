import { useState, useMemo } from "react"
import { DataTable, type SortableColumn } from "@/components/ui/table"
import { AmbulanceStatusBadge } from "./AmbulanceStatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SelectField, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAmbulances } from "@/lib/api/queries"
import { useAppSelector } from "@/store/hooks"
import { selectFilteredAmbulancesWithUIFilters } from "@/store/slices/ambulancesSlice"
import { setAmbulanceFilters, clearAmbulanceFilters } from "@/store/slices/uiSlice"
import { useAppDispatch } from "@/store/hooks"
import type { Ambulance, AmbulanceStatus } from "@/types"
import { MoreVertical, Edit2, MapPin, Users, Wrench } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface AmbulanceTableProps {
  onEdit?: (ambulance: Ambulance) => void
  onStatusChange?: (ambulance: Ambulance, newStatus: AmbulanceStatus) => void
}

export function AmbulanceTable({
  onEdit,
  onStatusChange,
}: AmbulanceTableProps) {
  const { data: ambulances = [], isLoading } = useAmbulances()
  const filteredAmbulances = useAppSelector(selectFilteredAmbulancesWithUIFilters)
  const dispatch = useAppDispatch()
  const [sortKey, setSortKey] = useState<keyof Ambulance | string | undefined>()
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null)
  const [statusFilter, setStatusFilter] = useState<AmbulanceStatus[]>([])
  const [searchValue, setSearchValue] = useState("")

  const handleSort = (key: keyof Ambulance | string, direction: "asc" | "desc" | null) => {
    setSortKey(key)
    setSortDirection(direction)
  }

  const handleStatusFilterChange = (status: AmbulanceStatus) => {
    const newFilters = statusFilter.includes(status)
      ? statusFilter.filter((s) => s !== status)
      : [...statusFilter, status]
    setStatusFilter(newFilters)
    dispatch(
      setAmbulanceFilters({
        status: newFilters.length > 0 ? newFilters : undefined,
      })
    )
  }

  const handleSearchChange = (value: string) => {
    setSearchValue(value)
    dispatch(setAmbulanceFilters({ search: value || undefined }))
  }

  const handleClearFilters = () => {
    setStatusFilter([])
    setSearchValue("")
    dispatch(clearAmbulanceFilters())
  }

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return filteredAmbulances

    return [...filteredAmbulances].sort((a, b) => {
      const aValue = a[sortKey as keyof Ambulance]
      const bValue = b[sortKey as keyof Ambulance]

      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue
      }

      return 0
    })
  }, [filteredAmbulances, sortKey, sortDirection])

  const columns: SortableColumn<Ambulance>[] = [
    {
      key: "name",
      label: "Nom",
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.plateNumber}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (value, row) => <AmbulanceStatusBadge status={row.status} />,
    },
    {
      key: "crew",
      label: "Équipage",
      sortable: false,
      render: (value, row) => (
        <div className="text-sm space-y-0.5">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 text-muted-foreground" />
            <span>{row.crew.driver}</span>
          </div>
          <div className="text-xs text-muted-foreground ml-4">
            {row.crew.medic}
          </div>
        </div>
      ),
    },
    {
      key: "equipment",
      label: "Équipements",
      sortable: false,
      render: (value, row) => (
        <div className="flex flex-wrap gap-1">
          {row.equipment && row.equipment.length > 0 ? (
            row.equipment.slice(0, 2).map((eq, idx) => (
              <Badge key={idx} variant="outline" className="text-xs">
                {eq}
              </Badge>
            ))
          ) : (
            <span className="text-xs text-muted-foreground">Aucun</span>
          )}
          {row.equipment && row.equipment.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{row.equipment.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "location",
      label: "Position",
      sortable: false,
      render: (value, row) => (
        <div className="text-sm flex items-center gap-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-muted-foreground">
            {row.location.lat.toFixed(3)}, {row.location.lng.toFixed(3)}
          </span>
        </div>
      ),
    },
    {
      key: "lastUpdate",
      label: "Dernière mise à jour",
      sortable: true,
      render: (value) => {
        const date = new Date(value as string)
        return (
          <div className="text-sm">
            <div>{date.toLocaleDateString("fr-FR")}</div>
            <div className="text-xs text-muted-foreground">
              {date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        )
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value, row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Menu actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(row)}>
              <Edit2 className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            {row.status !== "available" && (
              <DropdownMenuItem
                onClick={() => onStatusChange?.(row, "available")}
              >
                <Wrench className="mr-2 h-4 w-4" />
                Mettre en service
              </DropdownMenuItem>
            )}
            {row.status !== "busy" && (
              <DropdownMenuItem onClick={() => onStatusChange?.(row, "busy")}>
                <Wrench className="mr-2 h-4 w-4" />
                Mettre en pause
              </DropdownMenuItem>
            )}
            {row.status !== "maintenance" && (
              <DropdownMenuItem
                onClick={() => onStatusChange?.(row, "maintenance")}
              >
                <Wrench className="mr-2 h-4 w-4" />
                Mettre en maintenance
              </DropdownMenuItem>
            )}
            {row.status !== "offline" && (
              <DropdownMenuItem
                onClick={() => onStatusChange?.(row, "offline")}
              >
                <Wrench className="mr-2 h-4 w-4" />
                Mettre hors ligne
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const hasActiveFilters = statusFilter.length > 0 || searchValue.length > 0

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher par nom, plaque, équipage..."
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-64">
          <SelectField
            label="Filtrer par statut"
            value={statusFilter.join(",")}
            onValueChange={(value) => {
              if (value) {
                const statuses = value.split(",") as AmbulanceStatus[]
                setStatusFilter(statuses)
                dispatch(setAmbulanceFilters({ status: statuses }))
              } else {
                handleClearFilters()
              }
            }}
            placeholder="Tous les statuts"
          >
            <SelectItem value="available">En service</SelectItem>
            <SelectItem value="busy">Pause</SelectItem>
            <SelectItem value="maintenance">Maintenance</SelectItem>
            <SelectItem value="offline">Hors ligne</SelectItem>
          </SelectField>
        </div>
        {hasActiveFilters && (
          <Button variant="secondary" onClick={handleClearFilters} size="sm">
            Réinitialiser
          </Button>
        )}
      </div>

      {/* Status Filter Chips */}
      {statusFilter.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {statusFilter.map((status) => (
            <Badge
              key={status}
              variant="outline"
              className="cursor-pointer"
              onClick={() => handleStatusFilterChange(status)}
            >
              <AmbulanceStatusBadge status={status} />
              <span className="ml-1">×</span>
            </Badge>
          ))}
        </div>
      )}

      {/* Table */}
      <DataTable
        data={sortedData}
        columns={columns}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={handleSort}
        loading={isLoading}
        emptyMessage="Aucune ambulance trouvée"
        ariaLabel="Table des ambulances"
      />
    </div>
  )
}

