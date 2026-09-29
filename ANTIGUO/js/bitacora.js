// IIFE (función inmediatamente invocada): encapsula todo el código para no contaminar el scope global.
// Todo lo que se declare adentro no existe fuera — evita conflictos con otros scripts de la página.
(function () {
  'use strict'; // activa el modo estricto: JS lanza errores en vez de ignorar fallos silenciosos

  // Objeto constante: datos estáticos de cada registro de bitácora, indexados por ID.
  // Se usa un objeto en vez de un array para poder acceder a cada registro directamente por su clave (ENTRIES['BIT-0031'])
  // sin tener que recorrer toda la lista buscándolo.
  const ENTRIES = {
    'BIT-0031': {
      type: 'modify', typeLabel: 'Modificación', sensitive: true,
      caseCode: 'CAS-0089', caseName: 'Acompañamiento en crisis',
      action: 'Cambio de clasificación: tipo de apoyo y prioridad de atención',
      user: 'Psic. Valentina Rojas', unit: 'Atención psicológica',
      datetime: '2026-09-06T09:22:41',
      datetimeLabel: 'Domingo 6 de septiembre de 2026, 09:22:41',
      ip: '192.168.1.104 — Red interna universitaria',
      before: 'Tipo de apoyo: <strong>Emocional</strong> · Prioridad: <strong>Media</strong>',
      after:  'Tipo de apoyo: <strong>Psicológico</strong> · Prioridad: <strong>Alta</strong>',
    },
    'BIT-0030': {
      type: 'access', typeLabel: 'Acceso', sensitive: true,
      caseCode: 'CAS-0089', caseName: 'Acompañamiento en crisis',
      action: 'Consulta de ficha completa del caso',
      user: 'Admin Unidad', unit: 'Unidad central',
      datetime: '2026-09-06T09:14:03',
      datetimeLabel: 'Domingo 6 de septiembre de 2026, 09:14:03',
      ip: '192.168.1.101 — Red interna universitaria',
      before: null, after: null, // null indica que este registro no tiene bloque "Antes / Después"
    },
    'BIT-0029': {
      type: 'restrict', typeLabel: 'Restricción', sensitive: true,
      caseCode: 'CAS-0091', caseName: 'Seguimiento preventivo primer año',
      action: 'Restricción de acceso: solo administrador y psicólogo asignado',
      user: 'Admin Unidad', unit: 'Unidad central',
      datetime: '2026-09-05T16:45:22',
      datetimeLabel: 'Sábado 5 de septiembre de 2026, 16:45:22',
      ip: '192.168.1.101 — Red interna universitaria',
      before: 'Acceso: <strong>Todas las unidades habilitadas</strong>',
      after:  'Acceso: <strong>Restringido — solo Admin y psicólogo asignado</strong>',
    },
    'BIT-0028': {
      type: 'access', typeLabel: 'Acceso', sensitive: true,
      caseCode: 'CAS-0091', caseName: 'Seguimiento preventivo primer año',
      action: 'Revisión de historial de intervenciones',
      user: 'T.S. Marcela Fuentes', unit: 'Trabajo social',
      datetime: '2026-09-05T16:30:07',
      datetimeLabel: 'Sábado 5 de septiembre de 2026, 16:30:07',
      ip: '192.168.2.55 — Red interna universitaria',
      before: null, after: null,
    },
    'BIT-0027': {
      type: 'export', typeLabel: 'Exportación', sensitive: false,
      caseCode: 'CAS-0078', caseName: 'Orientación económica y beneficios',
      action: 'Generación de informe de seguimiento en formato PDF',
      user: 'Dir. Gabriela Muñoz', unit: 'Dirección de bienestar',
      datetime: '2026-09-04T11:00:34',
      datetimeLabel: 'Viernes 4 de septiembre de 2026, 11:00:34',
      ip: '192.168.1.5 — Red interna universitaria',
      before: null, after: null,
    },
    'BIT-0026': {
      type: 'modify', typeLabel: 'Modificación', sensitive: false,
      caseCode: 'CAS-0078', caseName: 'Orientación económica y beneficios',
      action: 'Actualización de observaciones clínicas en ficha de seguimiento',
      user: 'Psic. Valentina Rojas', unit: 'Atención psicológica',
      datetime: '2026-09-04T10:48:19',
      datetimeLabel: 'Viernes 4 de septiembre de 2026, 10:48:19',
      ip: '192.168.1.104 — Red interna universitaria',
      before: 'Observación: <strong>(sin registro previo)</strong>',
      after:  'Observación: <strong>Se agregó evaluación de progreso y plan de acción para el siguiente mes.</strong>',
    },
  };

  // Objeto constante: mapea cada tipo de registro a su clase CSS de badge.
  // Se usa notación de objeto para hacer la búsqueda por clave: BADGE_CLASS['modify'] → 'badge-modify'
  // Es más limpio que un switch o varios if/else.
  const BADGE_CLASS = {
    access: 'badge-access', modify: 'badge-modify',
    restrict: 'badge-restrict', export: 'badge-export',
  };

  // Función declarada: construye e inyecta el HTML del panel de detalle para el registro indicado.
  // Recibe el id del registro (ej: 'BIT-0031') y busca sus datos en el objeto ENTRIES.
  function renderDetail(id) {
    const e = ENTRIES[id]; // acceso directo por clave — devuelve el objeto del registro o undefined
    const body = document.getElementById('log-detail-body');
    if (!e || !body) return; // guarda: si el id no existe en ENTRIES o el panel no está en el DOM, no hace nada

    // setAttribute actualiza el atributo aria-label para lectores de pantalla
    body.setAttribute('aria-label', 'Detalle de ' + id);

    // Operador ternario: genera el HTML del indicador de sensibilidad solo si e.sensitive es true.
    // Si es false, sensitiveHTML queda como string vacío y no se renderiza nada.
    const sensitiveHTML = e.sensitive
      ? `<span class="sensitivity-indicator">
           <span class="sensitivity-dot"></span>Caso sensible
         </span>`
      : '';

    // Operador ternario: genera el bloque "Antes / Después" solo si el registro tiene ambos valores.
    // (e.before && e.after) es false si cualquiera de los dos es null — en ese caso changesHTML es ''.
    const changesHTML = (e.before && e.after)
      ? `<div class="detail-divider"></div>
         <p class="detail-label detail-label-spaced">Cambios registrados</p>
         <div class="detail-change-block detail-change-before">
           <span class="detail-change-label">Antes</span>${e.before}
         </div>
         <div class="detail-change-block detail-change-after">
           <span class="detail-change-label">Después</span>${e.after}
         </div>`
      : '';

    // Template literal: construye todo el HTML del panel de detalle de una vez e inyecta las variables
    // con ${}. Las variables sensitiveHTML y changesHTML se insertan tal cual — si son '' no aparece nada.
    body.innerHTML = `
      <div class="detail-header">
        <p class="case-summary-code">${id}</p>
        <span class="badge ${BADGE_CLASS[e.type]}">${e.typeLabel}</span>
        ${sensitiveHTML}
      </div>
      <div class="detail-divider"></div>
      <div class="detail-field">
        <p class="detail-label">Caso afectado</p>
        <p class="detail-value"><strong>${e.caseCode}</strong> — ${e.caseName}</p>
      </div>
      <div class="detail-field">
        <p class="detail-label">Acción realizada</p>
        <p class="detail-value">${e.action}</p>
      </div>
      <div class="detail-field">
        <p class="detail-label">Usuario responsable</p>
        <p class="detail-value">${e.user} — ${e.unit}</p>
      </div>
      <div class="detail-field">
        <p class="detail-label">Fecha y hora</p>
        <p class="detail-value">
          <time datetime="${e.datetime}">${e.datetimeLabel}</time>
        </p>
      </div>
      <div class="detail-field">
        <p class="detail-label">Dirección IP</p>
        <p class="detail-value detail-mono">${e.ip}</p>
      </div>
      ${changesHTML}
      <div class="detail-divider"></div>
      <div class="form-actions">
        <button class="button button-secondary" id="btn-export" type="button">
          Exportar este registro
        </button>
      </div>
      <p class="export-toast" id="export-toast" role="status"></p>`;

    // El botón #btn-export se acaba de crear con innerHTML, por eso el addEventListener va aquí
    // y no antes — si fuera antes, el botón aún no existiría en el DOM.
    // Callback flecha: pasa el id actual a exportEntry gracias al closure.
    document.getElementById('btn-export').addEventListener('click', () => exportEntry(id));
  }

  // querySelectorAll devuelve una NodeList con todos los elementos .log-entry del HTML
  const logItems = document.querySelectorAll('.log-entry');

  // Función declarada: marca visualmente la entrada seleccionada y renderiza su detalle.
  function selectEntry(item) {
    // forEach con función flecha: recorre todas las entradas y les quita la selección previa
    logItems.forEach(li => {
      li.classList.remove('log-entry-selected');
      li.setAttribute('aria-pressed', 'false'); // ARIA: indica que este elemento ya no está activo
      const btn = li.querySelector('.button-quiet');
      if (btn) btn.textContent = 'Ver detalle'; // restaura el texto del botón en las no seleccionadas
    });

    // Marca solo la entrada clicada como seleccionada
    item.classList.add('log-entry-selected');
    item.setAttribute('aria-pressed', 'true'); // ARIA: indica que este elemento está activo/presionado
    const btn = item.querySelector('.button-quiet');
    if (btn) btn.textContent = 'Viendo detalle'; // cambia el texto del botón para dar feedback visual

    // Llama a renderDetail con el id guardado en el atributo data-id del HTML (ej: data-id="BIT-0031")
    // dataset.id lee ese atributo como propiedad JS
    renderDetail(item.dataset.id);
  }

  // forEach + callbacks flecha: registra eventos de clic y teclado en cada entrada de la lista.
  // Cada item captura su propia referencia por closure, igual que en el forEach de clasificacion.js.
  logItems.forEach(item => {
    item.addEventListener('click', () => selectEntry(item));

    // Evento de teclado (callback flecha): permite navegar y seleccionar con teclado para accesibilidad.
    // Enter y Espacio son las teclas estándar para activar elementos interactivos sin mouse.
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // evita que Espacio haga scroll en la página
        selectEntry(item);
      }
    });
  });

  // Función declarada: muestra un mensaje de confirmación de exportación temporal (toast).
  // Un "toast" es un mensaje que aparece brevemente y desaparece solo, sin interacción del usuario.
  function exportEntry(id) {
    const toast = document.getElementById('export-toast');
    if (!toast) return; // guarda: si el toast no está en el DOM, no hace nada
    toast.textContent = `Registro ${id} preparado para exportación. Revisa la bandeja de descargas.`;
    toast.classList.add('visible'); // la clase 'visible' en CSS muestra el elemento (opacity/display)
    // setTimeout: ejecuta el callback flecha una sola vez después de 4000ms (4 segundos)
    // El callback quita la clase 'visible', ocultando el toast automáticamente
    setTimeout(() => toast.classList.remove('visible'), 4000);
  }

})();
