import { useState } from 'react'
import { api, toQuery } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import CatalogosPanel from '../components/admin-usuarios/CatalogosPanel'
import UsuarioForm from '../components/admin-usuarios/UsuarioForm'
import UsuariosTabla from '../components/admin-usuarios/UsuariosTabla'
import DashboardPage from '../components/layout/DashboardPage'
import ApiMessage from '../components/ui/ApiMessage'
import FilterBar from '../components/ui/FilterBar'
import FormField from '../components/ui/form/FormField'
import Input from '../components/ui/form/Input'
import Select from '../components/ui/form/Select'
import LoadState from '../components/ui/LoadState'
import Panel from '../components/ui/Panel'
import StatsRow from '../components/ui/StatsRow'
import { useApi } from '../hooks/useApi'
import { useSubmit } from '../hooks/useSubmit'
import { countLabel, ROLE_OPTIONS } from '../utils/labels'

const SECTIONS = [
  { value: 'users', label: 'Usuarios' },
  { value: 'catalogs', label: 'Tipos de apoyo, sedes y unidades' },
]

const ACTIVE_OPTIONS = [
  { value: 'true', label: 'Activas' },
  { value: 'false', label: 'Inactivas' },
]

export default function AdminUsuariosPage() {
  const { user: me } = useAuth()
  const [section, setSection] = useState('users')
  const [filters, setFilters] = useState({ search: '', role: '', active: '' })
  const users = useApi(`/users${toQuery(filters)}`)
  const allUsers = useApi('/users')
  const campuses = useApi('/catalogs?type=campus')
  const units = useApi('/catalogs?type=unit')
  const { submit, error, success } = useSubmit()
  const [editing, setEditing] = useState(null)
  const [saved, setSaved] = useState(null)

  const updateFilter = (event) => setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  const everyone = allUsers.data ?? []
  const stats = [
    { value: everyone.length, label: 'Cuentas registradas' },
    { value: everyone.filter((item) => item.active).length, label: 'Cuentas activas', tone: 'success' },
    { value: campuses.data?.length ?? 0, label: 'Sedes activas' },
    { value: new Set(everyone.map((item) => item.role)).size, label: 'Perfiles en uso' },
  ]

  function refresh() {
    users.reload()
    allUsers.reload()
  }

  function startEdit(user) {
    setSaved(null)
    setEditing(user)
    document.getElementById('user-form-title')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleSaved(message) {
    setEditing(null)
    setSaved(message ?? null)
    refresh()
  }

  async function toggleUser(user) {
    setSaved(null)
    const action = user.active ? 'deactivate' : 'activate'
    const done = await submit(
      () => api(`/users/${user.id}/${action}`, { method: 'PATCH' }),
      user.active ? `${user.name} quedó inactivo y se cerraron sus sesiones.` : `${user.name} puede volver a ingresar.`,
    )
    if (done) refresh()
  }

  return (
    <DashboardPage
      title="Administración de usuarios"
      subtitle="Cuentas habilitadas en la plataforma, con su perfil institucional, sede y estado de acceso, y los catálogos que usan los formularios."
    >
      <div className="grid gap-6 min-[900px]:grid-cols-[220px_1fr] min-[900px]:items-start">
        <aside className="rounded-sm border border-border bg-page p-4">
          <nav aria-label="Secciones de administración">
            <ul className="max-[900px]:flex max-[900px]:flex-wrap max-[900px]:gap-2">
              {SECTIONS.map((item) => (
                <li key={item.value}>
                  <button
                    type="button"
                    onClick={() => setSection(item.value)}
                    aria-current={section === item.value ? 'page' : undefined}
                    className={`mt-1 block w-full cursor-pointer rounded-sm px-3 py-[9px] text-left text-sm font-medium max-[900px]:mt-0 ${
                      section === item.value ? 'bg-forest-700 text-white' : 'bg-subtle text-body hover:bg-forest-50'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="min-w-0">
          {section === 'catalogs' ? (
            <CatalogosPanel />
          ) : (
            <>
              <StatsRow label="Resumen de cuentas" stats={stats} />

              <FilterBar label="Filtrar cuentas" onSubmit={users.reload}>
                <FormField id="filter-search" label="Buscar por nombre o correo" className="flex-[1_1_220px]">
                  <Input id="filter-search" name="search" type="search" value={filters.search} onChange={updateFilter} placeholder="Escribe para filtrar" />
                </FormField>
                <FormField id="filter-profile" label="Perfil" className="flex-[1_1_180px]">
                  <Select id="filter-profile" name="role" value={filters.role} onChange={updateFilter} options={ROLE_OPTIONS} placeholder="Todos los perfiles" />
                </FormField>
                <FormField id="filter-active" label="Estado" className="flex-[1_1_140px]">
                  <Select id="filter-active" name="active" value={filters.active} onChange={updateFilter} options={ACTIVE_OPTIONS} placeholder="Todas" />
                </FormField>
              </FilterBar>

              <div className="flex flex-col gap-6">
                <Panel id="users-list-title" title="Listado de cuentas" count={users.data ? countLabel(users.data.length, 'cuenta') : undefined}>
                  <ApiMessage error={error} success={saved ?? success} />
                  <LoadState loading={users.loading} error={users.error} empty={!users.data?.length} emptyText="No hay cuentas con estos filtros.">
                    <UsuariosTabla users={users.data ?? []} currentUserId={me.id} onEdit={startEdit} onToggle={toggleUser} />
                  </LoadState>
                </Panel>

                <Panel id="user-form-title" title={editing ? `Editar cuenta de ${editing.name}` : 'Registrar nueva cuenta'}>
                  <UsuarioForm
                    key={editing?.id ?? 'new'}
                    campuses={campuses.data ?? []}
                    units={units.data ?? []}
                    editing={editing}
                    onSaved={handleSaved}
                    onCancelEdit={() => setEditing(null)}
                  />
                </Panel>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardPage>
  )
}
