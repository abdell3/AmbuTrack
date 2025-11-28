import { createSlice, createSelector } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import type { Ambulance, AmbulanceFilters } from "@/types"
import type {PayloadAction} from "@reduxjs/toolkit"

interface AmbulancesState {
  items: Ambulance[]
  filters: AmbulanceFilters
  selectedId: string | null
}

const initialState: AmbulancesState = {
  items: [],
  filters: {},
  selectedId: null,
}

const ambulancesSlice = createSlice({
  name: "ambulances",
  initialState,
  reducers: {
    setAmbulances: (state, action: PayloadAction<Ambulance[]>) => {
      state.items = action.payload
    },
    addAmbulance: (state, action: PayloadAction<Ambulance>) => {
      state.items.push(action.payload)
    },
    updateAmbulance: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<Ambulance> }>
    ) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload.updates }
      }
    },
    removeAmbulance: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setFilters: (state, action: PayloadAction<AmbulanceFilters>) => {
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
  setAmbulances,
  addAmbulance,
  updateAmbulance,
  removeAmbulance,
  setFilters,
  clearFilters,
  setSelectedId,
} = ambulancesSlice.actions

// Selectors
export const selectAllAmbulances = (state: RootState) => state.ambulances.items

export const selectAmbulanceFilters = (state: RootState) =>
  state.ambulances.filters

export const selectSelectedAmbulanceId = (state: RootState) =>
  state.ambulances.selectedId

export const selectSelectedAmbulance = createSelector(
  [selectAllAmbulances, selectSelectedAmbulanceId],
  (ambulances, selectedId) =>
    selectedId ? ambulances.find((a) => a.id === selectedId) : null
)

export const selectFilteredAmbulances = createSelector(
  [selectAllAmbulances, selectAmbulanceFilters],
  (ambulances, filters) => {
    let filtered = [...ambulances]

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((ambulance) =>
        filters.status!.includes(ambulance.status)
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (ambulance) =>
          ambulance.name.toLowerCase().includes(searchLower) ||
          ambulance.plateNumber.toLowerCase().includes(searchLower) ||
          ambulance.crew.driver.toLowerCase().includes(searchLower) ||
          ambulance.crew.medic.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }
)

// Selector that uses UI filters (from uiSlice)
export const selectFilteredAmbulancesWithUIFilters = createSelector(
  [selectAllAmbulances, (state: RootState) => state.ui.filters.ambulances],
  (ambulances, filters) => {
    let filtered = [...ambulances]

    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter((ambulance) =>
        filters.status!.includes(ambulance.status)
      )
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (ambulance) =>
          ambulance.name.toLowerCase().includes(searchLower) ||
          ambulance.plateNumber.toLowerCase().includes(searchLower) ||
          ambulance.crew.driver.toLowerCase().includes(searchLower) ||
          ambulance.crew.medic.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }
)

export const selectAmbulancesByStatus = createSelector(
  [selectAllAmbulances],
  (ambulances) => {
    return ambulances.reduce(
      (acc, ambulance) => {
        acc[ambulance.status] = (acc[ambulance.status] || 0) + 1
        return acc
      },
      {} as Record<Ambulance["status"], number>
    )
  }
)

export const selectAvailableAmbulances = createSelector(
  [selectAllAmbulances],
  (ambulances) => ambulances.filter((a) => a.status === "available")
)

export default ambulancesSlice.reducer

