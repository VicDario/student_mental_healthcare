export default function SolicitudPasos({ steps }) {
  return (
    <>
      <ol className="flex flex-col gap-3">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-[0.9375rem]">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-forest-100 text-[0.8125rem] font-bold text-forest-800">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>

      <p className="mt-5 border-t border-border-subtle pt-4 text-[0.8125rem] text-muted">
        Si en algún momento necesitas ayuda inmediata, llama a Salud Responde al <strong>600 360 7777</strong>,
        disponible las 24 horas.
      </p>
    </>
  )
}
