import { Route, Routes } from 'react-router'
import RequireRole from './auth/RequireRole'
import MainLayout from './layouts/MainLayout'
import AdminUsuariosPage from './pages/AdminUsuariosPage'
import AgendarCitaPage from './pages/AgendarCitaPage'
import BitacoraPage from './pages/BitacoraPage'
import ClasificacionPage from './pages/ClasificacionPage'
import DerivacionDocentePage from './pages/DerivacionDocentePage'
import GestionarTalleresPage from './pages/GestionarTalleresPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import PlaceholderPage from './pages/PlaceholderPage'
import ReportesPage from './pages/ReportesPage'
import SeguimientoPage from './pages/SeguimientoPage'
import SolicitudApoyoPage from './pages/SolicitudApoyoPage'

// Cada página indica qué perfiles pueden entrar (igual que en el backend)
const protect = (roles, page) => <RequireRole roles={roles}>{page}</RequireRole>

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="solicitud-apoyo" element={protect(['student'], <SolicitudApoyoPage />)} />
        <Route path="derivacion-docente" element={protect(['teacher'], <DerivacionDocentePage />)} />
        <Route path="clasificacion" element={protect(['counselor', 'admin'], <ClasificacionPage />)} />
        <Route
          path="seguimiento"
          element={protect(['professional', 'counselor', 'admin'], <SeguimientoPage />)}
        />
        <Route path="agendar-cita" element={protect(['professional', 'counselor'], <AgendarCitaPage />)} />
        <Route path="registro-citas" element={protect(['professional', 'counselor'], <AgendarCitaPage />)} />
        <Route path="talleres" element={protect(['student'], <GestionarTalleresPage />)} />
        <Route
          path="gestionar-talleres"
          element={protect(['admin', 'professional'], <GestionarTalleresPage />)}
        />
        <Route path="reportes" element={protect(['admin'], <ReportesPage />)} />
        <Route path="bitacora" element={protect(['admin'], <BitacoraPage />)} />
        <Route path="admin-usuarios" element={protect(['admin'], <AdminUsuariosPage />)} />
        <Route path="*" element={<PlaceholderPage />} />
      </Route>
    </Routes>
  )
}
