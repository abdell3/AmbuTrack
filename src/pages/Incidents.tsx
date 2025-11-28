import { useState, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Plus, Download, X } from "lucide-react"
import { IncidentList, IncidentDetails, HistoryFilters, type HistoryFiltersState } from "@/components/history"
import { IncidentForm } from "@/components/incidents/IncidentForm"
import { useHistory } from "@/lib/api/queries"
import type { Incident, EmergencyLevel } from "@/types"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { exportIncidentsToCSV, exportIncidentsToJSON } from "@/lib/utils/export"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Incidents() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showForm, setShowForm] = useState(false)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  // Parse filters from URL
  const filtersFromURL = useMemo<HistoryFiltersState>(() => {
    const filters: HistoryFiltersState = {}
    
    const search = searchParams.get("search")
    if (search) filters.search = search

    const emergencyLevel = searchParams.get("emergencyLevel")
    if (emergencyLevel) {
      filters.emergencyLevel = emergencyLevel.split(",") as EmergencyLevel[]
    }

    const status = searchParams.get("status")
    if (status) {
      filters.status = status.split(",") as Incident["status"][]
    }

    const ambulanceId = searchParams.get("ambulanceId")
    if (ambulanceId) filters.ambulanceId = ambulanceId

    const dateFrom = searchParams.get("dateFrom")
    if (dateFrom) filters.dateFrom = dateFrom

    const dateTo = searchParams.get("dateTo")
    if (dateTo) filters.dateTo = dateTo

    return filters
  }, [searchParams])

  // Convert filters to API format
  const apiFilters = useMemo(() => {
    const apiParams: Record<string, string> = {}
    
    if (filtersFromURL.search) {
      apiParams.search = filtersFromURL.search
    }
    if (filtersFromURL.emergencyLevel && filtersFromURL.emergencyLevel.length > 0) {
      apiParams.emergencyLevel = filtersFromURL.emergencyLevel.join(",")
    }
    if (filtersFromURL.status && filtersFromURL.status.length > 0) {
      apiParams.status = filtersFromURL.status.join(",")
    }
    if (filtersFromURL.ambulanceId) {
      apiParams.ambulanceId = filtersFromURL.ambulanceId
    }
    if (filtersFromURL.dateFrom) {
      apiParams.dateFrom = filtersFromURL.dateFrom
    }
    if (filtersFromURL.dateTo) {
      apiParams.dateTo = filtersFromURL.dateTo
    }

    return apiParams
  }, [filtersFromURL])

  const { data: incidents = [], isLoading } = useHistory(apiFilters)

  // Filter incidents client-side for search
  const filteredIncidents = useMemo(() => {
    if (!filtersFromURL.search) return incidents

    const searchLower = filtersFromURL.search.toLowerCase()
    return incidents.filter(
      (incident) =>
        incident.title.toLowerCase().includes(searchLower) ||
        incident.description.toLowerCase().includes(searchLower) ||
        incident.location.address.toLowerCase().includes(searchLower) ||
        incident.reporter.name.toLowerCase().includes(searchLower) ||
        (incident.patient?.name &&
          incident.patient.name.toLowerCase().includes(searchLower))
    )
  }, [incidents, filtersFromURL.search])

  // Update URL when filters change
  const handleFiltersChange = (newFilters: HistoryFiltersState) => {
    const params = new URLSearchParams()

    if (newFilters.search) params.set("search", newFilters.search)
    if (newFilters.emergencyLevel && newFilters.emergencyLevel.length > 0) {
      params.set("emergencyLevel", newFilters.emergencyLevel.join(","))
    }
    if (newFilters.status && newFilters.status.length > 0) {
      params.set("status", newFilters.status.join(","))
    }
    if (newFilters.ambulanceId) params.set("ambulanceId", newFilters.ambulanceId)
    if (newFilters.dateFrom) params.set("dateFrom", newFilters.dateFrom)
    if (newFilters.dateTo) params.set("dateTo", newFilters.dateTo)

    setSearchParams(params, { replace: true })
  }

  const handleSelectIncident = (incident: Incident) => {
    setSelectedIncident(incident)
    setShowDetails(true)
  }

  const handleExport = (format: "csv" | "json") => {
    if (format === "csv") {
      exportIncidentsToCSV(filteredIncidents, `incidents-${new Date().toISOString().split("T")[0]}.csv`)
    } else {
      exportIncidentsToJSON(filteredIncidents, `incidents-${new Date().toISOString().split("T")[0]}.json`)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Historique des incidents
          </h1>
          <p className="text-muted-foreground mt-2">
            Journal des interventions passées
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("csv")}>
                Exporter en CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("json")}>
                Exporter en JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel incident
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <HistoryFilters
            filters={filtersFromURL}
            onFiltersChange={handleFiltersChange}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Liste des incidents ({filteredIncidents.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IncidentList
                incidents={filteredIncidents}
                loading={isLoading}
                onSelectIncident={handleSelectIncident}
                selectedIncidentId={selectedIncident?.id}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <IncidentForm
            onSuccess={() => {
              setShowForm(false)
            }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedIncident && (
            <IncidentDetails
              incident={selectedIncident}
              onClose={() => {
                setShowDetails(false)
                setSelectedIncident(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
