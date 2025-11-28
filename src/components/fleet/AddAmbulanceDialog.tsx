import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { createAmbulanceSchema } from "@/types/schemas"
import type { z } from "zod"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SelectField, SelectItem } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useCreateAmbulance } from "@/lib/api/queries"
import { Loader2, AlertCircle, Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

type CreateAmbulanceForm = z.infer<typeof createAmbulanceSchema>

interface AddAmbulanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddAmbulanceDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddAmbulanceDialogProps) {
  const createMutation = useCreateAmbulance()
  const [equipmentItems, setEquipmentItems] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CreateAmbulanceForm>({
    resolver: zodResolver(createAmbulanceSchema),
    defaultValues: {
      name: "",
      plateNumber: "",
      status: "available",
      location: {
        lat: 48.8566,
        lng: 2.3522,
      },
      crew: {
        driver: "",
        medic: "",
      },
      equipment: [],
    },
  })

  const handleAddEquipment = () => {
    const newItem = prompt("Nom de l'équipement:")
    if (newItem && newItem.trim()) {
      const newItems = [...equipmentItems, newItem.trim()]
      setEquipmentItems(newItems)
      setValue("equipment", newItems)
    }
  }

  const handleRemoveEquipment = (index: number) => {
    const newItems = equipmentItems.filter((_, i) => i !== index)
    setEquipmentItems(newItems)
    setValue("equipment", newItems)
  }

  const onSubmit = async (data: CreateAmbulanceForm) => {
    try {
      await createMutation.mutateAsync(data)
      reset()
      setEquipmentItems([])
      onOpenChange(false)
      onSuccess?.()
    } catch (error) {
      console.error("Error creating ambulance:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ajouter une ambulance
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name and Plate Number */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ex: AMB-001"
                error={errors.name?.message}
              />
            </div>
            <div>
              <Label htmlFor="plateNumber">
                Numéro de plaque <span className="text-destructive">*</span>
              </Label>
              <Input
                id="plateNumber"
                {...register("plateNumber")}
                placeholder="Ex: 75-AMB-001"
                error={errors.plateNumber?.message}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <SelectField
              label="Statut initial"
              value={watch("status")}
              onValueChange={(value) =>
                setValue("status", value as CreateAmbulanceForm["status"])
              }
              placeholder="Sélectionner un statut"
            >
              <SelectItem value="available">En service</SelectItem>
              <SelectItem value="busy">Pause</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="offline">Hors ligne</SelectItem>
            </SelectField>
          </div>

          {/* Location */}
          <div>
            <Label className="mb-2 block">Position initiale</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="lat" className="text-xs">
                  Latitude
                </Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  {...register("location.lat", { valueAsNumber: true })}
                  placeholder="48.8566"
                  error={errors.location?.lat?.message}
                />
              </div>
              <div>
                <Label htmlFor="lng" className="text-xs">
                  Longitude
                </Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  {...register("location.lng", { valueAsNumber: true })}
                  placeholder="2.3522"
                  error={errors.location?.lng?.message}
                />
              </div>
            </div>
          </div>

          {/* Crew */}
          <div>
            <Label className="mb-2 block">Équipage</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="driver" className="text-xs">
                  Chauffeur <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="driver"
                  {...register("crew.driver")}
                  placeholder="Nom du chauffeur"
                  error={errors.crew?.driver?.message}
                />
              </div>
              <div>
                <Label htmlFor="medic" className="text-xs">
                  Médecin <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="medic"
                  {...register("crew.medic")}
                  placeholder="Nom du médecin"
                  error={errors.crew?.medic?.message}
                />
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div>
            <Label className="mb-2 block">Équipements (optionnel)</Label>
            <div className="space-y-2">
              {equipmentItems.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {equipmentItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEquipment(index)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                        aria-label={`Retirer ${item}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddEquipment}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un équipement
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {createMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erreur lors de la création de l'ambulance. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
              {isSubmitting || createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer l'ambulance"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

