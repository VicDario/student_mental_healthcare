import { Catalog, Enrollment, User, Workshop } from '../models/index.js'
import { HttpError } from '../utils/httpError.js'
import { changedFieldsOf, recordAudit } from './audit.service.js'

const WORKSHOP_NOT_FOUND = 'Taller no encontrado'

// Inscripciones que ocupan un cupo (las canceladas lo liberan)
const TAKEN_STATUSES = ['enrolled', 'attended']

// Datos públicos de un taller, con los cupos ocupados para ver la disponibilidad
function toPublicWorkshop(workshop, takenSeats) {
  return {
    id: workshop.id,
    title: workshop.title,
    description: workshop.description,
    kind: workshop.kind,
    category: workshop.category,
    modality: workshop.modality,
    location: workshop.location,
    campus: workshop.campus ? { id: workshop.campus.id, name: workshop.campus.name } : null,
    facilitator: workshop.facilitator
      ? { id: workshop.facilitator.id, name: workshop.facilitator.name }
      : null,
    startsAt: workshop.startsAt,
    endsAt: workshop.endsAt,
    capacity: workshop.capacity,
    takenSeats,
    status: workshop.status,
  }
}

// Datos de una inscripción. El nombre y correo sirven al equipo para pasar asistencia
function toPublicEnrollment(enrollment) {
  return {
    id: enrollment.id,
    workshop: enrollment.workshop,
    student: {
      id: enrollment.student.id,
      name: enrollment.student.name,
      email: enrollment.student.email,
    },
    status: enrollment.status,
    createdAt: enrollment.createdAt,
  }
}

function countTakenSeats(workshopId) {
  return Enrollment.countDocuments({ workshop: workshopId, status: { $in: TAKEN_STATUSES } })
}

async function findWorkshopOrFail(id) {
  const workshop = await Workshop.findById(id).populate('campus facilitator')
  if (!workshop) {
    throw new HttpError(404, WORKSHOP_NOT_FOUND)
  }
  return workshop
}

// Los talleres cancelados o finalizados ya no se editan ni reciben inscripciones
function ensureScheduled(workshop, message) {
  if (workshop.status !== 'scheduled') {
    throw new HttpError(400, message)
  }
}

function ensureValidDates(startsAt, endsAt) {
  if (endsAt <= startsAt) {
    throw new HttpError(400, 'La fecha de término debe ser posterior a la de inicio')
  }
}

async function ensureActiveCampus(id) {
  if (!id) return

  const exists = await Catalog.exists({ _id: id, type: 'campus', active: true })
  if (!exists) {
    throw new HttpError(400, 'La sede no existe o está desactivada')
  }
}

async function ensureActiveFacilitator(id) {
  if (!id) return

  const exists = await User.exists({ _id: id, active: true })
  if (!exists) {
    throw new HttpError(400, 'El facilitador no existe o está desactivado')
  }
}

// Los datos llegan validados por los esquemas de schemas/workshop.schemas.js.
// actor: quién hace el cambio, para la bitácora

// Lista los talleres por fecha. Por simplicidad se cuenta con una consulta por taller
// cuántos cupos están ocupados; son pocos talleres, así que no afecta el rendimiento.
export async function listWorkshops({ status, kind }) {
  const filter = {}

  if (status) filter.status = status
  if (kind) filter.kind = kind

  const workshops = await Workshop.find(filter).populate('campus facilitator').sort({ startsAt: 1 })

  return Promise.all(
    workshops.map(async (workshop) =>
      toPublicWorkshop(workshop, await countTakenSeats(workshop._id)),
    ),
  )
}

// Si no se indica facilitador, queda a cargo quien crea el taller
export async function createWorkshop(data, actor) {
  ensureValidDates(data.startsAt, data.endsAt)
  await ensureActiveCampus(data.campus)
  await ensureActiveFacilitator(data.facilitator)

  const workshop = await Workshop.create({ ...data, facilitator: data.facilitator ?? actor.id })
  await workshop.populate('campus facilitator')

  await recordAudit(actor, {
    action: 'create',
    entity: 'Workshop',
    entityId: workshop._id,
    changedFields: Object.keys(data),
  })

  return toPublicWorkshop(workshop, 0)
}

