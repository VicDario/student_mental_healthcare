import UsuarioForm from '../components/admin-usuarios/UsuarioForm'
import UsuariosTabla from '../components/admin-usuarios/UsuariosTabla'
import DashboardPage from '../components/layout/DashboardPage'
import FilterBar from '../components/ui/FilterBar'
import FormField from '../components/ui/form/FormField'
import Input from '../components/ui/form/Input'
import Select from '../components/ui/form/Select'
import Panel from '../components/ui/Panel'
import SideMenu from '../components/ui/SideMenu'
import StatsRow from '../components/ui/StatsRow'
import { ADMIN_SECTIONS, PROFILES, USER_STATS, USERS } from '../data/users'

export default function AdminUsuariosPage() {
  return (
    <DashboardPage
      title="Administración de usuarios"
      subtitle="Registro de las cuentas habilitadas en la plataforma, con su perfil institucional, sede asignada y estado de acceso."
    >
      <div className="grid gap-6 min-[900px]:grid-cols-[220px_1fr] min-[900px]:items-start">
        <SideMenu label="Secciones de administración" items={ADMIN_SECTIONS} />

        <div className="min-w-0">
          <StatsRow label="Resumen de cuentas" stats={USER_STATS} />

          <FilterBar label="Filtrar cuentas">
            <FormField id="filter-search" label="Buscar por nombre o correo" className="flex-[1_1_220px]">
              <Input id="filter-search" name="search" type="search" placeholder="Escribe para filtrar" />
            </FormField>
            <FormField id="filter-profile" label="Perfil" className="flex-[1_1_180px]">
              <Select id="filter-profile" name="profile" options={PROFILES} placeholder="Todos los perfiles" />
            </FormField>
          </FilterBar>

          <div className="flex flex-col gap-6">
            <Panel id="users-list-title" title="Listado de cuentas" count={`${USERS.length} cuentas`}>
              <UsuariosTabla users={USERS} />
            </Panel>

            <Panel id="user-form-title" title="Registrar nueva cuenta">
              <UsuarioForm />
            </Panel>
          </div>
        </div>
      </div>
    </DashboardPage>
  )
}
