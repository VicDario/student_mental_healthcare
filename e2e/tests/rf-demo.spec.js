import { readFileSync } from 'node:fs'
import { createDemo, dateFromToday, expect, test } from './support.js'

// Recorrido de la rúbrica del Caso 5, en el orden del guion (guias/guion-demo-rf.html).
// Requiere la base recién sembrada: `npm run demo` y `npm run check` corren el seed antes.
// Cada test es un RF; si uno falla, los siguientes se omiten porque dependen de sus datos.
test.describe.configure({ mode: 'serial' })

const VALENTINA = { name: 'Valentina Ríos', email: 'valentina@test.cl', password: 'clave123' }
const NEXT_WEEK = dateFromToday(7)

let page
let demo

test.beforeAll(async ({ demoPage, demoMode, demoAutoplay, demoStepDelay, demoActionDelay }) => {
  page = demoPage
  demo = createDemo(page, {
    demoMode,
    autoplay: demoAutoplay,
    stepDelay: demoStepDelay,
    actionDelay: demoActionDelay,
  })
})

const main = () => page.locator('main')
const card = (text) => main().locator('li', { hasText: text })
const workshopRow = (text) => main().locator('tr', { hasText: text })

test('RF1 · Registro y autenticación según perfil institucional', async () => {
  await page.goto('/')
  await demo.rf('Demo RF', 'Red de Apoyo y Salud Mental Universitaria', '')
  await demo.next('Comenzar ▶')
  await demo.rf('RF1', 'Registro y autenticación según perfil institucional', 'Víctor')

  await demo.step('Sin sesión, el menú es público', async () => {
    await expect(page.locator('#primaryNav')).not.toContainText('Mis solicitudes')
    await demo.click(page.locator('header').getByRole('link', { name: 'Iniciar sesión' }))
    await demo.click(page.getByRole('link', { name: 'Crear cuenta' }))
  })

  await demo.step('El registro valida cada campo', async () => {
    await demo.click(page.getByRole('button', { name: 'Crear cuenta' }))
    await expect(page.getByText('El nombre es obligatorio')).toBeVisible()
  })

  await demo.step('La estudiante crea su cuenta y entra a su panel', async () => {
    await demo.fill(page.locator('#register-name'), VALENTINA.name)
    await demo.fill(page.locator('#register-email'), VALENTINA.email)
    await demo.fill(page.locator('#register-password'), VALENTINA.password)
    await demo.fill(page.locator('#register-program'), 'Psicología')
    await demo.click(page.getByRole('button', { name: 'Crear cuenta' }))
    await expect(page).toHaveURL(/\/solicitud-apoyo$/)
    await expect(page.locator('#primaryNav')).toContainText('Mis solicitudes')
  })

  await demo.step('Contraseña incorrecta: el mismo mensaje exista o no el correo', async () => {
    await demo.logout()
    await demo.fill(page.locator('#login-email'), VALENTINA.email)
    await demo.fill(page.locator('#login-password'), 'mala')
    await demo.click(page.getByRole('button', { name: 'Ingresar' }))
    await expect(page.getByText('Correo o contraseña incorrectos')).toBeVisible()
  })

  await demo.step('Ingreso correcto y bloqueo de una página de otro perfil', async () => {
    await demo.login(VALENTINA.email, VALENTINA.password)
    await expect(page).toHaveURL(/\/solicitud-apoyo$/)
    await page.goto('/bitacora')
    await expect(page.getByText('Sin acceso a esta sección')).toBeVisible()
    await page.goto('/solicitud-apoyo')
  })

  await demo.next()
})

test('RF2 · El estudiante crea una solicitud de apoyo', async () => {
  await demo.rf('RF2', 'Solicitud con motivo, descripción, urgencia y contacto', 'Eliezer')

  await demo.step('No se puede enviar sin autorizar', async () => {
    await expect(page.getByRole('button', { name: 'Enviar solicitud' })).toBeDisabled()
  })

  await demo.step('Motivo, descripción, urgencia percibida y contacto', async () => {
    await demo.fill(page.locator('#request-reason'), 'Ansiedad por exámenes')
    await demo.fill(
      page.locator('#request-description'),
      'Desde hace semanas no duermo bien y siento mucha ansiedad antes de cada prueba.',
    )
    await demo.check(page.getByLabel(/Alta, necesito hablar/))
    await demo.select(page.locator('#request-channel'), { label: 'Teléfono' })
    await demo.fill(page.locator('#request-contact'), '+56912345678')
    await demo.check(page.getByLabel(/Autorizo/))
  })

  await demo.step('Se crea con código único y aviso de recepción', async () => {
    await demo.click(page.getByRole('button', { name: 'Enviar solicitud' }))
    await expect(main().getByText('SOL-2026-0001').first()).toBeVisible()
    await expect(page.getByText('Recibimos tu solicitud SOL-2026-0001', { exact: false })).toBeVisible()
  })

  await demo.next()
})

