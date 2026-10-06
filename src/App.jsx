import { Route, Routes } from 'react-router'
import MainLayout from './layouts/MainLayout'
import AdminUsuariosPage from './pages/AdminUsuariosPage'
import AgendarCitaPage from './pages/AgendarCitaPage'
import BitacoraPage from './pages/BitacoraPage'
import ClasificacionPage from './pages/ClasificacionPage'
import DerivacionDocentePage from './pages/DerivacionDocentePage'
import GestionarTalleresPage from './pages/GestionarTalleresPage'
import HomePage from './pages/HomePage'
import PlaceholderPage from './pages/PlaceholderPage'
import ReportesPage from './pages/ReportesPage'
import SeguimientoPage from './pages/SeguimientoPage'
import SolicitudApoyoPage from './pages/SolicitudApoyoPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="solicitud-apoyo" element={<SolicitudApoyoPage />} />
        <Route path="admin-usuarios" element={<AdminUsuariosPage />} />
        <Route path="reportes" element={<ReportesPage />} />
        <Route path="derivacion-docente" element={<DerivacionDocentePage />} />
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
