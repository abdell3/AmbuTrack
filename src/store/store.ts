import { configureStore } from "@reduxjs/toolkit"
import ambulancesReducer from "./slices/ambulancesSlice"
import incidentsReducer from "./slices/incidentsSlice"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    ambulances: ambulancesReducer,
    incidents: incidentsReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

