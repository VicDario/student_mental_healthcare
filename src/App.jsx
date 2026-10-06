import { Route, Routes } from 'react-router'
import MainLayout from './layouts/MainLayout'
import AgendarCitaPage from './pages/AgendarCitaPage'
import BitacoraPage from './pages/BitacoraPage'
import ClasificacionPage from './pages/ClasificacionPage'
import GestionarTalleresPage from './pages/GestionarTalleresPage'
import HomePage from './pages/HomePage'
import PlaceholderPage from './pages/PlaceholderPage'
import SeguimientoPage from './pages/SeguimientoPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="clasificacion" element={<ClasificacionPage />} />
        <Route path="gestionar-talleres" element={<GestionarTalleresPage />} />
        <Route path="agendar-cita" element={<AgendarCitaPage />} />
        <Route path="registro-citas" element={<AgendarCitaPage />} />
        <Route path="seguimiento" element={<SeguimientoPage />} />
        <Route path="bitacora" element={<BitacoraPage />} />
        <Route path="*" element={<PlaceholderPage />} />
      </Route>
    </Routes>
  )
}