test('RF3 · Derivación docente responsable', async () => {
  await demo.rf('RF3', 'Derivación docente con pauta responsable', 'Fabián')
  await demo.logout()
  await demo.login('docente@test.cl')

  await demo.step('Datos del estudiante y hechos observados', async () => {
    await demo.fill(page.locator('#studentEmail'), 'estudiante@test.cl')
    await demo.fill(page.locator('#course'), 'Cálculo I')
    await demo.fill(
      page.locator('#observedSituation'),
      'Ha faltado a varias clases y se ve muy desanimado en las últimas semanas.',
    )
    await demo.check(page.locator('#urgencia-media'))
    await demo.check(page.locator('#aviso-si'))
    await demo.check(page.locator('#pauta'))
  })

  await demo.step('El docente solo ve código y estado', async () => {
    await demo.click(page.getByRole('button', { name: 'Enviar derivación' }))
    await expect(main().getByText('SOL-2026-0002').first()).toBeVisible()
  })

  await demo.next()
})

test('RF4 · Clasificar solicitudes por tipo', async () => {
  await demo.rf('RF4', 'Clasificar: emocional, académico, social, económico, convivencia u otro', 'Benjamín')
  await demo.logout()
  await demo.login('consejero@test.cl')
  await expect(page).toHaveURL(/\/clasificacion$/)

  for (const [code, type, urgency] of [
    ['SOL-2026-0001', 'Emocional', 'Alta'],
    ['SOL-2026-0002', 'Académico', 'Media'],
  ]) {
    await demo.step(`${code} → ${type}, urgencia ${urgency}`, async () => {
      await demo.click(main().getByText(code).first())
      const typeSelect = page.locator('#request-type')
      for (const option of ['Emocional', 'Académico', 'Social', 'Económico', 'Convivencia', 'Otro']) {
        await expect(typeSelect.locator('option', { hasText: option })).toHaveCount(1)
      }
      await demo.select(typeSelect, { label: type })
      await demo.check(main().getByLabel(urgency, { exact: true }))
      await demo.click(page.getByRole('button', { name: 'Guardar clasificación' }))
      await expect(main().getByText('Clasificación guardada', { exact: false })).toBeVisible()
    })
  }

  await demo.next()
})

test('RF5 · Asignar a un profesional habilitado', async () => {
  await demo.rf('RF5', 'Asignar a un orientador o profesional habilitado', 'Benjamín')

  for (const code of ['SOL-2026-0001', 'SOL-2026-0002']) {
    await demo.step(`${code} → Carolina Muñoz`, async () => {
      await demo.select(page.locator('#filter-status'), 'classified')
      await demo.click(main().getByText(code).first())
      await demo.selectContaining(page.locator('#assigned-to'), 'Carolina Muñoz')
      await demo.click(page.getByRole('button', { name: 'Asignar', exact: true }))
      await expect(main().getByText('Solicitud asignada', { exact: false })).toBeVisible()
    })
  }

  await demo.step('Ambas quedan asignadas', async () => {
    await demo.select(page.locator('#filter-status'), 'assigned')
    await expect(main().getByText('SOL-2026-0001').first()).toBeVisible()
    await expect(main().getByText('SOL-2026-0002').first()).toBeVisible()
  })

  await demo.next()
})

