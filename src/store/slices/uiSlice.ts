import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../store"
import type { UISliceState, AmbulanceFilters, IncidentFilters } from "@/types"

const initialState: UISliceState = {
  selectedAmbulanceId: null,
  selectedIncidentId: null,
  mapCenter: {
    lat: 48.8566, // Paris default
    lng: 2.3522,
  },
  mapZoom: 13,
  sidebarOpen: false,
  filters: {
    ambulances: {},
    incidents: {},
  },
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSelectedAmbulanceId: (state, action: PayloadAction<string | null>) => {
      state.selectedAmbulanceId = action.payload
    },
    setSelectedIncidentId: (state, action: PayloadAction<string | null>) => {
      state.selectedIncidentId = action.payload
    },
    setMapCenter: (
      state,
      action: PayloadAction<{ lat: number; lng: number }>
    ) => {
      state.mapCenter = action.payload
    },
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.mapZoom = action.payload
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setAmbulanceFilters: (state, action: PayloadAction<AmbulanceFilters>) => {
      state.filters.ambulances = { ...state.filters.ambulances, ...action.payload }
    },
    setIncidentFilters: (state, action: PayloadAction<IncidentFilters>) => {
      state.filters.incidents = { ...state.filters.incidents, ...action.payload }
    },
    clearAmbulanceFilters: (state) => {
      state.filters.ambulances = {}
    },
    clearIncidentFilters: (state) => {
      state.filters.incidents = {}
    },
    clearAllFilters: (state) => {
      state.filters = {
        ambulances: {},
        incidents: {},
      }
    },
  },
})

export const {
  setSelectedAmbulanceId,
  setSelectedIncidentId,
  setMapCenter,
  setMapZoom,
  setSidebarOpen,
  setAmbulanceFilters,
  setIncidentFilters,
  clearAmbulanceFilters,
  clearIncidentFilters,
  clearAllFilters,
} = uiSlice.actions

// Selectors
export const selectUI = (state: RootState) => state.ui

export const selectSelectedAmbulanceId = createSelector(
  [selectUI],
  (ui) => ui.selectedAmbulanceId
)

export const selectSelectedIncidentId = createSelector(
  [selectUI],
  (ui) => ui.selectedIncidentId
)

export const selectMapCenter = createSelector([selectUI], (ui) => ui.mapCenter)

export const selectMapZoom = createSelector([selectUI], (ui) => ui.mapZoom)

export const selectSidebarOpen = createSelector([selectUI], (ui) => ui.sidebarOpen)

export const selectAmbulanceFilters = createSelector(
  [selectUI],
  (ui) => ui.filters.ambulances
)

export const selectIncidentFilters = createSelector(
  [selectUI],
  (ui) => ui.filters.incidents
)

export default uiSlice.reducer

