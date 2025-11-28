import { z } from "zod"

// Ambulance schemas
export const ambulanceStatusSchema = z.enum([
  "available",
  "busy",
  "maintenance",
  "offline",
])

export const ambulanceLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
})

export const ambulanceCrewSchema = z.object({
  driver: z.string().min(1),
  medic: z.string().min(1),
})

export const ambulanceSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  plateNumber: z.string().min(1),
  status: ambulanceStatusSchema,
  location: ambulanceLocationSchema,
  currentIncidentId: z.string().nullable().optional(),
  crew: ambulanceCrewSchema,
  equipment: z.array(z.string()).optional(),
  lastUpdate: z.string().datetime(),
})

export const ambulanceFiltersSchema = z.object({
  status: z.array(ambulanceStatusSchema).optional(),
  search: z.string().optional(),
})

// Incident schemas
export const emergencyLevelSchema = z.enum([
  "low",
  "medium",
  "high",
  "critical",
])

export const incidentStatusSchema = z.enum([
  "pending",
  "assigned",
  "in_progress",
  "completed",
  "cancelled",
])

export const incidentLocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().min(1),
})

export const incidentReporterSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
})

export const patientSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().nullable(),
  condition: z.string(),
  vitalSigns: z
    .object({
      heartRate: z.number().int().min(0),
      bloodPressure: z.string(),
      oxygenSaturation: z.number().min(0).max(100),
    })
    .nullable()
    .optional(),
})

export const incidentSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  description: z.string(),
  emergencyLevel: emergencyLevelSchema,
  location: incidentLocationSchema,
  status: incidentStatusSchema,
  assignedAmbulanceId: z.string().optional(),
  reportedAt: z.string().datetime(),
  assignedAt: z.string().datetime().optional(),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  reporter: incidentReporterSchema,
  patient: patientSchema.optional(),
})

export const createIncidentSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  emergencyLevel: emergencyLevelSchema,
  location: incidentLocationSchema,
  reporter: incidentReporterSchema,
  patient: patientSchema.optional(),
})

export const updateIncidentSchema = z.object({
  id: z.string(),
  status: incidentStatusSchema.optional(),
  assignedAmbulanceId: z.string().optional(),
  description: z.string().optional(),
})

export const incidentFiltersSchema = z.object({
  status: z.array(incidentStatusSchema).optional(),
  emergencyLevel: z.array(emergencyLevelSchema).optional(),
  dateRange: z
    .object({
      start: z.string().datetime(),
      end: z.string().datetime(),
    })
    .optional(),
  search: z.string().optional(),
})

// Statistics schema
export const statisticsSchema = z.object({
  totalIncidents: z.number().int().min(0),
  activeIncidents: z.number().int().min(0),
  availableAmbulances: z.number().int().min(0),
  averageResponseTime: z.number().min(0),
  incidentsByLevel: z.record(emergencyLevelSchema, z.number().int().min(0)),
  incidentsByStatus: z.record(incidentStatusSchema, z.number().int().min(0)),
})

// Pagination schema
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    total: z.number().int().min(0),
    page: z.number().int().min(1),
    limit: z.number().int().min(1),
    totalPages: z.number().int().min(0),
  })

// API Response schema
export const apiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    message: z.string().optional(),
  })

// Type exports from schemas
export type AmbulanceSchema = z.infer<typeof ambulanceSchema>
export type CreateIncidentSchema = z.infer<typeof createIncidentSchema>
export type UpdateIncidentSchema = z.infer<typeof updateIncidentSchema>