test('RF6 · Citas, estado de atención y observaciones restringidas', async () => {
  await demo.rf('RF6', 'Citas, estado de atención y observaciones solo para perfiles autorizados', 'Víctor')
  await demo.logout()
  await demo.login('profesional@test.cl')
  await demo.go('/agendar-cita')

  for (const time of ['10:00', '15:30']) {
    await demo.step(`Agendar cita ${time} para SOL-2026-0001`, async () => {
      await demo.selectContaining(page.locator('#appointment-request'), 'SOL-2026-0001')
      await demo.fill(page.locator('#appointment-date'), NEXT_WEEK)
      await demo.fill(page.locator('#appointment-time'), time)
      await demo.fill(page.locator('#appointment-location'), 'Box 3, Bienestar Estudiantil')
      await demo.click(page.getByRole('button', { name: 'Agendar cita' }))
      // Al guardar, el formulario se vacía; se espera eso antes de agendar la siguiente
      await expect(main().getByText('Cita agendada', { exact: false })).toBeVisible()
      await expect(page.locator('#appointment-request')).toHaveValue('')
    })
  }
  await expect(main().getByRole('button', { name: 'Realizada' })).toHaveCount(2)

  await demo.step('Estado de atención: una realizada y una inasistencia', async () => {
    await demo.click(main().getByRole('button', { name: 'Realizada' }).first())
    await expect(main().getByRole('button', { name: 'Realizada' })).toHaveCount(1)
    await demo.click(main().getByRole('button', { name: 'No asistió' }).first())
    await expect(main().getByRole('button', { name: 'Realizada' })).toHaveCount(0)
  })

  await demo.step('Observación de seguimiento (se guarda cifrada)', async () => {
    await demo.go('/seguimiento')
    await demo.click(main().getByText('SOL-2026-0001').first())
    await demo.fill(
      page.locator('#follow-up-text'),
      'Primera sesión: se trabajan técnicas de respiración. Se acuerda nueva cita.',
    )
    await demo.click(page.getByRole('button', { name: 'Registrar observación' }))
    await expect(main().getByText(/técnicas de respiración/)).toBeVisible()
  })

  await demo.step('El docente no tiene acceso al seguimiento', async () => {
    await demo.logout()
    await demo.login('docente@test.cl')
    await page.goto('/seguimiento')
    await expect(page.getByText('Sin acceso a esta sección')).toBeVisible()
  })

  await demo.step('La estudiante ve sus citas, pero no las observaciones', async () => {
    await demo.logout()
    await demo.login(VALENTINA.email, VALENTINA.password)
    await expect(main().getByRole('heading', { name: 'Mis citas' })).toBeVisible()
    await expect(main()).not.toContainText('técnicas de respiración')
  })

  await demo.next()
})

test('RF7 · Notificaciones de recepción, asignación y cambios de estado', async () => {
  await demo.rf('RF7', 'Avisos de recepción, asignación y cambios de estado', 'Eliezer')

  await demo.step('Historia completa del caso en Mis avisos', async () => {
    for (const text of [
      'Recibimos tu solicitud SOL-2026-0001',
      'SOL-2026-0001 ahora está en revisión',
      'SOL-2026-0001 fue asignada a un profesional',
      'nueva cita por tu solicitud SOL-2026-0001',
      'SOL-2026-0001 ahora está en atención',
    ]) {
      await expect(main().getByText(text, { exact: false }).first()).toBeVisible()
    }
    await expect(main().getByText('6 sin leer')).toBeVisible()
  })

  await demo.step('Marcar un aviso como leído', async () => {
    await demo.click(main().getByRole('button', { name: 'Marcar como leído' }).first())
    await expect(main().getByText('5 sin leer')).toBeVisible()
  })

  await demo.next()
})

