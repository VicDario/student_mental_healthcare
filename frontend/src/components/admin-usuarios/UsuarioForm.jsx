import { CAMPUSES, UNITS } from '../../data/catalogs'
import { PROFILES } from '../../data/users'
import Button from '../ui/Button'
import Choice from '../ui/form/Choice'
import FormActions from '../ui/form/FormActions'
import FormField from '../ui/form/FormField'
import Input from '../ui/form/Input'
import Select from '../ui/form/Select'

export default function UsuarioForm() {
  return (
    <form>
      <p className="mb-4 text-[0.8125rem] text-muted">Los campos marcados con asterisco son obligatorios.</p>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <FormField id="user-name" label="Nombre completo *">
          <Input id="user-name" name="name" placeholder="Ana Pérez Soto" required />
        </FormField>
        <FormField id="user-email" label="Correo institucional *">
          <Input id="user-email" name="email" type="email" placeholder="ana.perez@unab.cl" required />
        </FormField>
        <FormField id="user-profile" label="Perfil institucional *">
          <Select id="user-profile" name="profile" options={PROFILES} placeholder="Selecciona un perfil" required />
        </FormField>
        <FormField id="user-campus" label="Sede *">
          <Select id="user-campus" name="campus" options={CAMPUSES} placeholder="Selecciona una sede" required />
        </FormField>
      </div>

      <FormField id="user-unit" label="Unidad de apoyo">
        <Select id="user-unit" name="unit" options={UNITS} placeholder="No aplica" />
      </FormField>

      <fieldset className="rounded-sm border-[1.5px] border-border p-4">
        <legend className="px-1 text-[0.8125rem] font-semibold text-forest-900">Estado inicial de la cuenta *</legend>
        <div className="mt-1 flex flex-col gap-2">
          <Choice type="radio" name="status" value="active" required>
            Activo, puede iniciar sesión de inmediato
          </Choice>
          <Choice type="radio" name="status" value="inactive">
            Inactivo, queda registrada sin acceso
          </Choice>
        </div>
      </fieldset>

      <FormActions>
        <Button type="submit">Registrar cuenta</Button>
        <Button type="reset" variant="secondary">
          Limpiar formulario
        </Button>
      </FormActions>
    </form>
  )
}
