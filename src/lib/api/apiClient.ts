const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"

async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status}`,
    }))
    throw new Error(error.message || "Une erreur est survenue")
  }

  return response.json()
}

export const api = {
  // Ambulances
  getAmbulances: () => fetchAPI<unknown[]>("/ambulances"),
  
  getAmbulance: (id: string) => fetchAPI<unknown>(`/ambulances/${id}`),
  
  updateAmbulance: (id: string, updates: unknown) =>
    fetchAPI<unknown>(`/ambulances/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  // Incidents
  getIncidents: (params?: Record<string, string>) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : ""
    return fetchAPI<unknown[]>(`/incidents${queryString}`)
  },
  
  getIncident: (id: string) => fetchAPI<unknown>(`/incidents/${id}`),
  
  createIncident: (data: unknown) =>
    fetchAPI<unknown>("/incidents", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  
  updateIncident: (id: string, updates: unknown) =>
    fetchAPI<unknown>(`/incidents/${id}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),
  
  deleteIncident: (id: string) =>
    fetchAPI<unknown>(`/incidents/${id}`, {
      method: "DELETE",
    }),

  // Statistics
  getStatistics: () => fetchAPI<unknown>("/statistics"),
  
  // History
  getHistory: (params?: Record<string, string>) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : ""
    return fetchAPI<unknown[]>(`/historique${queryString}`)
  },
  
  getHistoryItem: (id: string) => fetchAPI<unknown>(`/historique/${id}`),
  
  // Activity
  getActivity: (params?: Record<string, string>) => {
    const queryString = params
      ? `?${new URLSearchParams(params).toString()}`
      : ""
    return fetchAPI<unknown[]>(`/activity${queryString}`)
  },
}

