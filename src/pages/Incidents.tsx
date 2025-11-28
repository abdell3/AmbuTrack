import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Plus, X } from "lucide-react"
import { DataTable } from "@/components/ui/table"
import { StatusBadge } from "@/components/incidents/StatusBadge"
import { IncidentForm } from "@/components/incidents/IncidentForm"
import { DispatchPanel } from "@/components/incidents/DispatchPanel"
import { useIncidents } from "@/lib/api/queries"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setSelectedIncidentId } from "@/store/slices/uiSlice"
import { selectSelectedIncidentId } from "@/store/slices/uiSlice"
import { selectFilteredIncidents } from "@/store/slices/incidentsSlice"
import type { Incident } from "@/types"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function Incidents() {
  const [showForm, setShowForm] = useState(false)
  const { data: incidents = [], isLoading } = useIncidents()
  const filteredIncidents = useAppSelector(selectFilteredIncidents)
  const selectedIncidentId = useAppSelector(selectSelectedIncidentId)
  const dispatch = useAppDispatch()

  const selectedIncident = incidents.find((i) => i.id === selectedIncidentId)

  const handleSelectIncident = (incident: Incident) => {
    dispatch(setSelectedIncidentId(incident.id))
  }

  const handleClosePanel = () => {
    dispatch(setSelectedIncidentId(null))
  }

  const columns = [
    {
      key: "title",
      label: "Titre",
      render: (value: unknown, row: Incident) => (
        <div>
          <div className="font-medium">{row.title}</div>
          <div className="text-xs text-muted-foreground mt-0.5">
            {row.location.address}
          </div>
        </div>
      ),
    },
    {
      key: "emergencyLevel",
      label: "Niveau",
      render: (value: unknown, row: Incident) => {
        const levelLabels: Record<Incident["emergencyLevel"], string> = {
          low: "Faible",
          medium: "Moyenne",
          high: "Élevée",
          critical: "Critique",
        }
        return (
          <Badge
            variant={
              row.emergencyLevel === "low"
                ? "emergencyLow"
                : row.emergencyLevel === "medium"
                ? "emergencyMedium"
                : row.emergencyLevel === "high"
                ? "emergencyHigh"
                : "emergencyCritical"
            }
          >
            {levelLabels[row.emergencyLevel]}
          </Badge>
        )
      },
    },
    {
      key: "status",
      label: "Statut",
      render: (value: unknown, row: Incident) => <StatusBadge status={row.status} />,
    },
    {
      key: "reportedAt",
      label: "Signalé",
      render: (value: unknown) => {
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
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Historique des incidents
          </h1>
          <p className="text-muted-foreground mt-2">
            Consultation et gestion des interventions
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel incident
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Liste des incidents ({filteredIncidents.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <DataTable
              data={filteredIncidents}
              columns={columns}
              loading={isLoading}
              emptyMessage="Aucun incident trouvé"
              ariaLabel="Table des incidents"
              onRowClick={handleSelectIncident}
            />
            {filteredIncidents.length > 0 && (
              <div className="text-sm text-muted-foreground">
                Cliquez sur une ligne pour voir les détails et gérer l'incident
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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

      {/* Dispatch Panel */}
      {selectedIncident && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClosePanel}
            aria-hidden="true"
          />
          <DispatchPanel
            incident={selectedIncident}
            onClose={handleClosePanel}
            onUpdate={() => {
              // Refresh data
            }}
          />
        </>
      )}
    </div>
  )
}
