let options = {}

const dot = (md, opts = {}) => {
  options = opts
  const temp = md.renderer.rules.fence.bind(md.renderer.rules)

  md.renderer.rules.fence = (tokens, idx, options, env, slf) => {
    const token = tokens[idx]
    try {
      if (token.info && (token.info.trim() === 'dot' || token.info.trim() === 'graphviz')) {
        const code = token.content.trim()
        return `<div class="dot">${code}</div>`
      }
    } catch (e) {
      console.error(`Parse dot Error:`, e)
    }
    return temp(tokens, idx, options, env, slf)
  }
}

export const renderDot = async () => {
  if (typeof window === 'undefined') return

  // Lade Viz nur, wenn es nicht schon geladen ist
  if (!window.Viz || typeof window.Viz.instance !== 'function') {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = '/_static/viz-global.js'
      script.onload = resolve
      script.onerror = (err) => {
        console.error('Fehler beim Laden von viz-global.js:', err)
        reject(err)
      }
      document.head.appendChild(script)
    })
  }

  const viz = await window.Viz.instance()

  document.querySelectorAll('.dot').forEach(async item => {
    const code = item.textContent
    item.textContent = ''
    try {
      const svg = await viz.renderSVGElement(code)
      item.appendChild(svg)
    } catch (e) {
      console.error('Fehler beim Rendern von DOT:', e)
      item.textContent = code // Im Fehlerfall Code anzeigen
    }
  })
}

export default dot
