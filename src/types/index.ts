// Ambulance types
export type AmbulanceStatus = "available" | "busy" | "maintenance" | "offline"

export interface Ambulance {
  id: string
  name: string
  plateNumber: string
  status: AmbulanceStatus
  location: {
    lat: number
    lng: number
  }
  currentIncidentId?: string
  crew: {
    driver: string
    medic: string
  }
  lastUpdate: string
}

export interface AmbulanceFilters {
  status?: AmbulanceStatus[]
  search?: string
}

// Incident types
export type EmergencyLevel = "low" | "medium" | "high" | "critical"

export interface Incident {
  id: string
  title: string
  description: string
  emergencyLevel: EmergencyLevel
  location: {
    lat: number
    lng: number
    address: string
  }
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
  assignedAmbulanceId?: string
  reportedAt: string
  assignedAt?: string
  startedAt?: string
  completedAt?: string
  reporter: {
    name: string
    phone: string
  }
}

export interface IncidentFilters {
  status?: Incident["status"][]
  emergencyLevel?: EmergencyLevel[]
  dateRange?: {
    start: string
    end: string
  }
  search?: string
}

export interface CreateIncidentPayload {
  title: string
  description: string
  emergencyLevel: EmergencyLevel
  location: {
    lat: number
    lng: number
    address: string
  }
  reporter: {
    name: string
    phone: string
  }
}

export interface UpdateIncidentPayload {
  id: string
  status?: Incident["status"]
  assignedAmbulanceId?: string
  description?: string
}

// UI State types
export interface UISliceState {
  selectedAmbulanceId: string | null
  selectedIncidentId: string | null
  mapCenter: {
    lat: number
    lng: number
  }
  mapZoom: number
  sidebarOpen: boolean
  filters: {
    ambulances: AmbulanceFilters
    incidents: IncidentFilters
  }
}

// Statistics types
export interface Statistics {
  totalIncidents: number
  activeIncidents: number
  availableAmbulances: number
  averageResponseTime: number
  incidentsByLevel: Record<EmergencyLevel, number>
  incidentsByStatus: Record<Incident["status"], number>
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: unknown
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

