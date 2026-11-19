import { ROLE_OPTIONS } from '../../utils/labels'
import Button from '../ui/Button'
import Panel from '../ui/Panel'

// Qué puede hacer cada perfil. Los permisos los aplica el backend en cada ruta,
// por eso los perfiles son fijos: el administrador asigna y cambia el perfil de cada cuenta.
const PROFILE_DETAILS = {
  student: {
    can: 'Crea solicitudes de apoyo, recibe avisos, ve sus citas y se inscribe en talleres.',
    origin: 'Registro propio o creada por el administrador',
  },
  teacher: {
    can: 'Deriva estudiantes con el formulario de derivación responsable y ve el estado de sus derivaciones.',
    origin: 'Solo la crea el administrador',
  },
  counselor: {
    can: 'Clasifica y asigna solicitudes, hace seguimiento, agenda citas y cierra casos.',
    origin: 'Solo la crea el administrador',
  },
  professional: {
    can: 'Atiende los casos que tiene asignados (citas, observaciones y cierre) y gestiona talleres.',
    origin: 'Solo la crea el administrador',
  },
  admin: {
    can: 'Asigna solicitudes, gestiona talleres, cuentas y catálogos, y revisa reportes y bitácora.',
    origin: 'Solo la crea otro administrador',
  },
}

const COLUMNS = ['Perfil', 'Qué puede hacer', 'Cómo se obtiene', 'Cuentas', 'Acción']

// Perfiles institucionales con su alcance y cuántas cuentas tiene cada uno
export default function PerfilesPanel({ users, onShowUsers }) {
  return (
    <Panel id="profiles-title" title="Perfiles institucionales">
      <p className="mb-4 text-[0.875rem] text-muted">
        Cada cuenta tiene un perfil, y el perfil decide qué secciones ve y qué acciones puede hacer. Para cambiar el
        perfil de una persona, usa «Editar» en el listado de cuentas.
      </p>
      <div className="overflow-x-auto rounded-sm border border-border">
        <table className="w-full min-w-170 border-collapse text-left text-[0.875rem]">
          <caption className="sr-only">Perfiles institucionales y cantidad de cuentas</caption>
          <thead className="bg-subtle text-[0.75rem] tracking-[0.06em] text-muted uppercase">
            <tr>
              {COLUMNS.map((column) => (
                <th key={column} scope="col" className="px-4 py-3 font-bold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROLE_OPTIONS.map(({ value, label }) => {
              const accounts = users.filter((user) => user.role === value)
              const active = accounts.filter((user) => user.active).length
              return (
                <tr key={value} className="border-t border-border-subtle">
                  <th scope="row" className="px-4 py-3 text-left font-semibold whitespace-nowrap text-title">
                    {label}
                  </th>
                  <td className="px-4 py-3">{PROFILE_DETAILS[value].can}</td>
                  <td className="px-4 py-3 text-muted">{PROFILE_DETAILS[value].origin}</td>
                  <td className="px-4 py-3 whitespace-nowrap tabular-nums">
                    {active} activas
                    {accounts.length > active && (
                      <span className="block text-[0.8125rem] text-muted">{accounts.length - active} inactivas</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="secondary" className="whitespace-nowrap" onClick={() => onShowUsers(value)}>
                      Ver cuentas
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Panel>
  )
}