test('RF8 · Talleres, charlas y actividades con inscripción', async () => {
  await demo.rf('RF8', 'Talleres, charlas y actividades preventivas con inscripción', 'Víctor')
  await demo.logout()
  await demo.login('profesional@test.cl')
  await demo.go('/gestionar-talleres')

  await demo.step('Publicar un taller con 2 cupos', async () => {
    await demo.fill(page.locator('#title'), 'Manejo de la ansiedad en exámenes')
    await demo.select(page.locator('#kind'), { label: 'Taller' })
    await demo.fill(page.locator('#category'), 'Ansiedad')
    await demo.fill(page.locator('#date'), NEXT_WEEK)
    await demo.fill(page.locator('#startTime'), '16:00')
    await demo.fill(page.locator('#endTime'), '17:30')
    await demo.fill(page.locator('#capacity'), '2')
    await demo.select(page.locator('#modality'), { label: 'Presencial' })
    await demo.select(page.locator('#campus'), { label: 'Casa central' })
    await demo.fill(page.locator('#location'), 'Sala 204')
    await demo.fill(page.locator('#description'), 'Técnicas prácticas para enfrentar la época de pruebas.')
    await demo.click(page.getByRole('button', { name: 'Publicar actividad' }))
    await expect(main()).toContainText('Manejo de la ansiedad en exámenes')
    await expect(page.locator('#title')).toHaveValue('')
  })

  await demo.step('Publicar una charla en línea', async () => {
    await demo.fill(page.locator('#title'), 'Charla: dormir mejor')
    await demo.select(page.locator('#kind'), { label: 'Charla' })
    await demo.fill(page.locator('#date'), dateFromToday(8))
    await demo.fill(page.locator('#startTime'), '12:00')
    await demo.fill(page.locator('#endTime'), '13:00')
    await demo.fill(page.locator('#capacity'), '30')
    await demo.select(page.locator('#modality'), { label: 'En línea' })
    await demo.fill(page.locator('#location'), 'https://meet.example.cl/sueno')
    await demo.click(page.getByRole('button', { name: 'Publicar actividad' }))
    await expect(main()).toContainText('Charla: dormir mejor')
    await expect(page.locator('#title')).toHaveValue('')
  })

  await demo.step('Editar la charla: título, horario y cupos', async () => {
    await demo.click(workshopRow('Charla: dormir mejor').getByRole('button', { name: 'Editar' }))
    await expect(page.getByRole('heading', { name: 'Editar actividad' })).toBeVisible()
    await expect(page.locator('#title')).toHaveValue('Charla: dormir mejor')
    await demo.fill(page.locator('#title'), 'Charla: dormir mejor y rendir más')
    await demo.fill(page.locator('#startTime'), '12:30')
    await demo.fill(page.locator('#capacity'), '40')
    await demo.click(page.getByRole('button', { name: 'Guardar cambios' }))
    await expect(main().getByText('Se guardaron los cambios', { exact: false })).toBeVisible()
    await expect(workshopRow('dormir mejor y rendir más')).toContainText('40')
  })

  await demo.step('Valentina se inscribe; cancelar libera el cupo', async () => {
    await demo.logout()
    await demo.login(VALENTINA.email, VALENTINA.password)
    await demo.go('/talleres')
    await demo.click(card('Manejo de la ansiedad').getByRole('button', { name: 'Inscribirme' }))
    await expect(card('Manejo de la ansiedad').getByText('Inscrito')).toBeVisible()
    await demo.click(card('dormir mejor').getByRole('button', { name: 'Inscribirme' }))
    await demo.click(card('dormir mejor').getByRole('button', { name: 'Cancelar inscripción' }))
    await expect(main().getByText(/Cancelaste tu inscripción/)).toBeVisible()
  })

  await demo.step('Ana toma el último cupo: el taller queda sin cupos', async () => {
    await demo.logout()
    await demo.login('estudiante@test.cl')
    await demo.go('/talleres')
    await demo.click(card('Manejo de la ansiedad').getByRole('button', { name: 'Inscribirme' }))
    await expect(card('Manejo de la ansiedad').getByText('Sin cupos')).toBeVisible()
  })

  await demo.step('El profesional pasa asistencia en la nómina', async () => {
    await demo.logout()
    await demo.login('profesional@test.cl')
    await demo.go('/gestionar-talleres')
    await demo.click(main().getByRole('button', { name: /^Completos/ }))
    await demo.click(workshopRow('Manejo de la ansiedad').getByRole('button', { name: 'Ver nómina' }))
    const roster = page.getByRole('dialog')
    await expect(roster).toContainText('Valentina Ríos')
    await demo.click(roster.getByRole('button', { name: 'Marcar asistencia' }).first())
    await expect(roster).toContainText(/Asisti/)
    await demo.click(roster.getByRole('button', { name: 'Cerrar' }).last())
  })

  await demo.step('El cupo no puede quedar bajo los inscritos', async () => {
    await demo.click(workshopRow('Manejo de la ansiedad').getByRole('button', { name: 'Editar' }))
    await demo.fill(page.locator('#capacity'), '1')
    await demo.click(page.getByRole('button', { name: 'Guardar cambios' }))
    await expect(main().getByText('El cupo no puede ser menor que la cantidad de inscritos')).toBeVisible()
    await demo.click(page.getByRole('button', { name: 'Cancelar edición' }))
  })

  await demo.step('Cancelar la charla: se conserva con su historial', async () => {
    await demo.click(main().getByRole('button', { name: /^Todos/ }))
    page.once('dialog', (dialog) => dialog.accept())
    await demo.click(workshopRow('dormir mejor').getByRole('button', { name: 'Cancelar', exact: true }))
    await expect(workshopRow('dormir mejor')).toContainText('Cancelado')
  })

  await demo.next()
})

