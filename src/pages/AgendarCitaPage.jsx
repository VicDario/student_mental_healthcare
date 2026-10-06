import { useState } from 'react'
import BookingConfirmationModal from '../components/citas/BookingConfirmationModal'
import BookingSummaryCard from '../components/citas/BookingSummaryCard'
import ProviderCard from '../components/citas/ProviderCard'
import DashboardPage from '../components/layout/DashboardPage'
import FormField from '../components/ui/form/FormField'
import Input from '../components/ui/form/Input'
import Select from '../components/ui/form/Select'
import {
  AVAILABLE_DAYS,
  AVAILABLE_TIMES,
  DEFAULT_PROVIDER,
  SUPPORT_AREAS,
} from '../data/appointments'

// Pantalla para la selección de día, bloque horario y registro de cita psicológica individual
export default function AgendarCitaPage() {
  const [selectedDay, setSelectedDay] = useState(AVAILABLE_DAYS[1])
  const [selectedTime, setSelectedTime] = useState(AVAILABLE_TIMES[1])
  const [studentName, setStudentName] = useState('Valeria Gómez')
  const [studentId, setStudentId] = useState('19.876.543-2')
  const [studentEmail, setStudentEmail] = useState('v.gomez@alumnos.edu')
  const [category, setCategory] = useState('Emocional')
  const [modality, setModality] = useState('Presencial')
  const [consent, setConsent] = useState(false)
  const [confirmed, setConfirmed] = useState(null)

  const handleConfirm = () => {
    if (!studentName || !studentId || !studentEmail) {
      alert('Por favor completa todos tus datos personales obligatorios.')
      return
    }

    const folio = `CITA-2026-0${Math.floor(100 + Math.random() * 900)}`
    setConfirmed({
      folio,
      studentName,
      studentId,
      studentEmail,
      providerName: DEFAULT_PROVIDER.name,
      dayLabel: selectedDay.fullLabel,
      timeSlot: selectedTime,
      category,
      modality: modality === 'Presencial' ? 'Presencial (Box 102)' : 'Virtual (Videollamada)',
    })
  }

  return (
    <DashboardPage
      title="Agendamiento de Citas de Atención"
      subtitle="Selecciona el profesional, día y horario disponible para tu sesión de orientación y contención psicológica."
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_1fr_320px]">
        {/* Columna 1: Perfil profesional */}
        <ProviderCard provider={DEFAULT_PROVIDER} />

        {/* Columna 2: Selección de fecha, hora y datos del estudiante */}
        <section className="rounded-lg border border-border bg-card p-5 shadow-subtle sm:p-6">
          <div className="mb-6 border-b border-border-subtle pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
              Paso 1: Horario disponible
            </span>
            <h2 className="mt-1 text-lg font-bold text-title">Elige un horario que se adapte a ti</h2>
            <p className="text-xs text-muted">
              Selecciona el día y bloque disponible para tu sesión individual.
            </p>
          </div>

          {/* Selector de días de la semana */}
          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between text-xs font-semibold text-title">
              <span>📅 Septiembre 2026</span>
              <span className="rounded-full bg-forest-100 px-2.5 py-0.5 text-forest-800">
                5 días disponibles
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {AVAILABLE_DAYS.map((d) => {
                const isSelected = selectedDay.id === d.id
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDay(d)}
                    className={`cursor-pointer rounded-lg border p-2 text-center transition ${
                      isSelected
                        ? 'border-forest-800 bg-forest-800 text-white shadow-xs'
                        : 'border-border bg-page text-title hover:border-forest-400 hover:bg-forest-50'
                    }`}
                  >
                    <span className="block text-[0.7rem] uppercase">{d.day}</span>
                    <strong className="block text-base font-extrabold">{d.num}</strong>
                    <span className="block text-[0.7rem]">{d.month}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Selector de bloques horarios */}
          <div className="mb-6 border-b border-border-subtle pb-6">
            <div className="mb-3 flex items-center justify-between text-xs">
              <strong className="font-semibold text-title">Bloques disponibles</strong>
              <span className="text-muted">Hora Local (Chile Continental)</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TIMES.map((time) => {
                const isSelected = selectedTime === time
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-bold transition ${
                      isSelected
                        ? 'border-forest-800 bg-forest-800 text-white shadow-xs'
                        : 'border-border bg-page text-title hover:border-forest-400 hover:bg-white'
                    }`}
                  >
                    {time}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Formulario de ingreso de datos */}
          <div>
            <div className="mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-700">
                Paso 2: Datos de atención
              </span>
              <h3 className="mt-0.5 text-sm font-bold text-title">Datos y Motivo de Consulta</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField id="studentName" label="Nombre Completo *" className="mb-3">
                <Input
                  id="studentName"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ej: Valeria Gómez"
                  required
                />
              </FormField>

              <FormField id="studentId" label="RUT / Matrícula *" className="mb-3">
                <Input
                  id="studentId"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Ej: 19.876.543-2"
                  required
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField id="studentEmail" label="Correo Institucional *" className="mb-3">
                <Input
                  id="studentEmail"
                  type="email"
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="v.gomez@alumnos.edu"
                  required
                />
              </FormField>

              <FormField id="category" label="Área de Apoyo *" className="mb-3">
                <Select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={SUPPORT_AREAS}
                  required
                />
              </FormField>
            </div>

            <div className="mb-2">
              <label className="mb-1.5 block text-[0.8125rem] font-semibold text-forest-900">
                Modalidad de Atención
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setModality('Presencial')}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    modality === 'Presencial'
                      ? 'border-forest-800 bg-forest-800 text-white'
                      : 'border-border bg-page text-title hover:bg-white'
                  }`}
                >
                  📍 Presencial (Box 102)
                </button>
                <button
                  type="button"
                  onClick={() => setModality('Virtual')}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    modality === 'Virtual'
                      ? 'border-forest-800 bg-forest-800 text-white'
                      : 'border-border bg-page text-title hover:bg-white'
                  }`}
                >
                  💻 Videollamada Segura
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Columna 3: Tarjeta de Resumen en vivo y confirmación */}
        <BookingSummaryCard
          provider={DEFAULT_PROVIDER}
          selectedDay={selectedDay}
          selectedTime={selectedTime}
          modality={modality}
          consent={consent}
          onConsentChange={setConsent}
          onConfirm={handleConfirm}
        />
      </div>

      {/* Modal de confirmación final */}
      {confirmed && (
        <BookingConfirmationModal
          appointment={confirmed}
          onClose={() => setConfirmed(null)}
        />
      )}
    </DashboardPage>
  )
}
