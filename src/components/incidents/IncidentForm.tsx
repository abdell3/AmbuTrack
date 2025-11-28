import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { createIncidentSchema } from "@/types/schemas"
import type { CreateIncidentSchema } from "@/types/schemas"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SelectField, SelectItem } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCreateIncident } from "@/lib/api/queries"
import { geocodeAddress } from "@/lib/utils/geocoding"
import { Loader2, MapPin, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface IncidentFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function IncidentForm({ onSuccess, onCancel }: IncidentFormProps) {
  const [isGeocoding, setIsGeocoding] = useState(false)
  const createMutation = useCreateIncident()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    setError,
    clearErrors,
  } = useForm<CreateIncidentSchema>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: {
      title: "",
      description: "",
      emergencyLevel: "medium",
      location: {
        lat: 48.8566,
        lng: 2.3522,
        address: "",
      },
      reporter: {
        name: "",
        phone: "",
      },
      patient: {
        name: "",
        age: null,
        condition: "",
        vitalSigns: null,
      },
    },
  })

  const address = watch("location.address")

  const handleGeocode = async () => {
    if (!address || address.length < 5) {
      setError("location.address", {
        message: "L'adresse doit contenir au moins 5 caractères",
      })
      return
    }

    setIsGeocoding(true)
    clearErrors("location.address")

    try {
      const result = await geocodeAddress(address)
      setValue("location.lat", result.lat)
      setValue("location.lng", result.lng)
      setValue("location.address", result.address)
    } catch (error) {
      setError("location.address", {
        message: "Erreur lors du géocodage. Veuillez réessayer.",
      })
    } finally {
      setIsGeocoding(false)
    }
  }

  const onSubmit = async (data: CreateIncidentSchema) => {
    try {
      await createMutation.mutateAsync(data)
      onSuccess?.()
    } catch (error) {
      // Error is handled by the mutation
      console.error("Error creating incident:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un nouvel incident</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">
              Titre de l'incident <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Ex: Accident de la route"
              error={errors.title?.message}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description <span className="text-destructive">*</span>
            </Label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Décrivez la situation..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
            {errors.description && (
              <p className="mt-1.5 text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Emergency Level */}
          <div>
            <SelectField
              label="Niveau d'urgence"
              value={watch("emergencyLevel")}
              onValueChange={(value) =>
                setValue("emergencyLevel", value as CreateIncidentSchema["emergencyLevel"])
              }
              placeholder="Sélectionner un niveau"
              required
              error={errors.emergencyLevel?.message}
            >
              <SelectItem value="low">Faible</SelectItem>
              <SelectItem value="medium">Moyenne</SelectItem>
              <SelectItem value="high">Élevée</SelectItem>
              <SelectItem value="critical">Critique</SelectItem>
            </SelectField>
          </div>

          {/* Address with Geocoding */}
          <div>
            <Label htmlFor="address">
              Adresse <span className="text-destructive">*</span>
            </Label>
            <div className="flex gap-2">
              <Input
                id="address"
                {...register("location.address")}
                placeholder="Ex: 123 Rue de Paris, 75001 Paris"
                error={errors.location?.address?.message}
                className="flex-1"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleGeocode}
                disabled={isGeocoding || !address}
                aria-label="Géocoder l'adresse"
              >
                {isGeocoding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>
            {watch("location.lat") !== 48.8566 && (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Coordonnées: {watch("location.lat").toFixed(4)},{" "}
                {watch("location.lng").toFixed(4)}
              </p>
            )}
          </div>

          {/* Reporter Info */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="reporterName">
                Nom du déclarant <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reporterName"
                {...register("reporter.name")}
                placeholder="Nom complet"
                error={errors.reporter?.name?.message}
              />
            </div>
            <div>
              <Label htmlFor="reporterPhone">
                Téléphone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reporterPhone"
                type="tel"
                {...register("reporter.phone")}
                placeholder="+33612345678"
                error={errors.reporter?.phone?.message}
              />
            </div>
          </div>

          {/* Patient Info (Optional) */}
          <div className="space-y-4 border-t pt-4">
            <h3 className="text-sm font-semibold">Informations patient (optionnel)</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="patientName">Nom du patient</Label>
                <Input
                  id="patientName"
                  {...register("patient.name")}
                  placeholder="Nom du patient"
                />
              </div>
              <div>
                <Label htmlFor="patientAge">Âge</Label>
                <Input
                  id="patientAge"
                  type="number"
                  {...register("patient.age", { valueAsNumber: true })}
                  placeholder="Âge"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="patientCondition">État/condition</Label>
              <textarea
                id="patientCondition"
                {...register("patient.condition")}
                placeholder="Décrire l'état du patient..."
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                rows={2}
              />
            </div>
          </div>

          {/* Error Alert */}
          {createMutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Erreur lors de la création de l'incident. Veuillez réessayer.
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end pt-4">
            {onCancel && (
              <Button type="button" variant="secondary" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting || createMutation.isPending}>
              {isSubmitting || createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer l'incident"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

