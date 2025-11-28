import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "./apiClient"
import type {
  Ambulance,
  Incident,
  CreateIncidentPayload,
  UpdateIncidentPayload,
  Statistics,
} from "@/types"
import { ambulanceSchema, incidentSchema, statisticsSchema } from "@/types/schemas"
import { useAppDispatch } from "@/store/hooks"
import { setAmbulances } from "@/store/slices/ambulancesSlice"
import {
  setIncidents,
  addIncident,
  updateIncident as updateIncidentAction,
} from "@/store/slices/incidentsSlice"

// Query keys
export const queryKeys = {
  ambulances: ["ambulances"] as const,
  ambulance: (id: string) => ["ambulances", id] as const,
  incidents: (filters?: Record<string, unknown>) =>
    ["incidents", filters] as const,
  incident: (id: string) => ["incidents", id] as const,
  statistics: ["statistics"] as const,
}

// Ambulances queries
export function useAmbulances() {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: queryKeys.ambulances,
    queryFn: async () => {
      const response = await api.getAmbulances()
      const ambulances = response.data.map((item) =>
        ambulanceSchema.parse(item)
      ) as Ambulance[]
      dispatch(setAmbulances(ambulances))
      return ambulances
    },
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // Refetch every 30 seconds
  })
}

export function useAmbulance(id: string) {
  return useQuery({
    queryKey: queryKeys.ambulance(id),
    queryFn: async () => {
      const response = await api.getAmbulance(id)
      return ambulanceSchema.parse(response.data) as Ambulance
    },
    enabled: !!id,
  })
}

// Incidents queries
export function useIncidents(filters?: Record<string, unknown>) {
  const dispatch = useAppDispatch()

  return useQuery({
    queryKey: queryKeys.incidents(filters),
    queryFn: async () => {
      const params = filters
        ? Object.fromEntries(
            Object.entries(filters).map(([key, value]) => [
              key,
              String(value),
            ])
          )
        : undefined
      const response = await api.getIncidents(params)
      const incidents = response.data.map((item) =>
        incidentSchema.parse(item)
      ) as Incident[]
      dispatch(setIncidents(incidents))
      return incidents
    },
    staleTime: 30000,
    refetchInterval: 30000,
  })
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: queryKeys.incident(id),
    queryFn: async () => {
      const response = await api.getIncident(id)
      return incidentSchema.parse(response.data) as Incident
    },
    enabled: !!id,
  })
}

// Statistics query
export function useStatistics() {
  return useQuery({
    queryKey: queryKeys.statistics,
    queryFn: async () => {
      const response = await api.getStatistics()
      return statisticsSchema.parse(response.data) as Statistics
    },
    staleTime: 60000, // 1 minute
    refetchInterval: 60000,
  })
}

// Mutations
export function useCreateIncident() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (payload: CreateIncidentPayload) => {
      const response = await api.createIncident(payload)
      return incidentSchema.parse(response.data) as Incident
    },
    onMutate: async (newIncident) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.incidents() })

      // Snapshot previous value
      const previousIncidents = queryClient.getQueryData<Incident[]>(
        queryKeys.incidents()
      )

      // Optimistically update
      const optimisticIncident: Incident = {
        id: `temp-${Date.now()}`,
        ...newIncident,
        status: "pending",
        reportedAt: new Date().toISOString(),
      }

      queryClient.setQueryData<Incident[]>(
        queryKeys.incidents(),
        (old) => (old ? [optimisticIncident, ...old] : [optimisticIncident])
      )

      dispatch(addIncident(optimisticIncident))

      return { previousIncidents }
    },
    onError: (_err, _newIncident, context) => {
      // Rollback on error
      if (context?.previousIncidents) {
        queryClient.setQueryData(
          queryKeys.incidents(),
          context.previousIncidents
        )
      }
    },
    onSuccess: (data) => {
      // Replace optimistic update with real data
      queryClient.setQueryData<Incident[]>(
        queryKeys.incidents(),
        (old) =>
          old
            ? old.map((incident) =>
                incident.id.startsWith("temp-") ? data : incident
              )
            : [data]
      )
      dispatch(addIncident(data))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents() })
    },
  })
}

export function useUpdateIncident() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async (payload: UpdateIncidentPayload) => {
      const { id, ...updates } = payload
      const response = await api.updateIncident(id, updates)
      return incidentSchema.parse(response.data) as Incident
    },
    onMutate: async (updatedIncident) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.incident(updatedIncident.id),
      })

      const previousIncident = queryClient.getQueryData<Incident>(
        queryKeys.incident(updatedIncident.id)
      )

      // Optimistically update
      if (previousIncident) {
        const optimisticIncident = {
          ...previousIncident,
          ...updatedIncident,
        }
        queryClient.setQueryData(
          queryKeys.incident(updatedIncident.id),
          optimisticIncident
        )
        dispatch(
          updateIncidentAction({
            id: updatedIncident.id,
            updates: updatedIncident,
          })
        )
      }

      return { previousIncident }
    },
    onError: (_err, variables, context) => {
      if (context?.previousIncident) {
        queryClient.setQueryData(
          queryKeys.incident(variables.id),
          context.previousIncident
        )
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.incident(data.id), data)
      dispatch(
        updateIncidentAction({
          id: data.id,
          updates: data,
        })
      )
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.incident(data.id),
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.incidents() })
      }
    },
  })
}

export function useAssignAmbulance() {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()

  return useMutation({
    mutationFn: async ({
      incidentId,
      ambulanceId,
    }: {
      incidentId: string
      ambulanceId: string
    }) => {
      const response = await api.updateIncident(incidentId, {
        assignedAmbulanceId: ambulanceId,
        status: "assigned",
        assignedAt: new Date().toISOString(),
      })
      return incidentSchema.parse(response.data) as Incident
    },
    onMutate: async ({ incidentId, ambulanceId }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.incident(incidentId),
      })

      const previousIncident = queryClient.getQueryData<Incident>(
        queryKeys.incident(incidentId)
      )

      if (previousIncident) {
        const optimisticIncident = {
          ...previousIncident,
          assignedAmbulanceId: ambulanceId,
          status: "assigned" as const,
          assignedAt: new Date().toISOString(),
        }
        queryClient.setQueryData(
          queryKeys.incident(incidentId),
          optimisticIncident
        )
        dispatch(
          updateIncidentAction({
            id: incidentId,
            updates: optimisticIncident,
          })
        )
      }

      return { previousIncident }
    },
    onError: (_err, variables, context) => {
      if (context?.previousIncident) {
        queryClient.setQueryData(
          queryKeys.incident(variables.incidentId),
          context.previousIncident
        )
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.incident(data.id), data)
      dispatch(
        updateIncidentAction({
          id: data.id,
          updates: data,
        })
      )
      // Invalidate ambulances to update their status
      queryClient.invalidateQueries({ queryKey: queryKeys.ambulances })
    },
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.incident(data.id),
        })
        queryClient.invalidateQueries({ queryKey: queryKeys.incidents() })
      }
    },
  })
}

export function useUpdateAmbulanceStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string
      status: Ambulance["status"]
    }) => {
      const response = await api.updateAmbulance(id, { status })
      return ambulanceSchema.parse(response.data) as Ambulance
    },
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.ambulance(data.id), data)
      queryClient.invalidateQueries({ queryKey: queryKeys.ambulances })
    },
  })
}

