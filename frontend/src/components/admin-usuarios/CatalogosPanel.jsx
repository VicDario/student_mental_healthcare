import { useState } from 'react'
import { api } from '../../api/client'
import { useApi } from '../../hooks/useApi'
import { useSubmit } from '../../hooks/useSubmit'
import ApiMessage from '../ui/ApiMessage'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import FormField from '../ui/form/FormField'
import Input from '../ui/form/Input'
import LoadState from '../ui/LoadState'
import Panel from '../ui/Panel'

const TYPES = [
  { value: 'support_type', label: 'Tipos de apoyo' },
  { value: 'campus', label: 'Sedes' },
  { value: 'unit', label: 'Unidades de apoyo' },
]

// Catálogos (GET/POST/PUT /api/catalogs). Desactivar un elemento lo oculta de los formularios
export default function CatalogosPanel() {
  const [type, setType] = useState('support_type')
  const [form, setForm] = useState({ code: '', name: '' })
  const items = useApi(`/catalogs?type=${type}`)
  const { submit, pending, error, success, fieldError } = useSubmit()

  async function handleCreate(event) {
    event.preventDefault()
    const created = await submit(() => api('/catalogs', { method: 'POST', body: { type, ...form } }), 'Elemento agregado al catálogo.')
    if (created) {
      setForm({ code: '', name: '' })
      items.reload()
    }
  }

  async function toggle(item) {
    const saved = await submit(() => api(`/catalogs/${item.id}`, { method: 'PUT', body: { active: !item.active } }))
    if (saved) items.reload()
  }

  return (
    <Panel id="catalogs-title" title="Catálogos del sistema">
      <div role="tablist" aria-label="Tipo de catálogo" className="mb-5 flex flex-wrap gap-1.5">
        {TYPES.map((option) => (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={type === option.value}
            onClick={() => setType(option.value)}
            className={`cursor-pointer rounded-full px-3.5 py-1.5 text-[0.8125rem] font-semibold transition ${
              type === option.value ? 'bg-forest-800 text-white' : 'bg-page text-muted hover:bg-forest-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <ApiMessage error={error} success={success} />

      <LoadState loading={items.loading} error={items.error} empty={!items.data?.length} emptyText="Este catálogo está vacío.">
        <ul className="mb-6 divide-y divide-border-subtle rounded-sm border border-border">
          {items.data?.map((item) => (
            <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 text-[0.9rem]">
              <span>
                <strong className="text-title">{item.name}</strong>
                <span className="ml-2 font-mono text-[0.8rem] text-muted">{item.code}</span>
              </span>
              <span className="flex items-center gap-2">
                <Badge tone={item.active ? 'success' : 'neutral'}>{item.active ? 'Activo' : 'Inactivo'}</Badge>
                <Button variant="secondary" className="px-3! py-1! text-[0.8125rem]!" onClick={() => toggle(item)}>
                  {item.active ? 'Desactivar' : 'Activar'}
                </Button>
              </span>
            </li>
          ))}
        </ul>
      </LoadState>

      <form onSubmit={handleCreate} noValidate className="flex flex-wrap items-end gap-3">
        <FormField id="catalog-name" label="Nombre *" className="flex-[1_1_200px]" error={fieldError('name')}>
          <Input id="catalog-name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Ej.: Vocacional" />
        </FormField>
        <FormField id="catalog-code" label="Código *" className="flex-[1_1_160px]" error={fieldError('code')}>
          <Input id="catalog-code" value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="vocational" />
        </FormField>
        <Button type="submit" disabled={pending}>
          Agregar
        </Button>
      </form>
    </Panel>
  )
}
