/**
 * Export utilities for incident history
 */

export function exportIncidentsToCSV(incidents: unknown[], filename = "incidents.csv") {
  if (incidents.length === 0) {
    alert("Aucune donnée à exporter")
    return
  }

  // Get headers from first incident
  const headers = Object.keys(incidents[0] as Record<string, unknown>)
  
  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...incidents.map((incident) => {
      return headers.map((header) => {
        const value = (incident as Record<string, unknown>)[header]
        // Handle nested objects and arrays
        if (value === null || value === undefined) return ""
        if (typeof value === "object") {
          return JSON.stringify(value).replace(/"/g, '""')
        }
        return String(value).replace(/"/g, '""')
      }).join(",")
    }),
  ].join("\n")

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export function exportIncidentsToJSON(incidents: unknown[], filename = "incidents.json") {
  if (incidents.length === 0) {
    alert("Aucune donnée à exporter")
    return
  }

  const jsonContent = JSON.stringify(incidents, null, 2)
  const blob = new Blob([jsonContent], { type: "application/json" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

