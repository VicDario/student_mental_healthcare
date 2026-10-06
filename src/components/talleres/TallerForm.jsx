import { useState } from 'react'
import Button from '../ui/Button'
import FormField from '../ui/form/FormField'
import Input from '../ui/form/Input'
import Select from '../ui/form/Select'
import Textarea from '../ui/form/Textarea'
import { MODALITIES, WORKSHOP_CATEGORIES } from '../../data/workshops'

// Formulario lateral para registrar y aperturar una nueva actividad grupal
export default function TallerForm({ onCreated }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    facilitator: '',
    date: '',
    time: '',
    capacity: 20,
    modality: 'Presencial',
    location: '',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.title || !form.category || !form.facilitator || !form.date || !form.time || !form.location) {
      alert('Por favor completa todos los campos obligatorios (*) para publicar la actividad.')
      return
    }

    const newTaller = {
      id: `TAL-00${Date.now().toString().slice(-3)}`,
      title: form.title,
      category: form.category,
      facilitator: form.facilitator,
      facilitatorRole: 'Docente DAE',
      avatar: '👨‍🏫',
      schedule: `${form.date} ${form.time}`,
      location: form.location,
      modality: form.modality,
      enrolled: 0,
      capacity: Number(form.capacity) || 20,
      status: 'normal',
    }

    onCreated(newTaller)
    setSubmitted(true)
    setForm({
      title: '',
      category: '',
      facilitator: '',
      date: '',
      time: '',
      capacity: 20,
      modality: 'Presencial',
      location: '',
      notes: '',
    })

    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-subtle sm:p-6" id="panelCrear">
      <div className="mb-4 border-b border-border-subtle pb-3">
        <h3 className="text-[1.125rem] font-bold text-title">+ Nueva Actividad</h3>
        <p className="text-xs text-muted">Habilita la inscripción para la comunidad universitaria.</p>
      </div>

      {submitted && (
        <div className="mb-4 rounded-md border border-forest-200 bg-forest-50 p-3 text-xs text-forest-800">
          ✓ Actividad publicada con éxito y agregada a la nómina institucional.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <FormField id="title" label="Título de la Actividad *" className="mb-3">
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Ej: Taller de Asertividad"
            required
          />
        </FormField>

        <FormField id="category" label="Categoría *" className="mb-3">
          <Select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            options={WORKSHOP_CATEGORIES}
            placeholder="Selecciona categoría..."
            required
          />
        </FormField>

        <FormField id="facilitator" label="Facilitador(a) / Docente *" className="mb-3">
          <Input
            id="facilitator"
            name="facilitator"
            value={form.facilitator}
            onChange={handleChange}
            placeholder="Ej: Ps. Carolina Muñoz"
            required
          />
        </FormField>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField id="date" label="Fecha *" className="mb-3">
            <Input id="date" name="date" type="date" value={form.date} onChange={handleChange} required />
          </FormField>
          <FormField id="time" label="Horario *" className="mb-3">
            <Input
              id="time"
              name="time"
              value={form.time}
              onChange={handleChange}
              placeholder="15:00 - 16:30"
              required
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField id="capacity" label="Cupos *" className="mb-3">
            <Input
              id="capacity"
              name="capacity"
              type="number"
              min="5"
              max="100"
              value={form.capacity}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField id="modality" label="Modalidad *" className="mb-3">
            <Select
              id="modality"
              name="modality"
              value={form.modality}
              onChange={handleChange}
              options={MODALITIES}
              required
            />
          </FormField>
        </div>

        <FormField id="location" label="Lugar / Enlace *" className="mb-3">
          <Input
            id="location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ej: Sala 2 o Enlace Zoom"
            required
          />
        </FormField>

        <FormField id="notes" label="Objetivos / Requisitos" className="mb-4">
          <Textarea
            id="notes"
            name="notes"
            rows={2}
            value={form.notes}
            onChange={handleChange}
            placeholder="Detalles para los inscritos..."
          />
        </FormField>

        <Button type="submit" variant="primary" className="w-full">
          Publicar Actividad e Iniciar Cupos →
        </Button>
      </form>
    </div>
  )
}
