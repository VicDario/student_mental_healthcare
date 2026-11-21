import { test as base, expect } from '@playwright/test'
import { captionScript } from './caption.js'

export { expect }

// Una sola pestaña para todo el recorrido, como en una presentación real
export const test = base.extend({
  demoMode: [false, { option: true, scope: 'worker' }],
  // Milisegundos que espera cada pausa antes de seguir sola (0 = esperar el botón)
  demoAutoplay: [0, { option: true, scope: 'worker' }],
  // Milisegundos de pausa al terminar cada paso, para que el público vea el resultado
  demoStepDelay: [0, { option: true, scope: 'worker' }],
  // Milisegundos que cada elemento queda marcado antes de usarlo (clic, escribir, elegir)
  demoActionDelay: [0, { option: true, scope: 'worker' }],
  demoPage: [
    async ({ browser, demoMode }, use, workerInfo) => {
      const { baseURL, viewport, locale, timezoneId } = workerInfo.project.use
      const context = await browser.newContext({ baseURL, viewport, locale, timezoneId })
      if (demoMode) await context.addInitScript(captionScript)
      const page = await context.newPage()
      await use(page)
      await context.close()
    },
    { scope: 'worker' },
  ],
})

// Acciones del recorrido. En modo demo resaltan el elemento antes de usarlo,
// actualizan el rótulo y esperan el botón "Siguiente" entre un RF y otro.
export function createDemo(page, { demoMode = false, autoplay = 0, stepDelay = 0, actionDelay = 0 } = {}) {
  let current = null

  async function setCaption(data) {
    current = data
    if (!demoMode) return
    await page.evaluate((value) => {
      sessionStorage.setItem('demo-caption', JSON.stringify(value))
      window.__demoRender?.()
    }, data)
  }

  async function show(locator) {
    if (!demoMode) return
    // Centra el elemento (lejos de la barra inferior) y lo marca con un borde naranjo.
    // Espera con el borde visible antes de usarlo, para que el público vea qué va a pasar.
    const wait = Math.max(actionDelay, 450)
    await locator.evaluate((el, visibleFor) => {
      el.scrollIntoView({ block: 'center', behavior: 'instant' })
      const previous = { outline: el.style.outline, offset: el.style.outlineOffset }
      el.style.outline = '3px solid #f59e0b'
      el.style.outlineOffset = '3px'
      setTimeout(() => {
        el.style.outline = previous.outline
        el.style.outlineOffset = previous.offset
      }, visibleFor)
    }, wait + 500)
    await page.waitForTimeout(wait)
  }

  const demo = {
    async rf(id, title, presenter) {
      await setCaption({ id, title, presenter, step: '' })
    },

    async step(text, body) {
      await setCaption({ ...current, step: text })
      const result = await test.step(text, body)
      if (demoMode && stepDelay > 0) await page.waitForTimeout(stepDelay)
      return result
    },

    // Pausa hasta que alguien presione el botón del rótulo
    async next(label = 'Siguiente ▶') {
      if (!demoMode) return
      await setCaption({ ...current, waiting: label })
      await page.evaluate(() => {
        window.__demoNext = false
      })
      const pressed = page.waitForFunction(() => window.__demoNext === true, null, { timeout: autoplay })
      // Con autoplay, al cumplirse el tiempo se sigue aunque nadie presione el botón
      await (autoplay ? pressed.catch(() => {}) : pressed)
      await setCaption({ ...current, waiting: undefined })
    },

    async click(locator) {
      await show(locator)
      await locator.click()
    },

    async fill(locator, value) {
      await show(locator)
      await locator.fill(value)
    },

    async check(locator) {
      await show(locator)
      await locator.check()
    },

    async select(locator, option) {
      await show(locator)
      await locator.selectOption(option)
    },

    // Elige la opción cuyo texto contiene `text` (por ejemplo "Carolina Muñoz")
    async selectContaining(locator, text) {
      const value = await locator.locator('option', { hasText: text }).first().getAttribute('value')
      await demo.select(locator, value)
    },

    // Usa el enlace del menú si está visible; si el menú está colapsado, navega directo
    async go(path) {
      const link = page.locator(`#primaryNav a[href="${path}"]`)
      if (await link.isVisible()) await demo.click(link)
      else await page.goto(path)
      await expect(page).toHaveURL(new RegExp(`${path}$`))
    },

    async login(email, password = '123456') {
      await page.goto('/login')
      await demo.fill(page.locator('#login-email'), email)
      await demo.fill(page.locator('#login-password'), password)
      await demo.click(page.getByRole('button', { name: 'Ingresar' }))
      await expect(page).not.toHaveURL(/\/login$/)
    },

    async logout() {
      await demo.click(page.getByRole('button', { name: 'Cerrar sesión' }))
      await expect(page).toHaveURL(/\/login$/)
    },
  }

  return demo
}

// Fecha local YYYY-MM-DD a `days` días de hoy (citas y talleres deben ser futuros)
export function dateFromToday(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}
