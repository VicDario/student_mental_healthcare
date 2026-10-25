import Badge from '../ui/Badge'
import Button from '../ui/Button'

const COLUMNS = ['Usuario', 'Perfil', 'Sede', 'Estado', 'Acción']

export default function UsuariosTabla({ users }) {
  return (
    // overflow-x-auto: en celular la tabla se desliza en vez de romper la página
    <div className="overflow-x-auto rounded-sm border border-border">
      <table className="w-full min-w-170 border-collapse text-left text-[0.875rem]">
        <caption className="sr-only">Cuentas registradas en la plataforma</caption>
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
          {users.map((user) => (
            <tr key={user.email} className="border-t border-border-subtle">
              <th scope="row" className="px-4 py-3 text-left font-normal">
                <span className="block font-semibold whitespace-nowrap text-title">{user.name}</span>
                <span className="block text-[0.8125rem] text-muted">{user.email}</span>
              </th>
              <td className="px-4 py-3">{user.profile}</td>
              <td className="px-4 py-3 whitespace-nowrap">{user.campus}</td>
              <td className="px-4 py-3">
                <Badge tone={user.active ? 'success' : 'neutral'}>{user.active ? 'Activo' : 'Inactivo'}</Badge>
              </td>
              <td className="px-4 py-3">
                <Button variant="secondary" className="whitespace-nowrap">
                  Cambiar estado
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
