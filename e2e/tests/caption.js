// Barra fija al pie de la página: muestra el RF en curso, quién presenta y el
// paso actual. La página reserva ese espacio abajo para que la barra no tape
// formularios ni botones. Se vuelve a dibujar después de cada recarga.
export function captionScript() {
  const HEIGHT = 52

  const render = () => {
    let data = null
    try {
      data = JSON.parse(sessionStorage.getItem('demo-caption') || 'null')
    } catch {
      data = null
    }
    let bar = document.getElementById('demo-caption')
    if (!data) {
      bar?.remove()
      return
    }
    if (!bar) {
      bar = document.createElement('aside')
      bar.id = 'demo-caption'
      bar.setAttribute('aria-live', 'polite')
      Object.assign(bar.style, {
        position: 'fixed',
        left: '0',
        right: '0',
        bottom: '0',
        height: `${HEIGHT}px`,
        zIndex: '2147483647',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        padding: '0 16px',
        background: '#1b4332',
        color: '#ffffff',
        boxShadow: '0 -6px 20px rgba(0,0,0,0.25)',
        font: '13px/1.3 system-ui, sans-serif',
      })
      document.body.appendChild(bar)
      document.body.style.paddingBottom = `${HEIGHT + 16}px`
      document.documentElement.style.scrollPaddingBottom = `${HEIGHT + 16}px`
    }
    bar.replaceChildren()

    const id = document.createElement('strong')
    id.textContent = data.id
    id.style.cssText = 'flex:none;font-size:18px;letter-spacing:-0.01em;min-width:52px'

    const text = document.createElement('div')
    text.style.cssText = 'flex:1;min-width:0'
    const title = document.createElement('div')
    title.textContent = data.title
    title.style.cssText = 'font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'
    text.append(title)
    if (data.step) {
      const step = document.createElement('div')
      step.textContent = data.step
      step.style.cssText = 'font-size:12px;opacity:0.85;white-space:nowrap;overflow:hidden;text-overflow:ellipsis'
      text.append(step)
    }

    bar.append(id, text)

    if (data.presenter) {
      const who = document.createElement('span')
      who.textContent = `Presenta: ${data.presenter}`
      who.style.cssText = 'flex:none;font-size:12px;opacity:0.8'
      bar.append(who)
    }

    if (data.waiting) {
      const next = document.createElement('button')
      next.type = 'button'
      next.textContent = data.waiting
      next.style.cssText =
        'flex:none;padding:6px 14px;border:0;border-radius:999px;background:#ffffff;color:#1b4332;font-weight:700;font-size:13px;cursor:pointer'
      next.addEventListener('click', () => {
        window.__demoNext = true
      })
      bar.append(next)
      next.focus()
    }
  }

  window.__demoRender = render
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render)
  else render()
}
