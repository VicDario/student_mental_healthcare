import { Route, Routes } from 'react-router'
import MainLayout from './layouts/MainLayout'
import AdminUsuariosPage from './pages/AdminUsuariosPage'
import DerivacionDocentePage from './pages/DerivacionDocentePage'
import HomePage from './pages/HomePage'
import PlaceholderPage from './pages/PlaceholderPage'
import ReportesPage from './pages/ReportesPage'
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
        <Route path="*" element={<PlaceholderPage />} />
      </Route>
    </Routes>
  )
}