// Edición parcial. Las fechas se revisan con los valores finales, porque puede llegar solo una
export async function updateWorkshop(id, data, actor) {
  const workshop = await findWorkshopOrFail(id)

  ensureScheduled(workshop, 'No se puede editar un taller cancelado o finalizado')
  await ensureActiveCampus(data.campus)
  await ensureActiveFacilitator(data.facilitator)

  workshop.set(data)
  ensureValidDates(workshop.startsAt, workshop.endsAt)

  // El cupo no puede quedar por debajo de los estudiantes ya inscritos
  const takenSeats = await countTakenSeats(workshop._id)
  if (workshop.capacity < takenSeats) {
    throw new HttpError(400, 'El cupo no puede ser menor que la cantidad de inscritos')
  }

  const changedFields = changedFieldsOf(workshop)
  await workshop.save()
  await workshop.populate('campus facilitator')

  // Sin cambios reales no se registra nada
  if (changedFields.length > 0) {
    await recordAudit(actor, {
      action: 'update',
      entity: 'Workshop',
      entityId: workshop._id,
      changedFields,
    })
  }

  return toPublicWorkshop(workshop, takenSeats)
}

// Los talleres nunca se eliminan: se cancelan, así se conserva el historial de inscripciones
export async function cancelWorkshop(id, actor) {
  const workshop = await findWorkshopOrFail(id)

  if (workshop.status === 'cancelled') {
    throw new HttpError(400, 'El taller ya está cancelado')
  }
  if (workshop.status === 'finished') {
    throw new HttpError(400, 'No se puede cancelar un taller finalizado')
  }

  workshop.status = 'cancelled'
  await workshop.save()

  await recordAudit(actor, {
    action: 'update',
    entity: 'Workshop',
    entityId: workshop._id,
    changedFields: ['status'],
  })

  return toPublicWorkshop(workshop, await countTakenSeats(workshop._id))
}

// Inscribe al estudiante si el taller está programado, no está inscrito y quedan cupos.
// Si antes canceló su inscripción, se reactiva la misma (solo puede haber una por estudiante y taller).
export async function enroll(workshopId, studentId) {
  const workshop = await findWorkshopOrFail(workshopId)
  ensureScheduled(workshop, 'Solo puedes inscribirte en talleres programados')

  let enrollment = await Enrollment.findOne({ workshop: workshop._id, student: studentId })
  if (enrollment && enrollment.status !== 'cancelled') {
    throw new HttpError(409, 'Ya estás inscrito en este taller')
  }

  const takenSeats = await countTakenSeats(workshop._id)
  if (takenSeats >= workshop.capacity) {
    throw new HttpError(409, 'El taller no tiene cupos disponibles')
  }

  if (enrollment) {
    enrollment.status = 'enrolled'
    await enrollment.save()
  } else {
    enrollment = await Enrollment.create({ workshop: workshop._id, student: studentId })
  }

  await enrollment.populate('student', 'name email')
  return toPublicEnrollment(enrollment)
}

// El estudiante cancela su propia inscripción y libera el cupo
export async function cancelEnrollment(workshopId, studentId) {
  const workshop = await findWorkshopOrFail(workshopId)
  ensureScheduled(workshop, 'Solo puedes cancelar tu inscripción en talleres programados')

  const enrollment = await Enrollment.findOne({
    workshop: workshopId,
    student: studentId,
    status: 'enrolled',
  }).populate('student', 'name email')

  if (!enrollment) {
    throw new HttpError(404, 'No tienes una inscripción activa en este taller')
  }

  enrollment.status = 'cancelled'
  await enrollment.save()

  return toPublicEnrollment(enrollment)
}

// Inscritos de un taller con su nombre y correo, para que el equipo pase asistencia
export async function listEnrollments(workshopId) {
  const workshop = await findWorkshopOrFail(workshopId)

  const enrollments = await Enrollment.find({ workshop: workshop._id })
    .populate('student', 'name email')
    .sort({ createdAt: 1 })

  return enrollments.map(toPublicEnrollment)
}

// Marca que el estudiante asistió. Solo aplica a inscripciones activas de talleres no cancelados
export async function markAttendance(workshopId, enrollmentId, actor) {
  const workshop = await findWorkshopOrFail(workshopId)
  if (workshop.status === 'cancelled') {
    throw new HttpError(400, 'No se puede marcar asistencia en un taller cancelado')
  }

  const filter = { _id: enrollmentId, workshop: workshopId }
  const enrollment = await Enrollment.findOne(filter).populate('student', 'name email')

  if (!enrollment) {
    throw new HttpError(404, 'Inscripción no encontrada')
  }
  if (enrollment.status !== 'enrolled') {
    throw new HttpError(400, 'Solo se puede marcar asistencia en una inscripción activa')
  }

  enrollment.status = 'attended'
  await enrollment.save()

  await recordAudit(actor, {
    action: 'update',
    entity: 'Enrollment',
    entityId: enrollment._id,
    changedFields: ['status'],
  })

  return toPublicEnrollment(enrollment)
}
