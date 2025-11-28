export { store } from "./store"
export type { RootState, AppDispatch } from "./store"
export { useAppDispatch, useAppSelector } from "./hooks"

// Export slice actions
export * from "./slices/ambulancesSlice"
export * from "./slices/incidentsSlice"
export * from "./slices/uiSlice"

