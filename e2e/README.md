# Demo automatizada de los RF

Recorre en el navegador los 12 requerimientos de la rúbrica del Caso 5, en el mismo orden que el guion de la
presentación (RF1–RF8, RF11, RF9, RF10, RF12). Está hecha con [Playwright](https://playwright.dev).

Cada RF es un test. En modo demo, el navegador se abre maximizado y avanza en cámara lenta, marcando con un borde
naranjo cada elemento antes de usarlo. Una barra al pie de la página muestra el RF en curso, quién lo presenta y el
paso actual. Después de cada paso espera 2 segundos para que se vea el resultado, y al terminar cada RF se detiene
hasta que alguien presiona **Siguiente ▶** en esa barra, así el equipo explica con calma.

## Requisitos

- MongoDB encendido: `podman start smh-mongo` (o `docker start smh-mongo`).
- `backend/.env` configurado (ver el README principal).
- Una vez, instalar Playwright y su navegador:

  ```bash
  cd e2e
  npm run setup
  ```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run demo` | Siembra la base y abre la demo. Espera el botón **Siguiente ▶** entre RF. |
| `npm run demo:auto` | Igual, pero cada pausa sigue sola a los 6 segundos. Sirve para ensayar. |
| `npm run check` | Siembra la base y corre el recorrido sin ventana, en unos 15 segundos. Úsenlo antes de presentar para confirmar que todo funciona. |
| `npm run report` | Abre el informe del último recorrido, con cada RF y sus pasos. |

> **Los tres primeros borran la base de datos** de `backend/.env` (corren `npm run seed`), porque el recorrido
> necesita empezar desde cero: así los códigos salen `SOL-2026-0001` y `SOL-2026-0002`.

Si el backend (puerto 3000) o el frontend (puerto 5173) no están corriendo, Playwright los levanta solo. Si ya
están corriendo, los usa.

## Otros puertos

Para probar contra servidores en otros puertos, sin sembrar la base de desarrollo:

```bash
E2E_BASE_URL=http://localhost:5199 E2E_API_URL=http://localhost:3999 npx playwright test --project=check
```

`E2E_HEADLESS=1` corre los modos demo sin abrir ventana. `E2E_STEP_DELAY` cambia la pausa al final de cada paso de
la demo, en milisegundos (por defecto `2000`; por ejemplo `E2E_STEP_DELAY=3000 npm run demo`).

## Archivos

- `tests/rf-demo.spec.js`: el recorrido, un test por RF.
- `tests/support.js`: acciones de la demo (resaltar, pausar, ingresar, cerrar sesión).
- `tests/caption.js`: la barra que se muestra al pie de la página.
- `playwright.config.js`: los modos `demo`, `demo-auto` y `check`.
