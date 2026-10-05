import ButtonLink from '../components/ui/ButtonLink'

export default function PlaceholderPage() {
  return (
    <section className="mx-auto max-w-180 px-5 py-24 text-center">
      <h1 className="mb-3 text-[2rem] font-extrabold tracking-tight text-forest-900">Página en construcción</h1>
      <p className="mb-8 text-muted">Esta sección aún se está migrando a la nueva plataforma.</p>
      <ButtonLink to="/">Volver al inicio</ButtonLink>
    </section>
  )
}