test('RF11 · Cerrar caso con motivo y derivación', async () => {
  await demo.rf('RF11', 'Cerrar caso con motivo de cierre y derivación realizada', 'Benjamín')
  await demo.go('/seguimiento')

  await demo.step('Motivo de cierre y derivación externa', async () => {
    await demo.click(main().getByText('SOL-2026-0002').first())
    await demo.fill(
      page.locator('#close-reason'),
      'El estudiante retomó la asistencia y no requiere más acompañamiento.',
    )
    await demo.select(page.locator('#close-referral-type'), { label: 'Derivación externa' })
    await demo.fill(page.locator('#close-destination'), 'CESFAM Santiago Centro')
    await demo.check(page.getByLabel(/Confirmo que el proceso/))
  })

  await demo.step('El caso queda cerrado y en solo lectura', async () => {
    await demo.click(page.getByRole('button', { name: 'Registrar cierre' }))
    await expect(main().getByText('CESFAM Santiago Centro').first()).toBeVisible()
    await expect(page.locator('#follow-up-text')).toHaveCount(0)
  })

  await demo.next()
})

test('RF9 · Usuarios, perfiles, tipos, sedes y unidades', async () => {
  await demo.rf('RF9', 'Administrar usuarios, perfiles, tipos de solicitud, sedes y unidades', 'Eliezer')
  await demo.logout()
  await demo.login('admin@test.cl')
  await demo.go('/admin-usuarios')
  const pedro = () => main().locator('tr', { hasText: 'pedro.lagos@test.cl' })

  await demo.step('Crear una cuenta de docente', async () => {
    await demo.fill(page.locator('#user-name'), 'Pedro Lagos')
    await demo.fill(page.locator('#user-email'), 'pedro.lagos@test.cl')
    await demo.fill(page.locator('#user-password'), 'docente1')
    await demo.select(page.locator('#user-role'), { label: 'Docente' })
    await demo.select(page.locator('#user-campus'), { label: 'Sede norte' })
    await demo.click(page.getByRole('button', { name: 'Registrar cuenta' }))
    await expect(pedro()).toContainText('Docente')
  })

  await demo.step('Cambiar su perfil a Profesional de apoyo', async () => {
    await demo.click(pedro().getByRole('button', { name: 'Editar' }))
    await expect(page.locator('#user-password')).toHaveCount(0)
    await demo.select(page.locator('#user-role'), { label: 'Profesional de apoyo' })
    await demo.select(page.locator('#user-unit'), { index: 1 })
    await demo.click(page.getByRole('button', { name: 'Guardar cambios' }))
    await expect(pedro()).toContainText('Profesional de apoyo')
  })

  await demo.step('Desactivar la cuenta', async () => {
    await demo.click(pedro().getByRole('button', { name: 'Desactivar' }))
    await expect(pedro().getByRole('button', { name: 'Activar' })).toBeVisible()
  })

  await demo.step('Perfiles: qué puede hacer cada uno y sus cuentas', async () => {
    await demo.click(main().getByRole('button', { name: 'Perfiles', exact: true }))
    const profiles = main().locator('tbody tr')
    await expect(profiles).toHaveCount(5)
    const professional = main().locator('tr', { hasText: 'Profesional de apoyo' })
    await expect(professional).toContainText('Atiende los casos que tiene asignados')
    await demo.click(professional.getByRole('button', { name: 'Ver cuentas' }))
    await expect(page.locator('#filter-profile')).toHaveValue('professional')
    await expect(main()).toContainText('Carolina Muñoz')
    await expect(pedro()).toBeVisible()
  })

  await demo.step('Catálogos: tipo de apoyo, sede y unidad', async () => {
    await demo.click(main().getByRole('button', { name: 'Tipos de apoyo, sedes y unidades' }))
    for (const [tab, name, code] of [
      ['Tipos de apoyo', 'Vocacional', 'vocacional'],
      ['Sedes', 'Sede Viña del Mar', 'vina'],
      ['Unidades de apoyo', 'Apoyo a la inclusión', 'inclusion'],
    ]) {
      await demo.click(main().getByRole('tab', { name: tab, exact: true }))
      await demo.fill(page.locator('#catalog-name'), name)
      await demo.fill(page.locator('#catalog-code'), code)
      await demo.click(main().getByRole('button', { name: 'Agregar' }))
      await expect(main()).toContainText(name)
      await expect(page.locator('#catalog-name')).toHaveValue('')
    }
    await demo.click(main().getByRole('tab', { name: 'Sedes', exact: true }))
    const sede = main().locator('li', { hasText: 'Sede Viña del Mar' }).last()
    await demo.click(sede.getByRole('button', { name: 'Desactivar' }))
    await expect(sede.getByRole('button', { name: 'Activar' })).toBeVisible()
  })

  await demo.step('Renombrar una unidad de apoyo', async () => {
    await demo.click(main().getByRole('tab', { name: 'Unidades de apoyo', exact: true }))
    await demo.click(main().locator('li', { hasText: 'Apoyo a la inclusión' }).getByRole('button', { name: 'Editar' }))
    await demo.fill(page.locator('#catalog-edit-name'), 'Apoyo a la inclusión y accesibilidad')
    await demo.click(main().getByRole('button', { name: 'Guardar', exact: true }))
    await expect(main().getByText('Nombre actualizado', { exact: false })).toBeVisible()
    await expect(main()).toContainText('Apoyo a la inclusión y accesibilidad')
  })

  await demo.step('La cuenta desactivada ya no puede ingresar', async () => {
    await demo.logout()
    await demo.fill(page.locator('#login-email'), 'pedro.lagos@test.cl')
    await demo.fill(page.locator('#login-password'), 'docente1')
    await demo.click(page.getByRole('button', { name: 'Ingresar' }))
    await expect(page.getByText('Correo o contraseña incorrectos')).toBeVisible()
    await demo.login('admin@test.cl')
  })

  await demo.next()
})

