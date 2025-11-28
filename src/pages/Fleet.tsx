import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, Plus } from "lucide-react"
import { AmbulanceTable, AddAmbulanceDialog } from "@/components/fleet"
import { useUpdateAmbulanceStatus, useUpdateAmbulance, useDeleteAmbulance } from "@/lib/api/queries"
import { useAmbulances } from "@/lib/api/queries"
import type { Ambulance, AmbulanceStatus } from "@/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectField, SelectItem } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { Loader2 } from "lucide-react"

interface EditAmbulanceForm {
  name: string
  plateNumber: string
  driver: string
  medic: string
  equipment: string[]
}

export function Fleet() {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [editingAmbulance, setEditingAmbulance] = useState<Ambulance | null>(null)
  const { data: ambulances = [] } = useAmbulances()
  const updateStatusMutation = useUpdateAmbulanceStatus()
  const updateMutation = useUpdateAmbulance()
  const deleteMutation = useDeleteAmbulance()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<EditAmbulanceForm>({
    defaultValues: {
      name: "",
      plateNumber: "",
      driver: "",
      medic: "",
      equipment: [],
    },
  })

  const handleEdit = (ambulance: Ambulance) => {
    setEditingAmbulance(ambulance)
    setValue("name", ambulance.name)
    setValue("plateNumber", ambulance.plateNumber)
    setValue("driver", ambulance.crew.driver)
    setValue("medic", ambulance.crew.medic)
    setValue("equipment", ambulance.equipment || [])
  }

  const handleStatusChange = async (
    ambulance: Ambulance,
    newStatus: AmbulanceStatus
  ) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: ambulance.id,
        status: newStatus,
      })
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const handleUpdate = async (data: EditAmbulanceForm) => {
    if (!editingAmbulance) return

    try {
      await updateMutation.mutateAsync({
        id: editingAmbulance.id,
        updates: {
          name: data.name,
          plateNumber: data.plateNumber,
          crew: {
            driver: data.driver,
            medic: data.medic,
          },
          equipment: data.equipment,
        },
      })
      setEditingAmbulance(null)
      reset()
    } catch (error) {
      console.error("Error updating ambulance:", error)
    }
  }

  const handleDelete = async (ambulance: Ambulance) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir retirer l'ambulance ${ambulance.name} de la flotte ?`
      )
    ) {
      return
    }

    try {
      await deleteMutation.mutateAsync(ambulance.id)
    } catch (error) {
      console.error("Error deleting ambulance:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion de la flotte</h1>
          <p className="text-muted-foreground mt-2">
            Suivi et gestion des ambulances
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter une ambulance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Liste des ambulances ({ambulances.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AmbulanceTable
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>

      {/* Add Dialog */}
      <AddAmbulanceDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={() => {
          setShowAddDialog(false)
        }}
      />

      {/* Edit Dialog */}
      <Dialog
        open={!!editingAmbulance}
        onOpenChange={(open) => !open && setEditingAmbulance(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l'ambulance</DialogTitle>
          </DialogHeader>

          {editingAmbulance && (
            <form onSubmit={handleSubmit(handleUpdate)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="edit-name">Nom</Label>
                  <Input
                    id="edit-name"
                    {...register("name")}
                    placeholder="Ex: AMB-001"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-plate">Numéro de plaque</Label>
                  <Input
                    id="edit-plate"
                    {...register("plateNumber")}
                    placeholder="Ex: 75-AMB-001"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="edit-driver">Chauffeur</Label>
                  <Input
                    id="edit-driver"
                    {...register("driver")}
                    placeholder="Nom du chauffeur"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-medic">Médecin</Label>
                  <Input
                    id="edit-medic"
                    {...register("medic")}
                    placeholder="Nom du médecin"
                  />
                </div>
              </div>

              <div>
                <Label>Équipements</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {watch("equipment")?.map((eq, idx) => (
                    <div
                      key={idx}
                      className="px-2 py-1 bg-muted rounded text-sm"
                    >
                      {eq}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Modification des équipements à venir
                </p>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleDelete(editingAmbulance)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Suppression...
                    </>
                  ) : (
                    "Retirer de la flotte"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditingAmbulance(null)}
                >
                  Annuler
                </Button>
                <Button type="submit" disabled={isSubmitting || updateMutation.isPending}>
                  {isSubmitting || updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    "Enregistrer"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
