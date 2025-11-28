import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import type { Incident, IncidentFilters } from "@/types"

interface IncidentsState {
  items: Incident[]
  filters: IncidentFilters
  selectedId: string | null
}

const initialState: IncidentsState = {
  items: [],
  filters: {},
  selectedId: null,
}

const incidentsSlice = createSlice({
  name: "incidents",
  initialState,
  reducers: {
    setIncidents: (state, action: PayloadAction<Incident[]>) => {
      state.items = action.payload
    },
    addIncident: (state, action: PayloadAction<Incident>) => {
      state.items.unshift(action.payload)
    },
    updateIncident: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Incident> }>
    ) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates }
      }
    },
    removeIncident: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setFilters: (state, action: PayloadAction<IncidentFilters>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    setSelectedId: (state, action: PayloadAction<string | null>) => {
      state.selectedId = action.payload
    },
  },
})

export const {
  setIncidents,
  addIncident,
  updateIncident,
  removeIncident,
  setFilters,
  clearFilters,
  setSelectedId,
} = incidentsSlice.actions

// Selectors
export const selectAllIncidents = (state: RootState) => state.incidents.items

export const selectIncidentFilters = (state: RootState) => state.incidents.filters

export const selectSelectedIncidentId = (state: RootState) =>
  state.incidents.selectedId

export const selectSelectedIncident = createSelector(
  [selectAllIncidents, selectSelectedIncidentId],
  (incidents, selectedId) =>
    selectedId ? incidents.find((i) => i.id === selectedId) : null
)

export const selectFilteredIncidents = createSelector(
  [selectAllIncidents, selectIncidentFilters],
  (incidents, filters) => {
    let filtered = [...incidents]

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((incident) =>
        filters.status!.includes(incident.status)
      )
    }

    if (filters.emergencyLevel && filters.emergencyLevel.length > 0) {
      filtered = filtered.filter((incident) =>
        filters.emergencyLevel!.includes(incident.emergencyLevel)
      )
    }

    if (filters.dateRange) {
      filtered = filtered.filter((incident) => {
        const reportedAt = new Date(incident.reportedAt)
        const start = new Date(filters.dateRange!.start)
        const end = new Date(filters.dateRange!.end)
        return reportedAt >= start && reportedAt <= end
      })
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (incident) =>
          incident.title.toLowerCase().includes(searchLower) ||
          incident.description.toLowerCase().includes(searchLower) ||
          incident.location.address.toLowerCase().includes(searchLower) ||
          incident.reporter.name.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }
)

export const selectActiveIncidents = createSelector(
  [selectAllIncidents],
  (incidents) =>
    incidents.filter(
      (incident) =>
        incident.status === "pending" ||
        incident.status === "assigned" ||
        incident.status === "in_progress"
    )
)

export const selectIncidentsByStatus = createSelector(
  [selectAllIncidents],
  (incidents) => {
    return incidents.reduce(
      (acc, incident) => {
        acc[incident.status] = (acc[incident.status] || 0) + 1
        return acc
      },
      {} as Record<Incident["status"], number>
    )
  }
)

export const selectIncidentsByLevel = createSelector(
  [selectAllIncidents],
  (incidents) => {
    return incidents.reduce(
      (acc, incident) => {
        acc[incident.emergencyLevel] = (acc[incident.emergencyLevel] || 0) + 1
        return acc
      },
      {} as Record<Incident["emergencyLevel"], number>
    )
  }
)

export default incidentsSlice.reducer