test('RF10 · Reportes agregados sin datos nominales', async () => {
  await demo.rf('RF10', 'Reportes agregados sin datos sensibles nominales', 'Fabián')
  await demo.go('/reportes')

  await demo.step('Solo conteos y promedios, sin nombres ni códigos', async () => {
    await expect(main().getByText(/no expone datos personales/)).toBeVisible()
    for (const forbidden of ['Valentina', 'Ana Pérez', 'SOL-2026', 'valentina@test.cl', 'respiración']) {
      await expect(main()).not.toContainText(forbidden)
    }
  })

  await demo.step('Filtrar por sede', async () => {
    await demo.select(page.locator('#filtro-campus'), { label: 'Casa central' })
    await expect(main().getByText(/no expone datos personales/)).toBeVisible()
    await demo.select(page.locator('#filtro-campus'), '')
  })

  await demo.step('Descargar el reporte en CSV, con la misma protección', async () => {
    const download = page.waitForEvent('download')
    await demo.click(page.getByRole('button', { name: 'Descargar CSV' }))
    const csv = readFileSync(await (await download).path(), 'utf8')
    expect(csv).toContain('Resumen;Solicitudes registradas;2')
    expect(csv).toContain('Por sede;')
    expect(csv).not.toMatch(/Por sede;[^;]*;[1-4]\r?$/m)
    for (const forbidden of ['Valentina', 'Ana Pérez', 'SOL-2026', '@test.cl', 'respiración']) {
      expect(csv).not.toContain(forbidden)
    }
  })

  await demo.next()
})

test('RF12 · Bitácora de accesos y modificaciones', async () => {
  await demo.rf('RF12', 'Bitácora de accesos y modificaciones en casos sensibles', 'Benjamín')
  await demo.go('/bitacora')
  const entries = () => main().locator('li[tabindex="0"]')
  const detail = () => page.getByRole('article', { name: 'Detalle del registro' })

  await demo.step('Intentos fallidos de ingreso', async () => {
    await demo.select(page.locator('#filter-action'), { label: 'Intento fallido de ingreso' })
    await expect(entries()).toHaveCount(2)
  })

  await demo.step('Quién abrió un caso sensible, cuándo y desde dónde', async () => {
    await demo.select(page.locator('#filter-action'), { label: 'Consulta de datos sensibles' })
    await demo.click(entries().first())
    await expect(detail()).toContainText('Consulta de datos sensibles')
  })

  await demo.step('Modificaciones: solo nombres de campos, nunca valores', async () => {
    await demo.select(page.locator('#filter-action'), { label: 'Modificación' })
    await demo.click(entries().first())
    await expect(detail()).toBeVisible()
  })

  await demo.rf('Fin', 'Recorrimos los 12 requerimientos de la rúbrica', '')
  await demo.next('Terminar')
})
