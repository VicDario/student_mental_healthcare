import { defineConfig } from '@playwright/test'

// Por defecto apunta a los servidores de desarrollo; se pueden cambiar con
// E2E_BASE_URL (frontend) y E2E_API_URL (backend) para probar en otros puertos.
const BASE_URL = process.env.E2E_BASE_URL ?? 'http://localhost:5173'
const API_URL = process.env.E2E_API_URL ?? 'http://localhost:3000'

// E2E_HEADLESS=1 corre la demo sin ventana (solo para probar el recorrido).
// E2E_ACTION_DELAY cambia cuánto se marca cada elemento antes de usarlo (milisegundos, por defecto 3000).
// E2E_STEP_DELAY cambia la pausa al final de cada paso (milisegundos, por defecto 2000).
const DEMO_USE = {
  demoMode: true,
  demoActionDelay: Number(process.env.E2E_ACTION_DELAY ?? 3000),
  demoStepDelay: Number(process.env.E2E_STEP_DELAY ?? 2000),
  headless: process.env.E2E_HEADLESS === '1',
  viewport: null,
  launchOptions: { slowMo: 300, args: ['--start-maximized'] },
}

// Formas de correr el mismo recorrido de los RF:
// - demo: navegador visible, en cámara lenta, con un rótulo por RF y un botón
//   "Siguiente" para avanzar cuando el equipo termina de explicar.
// - demo-auto: igual, pero avanza sola; sirve para ensayar.
// - check: sin ventana y a velocidad normal, para comprobar que todo funciona.
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    locale: 'es-CL',
    timezoneId: 'America/Santiago',
  },
  // Si el backend o el frontend no están corriendo, Playwright los levanta.
  // MongoDB debe estar encendido antes (podman start smh-mongo).
  webServer: [
    {
      command: 'npm run dev --prefix ../backend',
      url: `${API_URL}/api/health`,
      reuseExistingServer: true,
      timeout: 60_000,
    },
    {
      command: 'npm run dev --prefix ../frontend',
      url: BASE_URL,
      reuseExistingServer: true,
      timeout: 60_000,
    },
  ],
  projects: [
    {
      name: 'demo',
      timeout: 0,
      use: { ...DEMO_USE },
    },
    {
      // Igual que demo, pero cada pausa sigue sola a los 6 segundos (para ensayar)
      name: 'demo-auto',
      timeout: 0,
      use: { ...DEMO_USE, demoAutoplay: 6_000 },
    },
    {
      name: 'check',
      timeout: 60_000,
      use: {
        demoMode: false,
        headless: true,
        viewport: { width: 1400, height: 900 },
      },
    },
  ],
})
