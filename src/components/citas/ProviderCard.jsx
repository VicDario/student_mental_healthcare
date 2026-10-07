import psicologa from '../../assets/psicologa_2.webp'
import Divider from '../ui/Divider'
import Panel from '../ui/Panel'

// Tarjeta informativa con el perfil profesional del facilitador y datos del servicio
export default function ProviderCard({ provider }) {
  return (
    <Panel id="provider-card" title="Profesional Asignado">
      <div className="mb-4 overflow-hidden rounded-lg border border-border">
        <img
          src={psicologa}
          alt={`${provider.name} - ${provider.role}`}
          className="block h-56 w-full object-cover object-[center_20%]"
        />
      </div>

      <div>
        <span className="inline-block rounded-full bg-forest-100 px-3 py-0.5 text-xs font-semibold text-forest-800">
          {provider.role}
        </span>
        <h3 className="mt-2 text-xl font-extrabold text-title">{provider.name}</h3>
        <p className="mt-1 text-xs text-muted leading-relaxed">{provider.bio}</p>
      </div>

      <Divider />

      <div className="space-y-2.5 text-xs text-title">
        <div className="flex items-center gap-2">
          <span>📍</span>
          <span>{provider.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>⏱</span>
          <span>{provider.duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <span>🛡️</span>
          <span>{provider.cost}</span>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-crisis-border bg-crisis-bg p-3 text-xs text-crisis-text">
        <strong className="block font-bold">¿Urgencia Crítica?</strong>
        <p className="mt-0.5">
          Si sientes riesgo vital o desborde severo, llama a la línea 24/7 al{' '}
          <strong className="font-extrabold underline">800-555-AYUDA</strong>.
        </p>
      </div>
    </Panel>
  )
}
