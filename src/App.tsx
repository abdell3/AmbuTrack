import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainLayout } from "@/components/layout/MainLayout"
import { Dashboard } from "@/pages/Dashboard"
import { Map } from "@/pages/Map"
import { Fleet } from "@/pages/Fleet"
import { Incidents } from "@/pages/Incidents"
import { NotFound } from "@/pages/NotFound"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="map" element={<Map />} />
          <Route path="fleet" element={<Fleet />} />
          <Route path="incidents" element={<Incidents />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
