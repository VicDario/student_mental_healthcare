/* ============================================================
   ¿QUÉ ES UNA IIFE?
   IIFE = Immediately Invoked Function Expression
   (Función inmediatamente invocada)

   Es una función que se define y se ejecuta al mismo tiempo,
   en la misma línea. La sintaxis es:

       (function() {
         // código
       })();
       ↑               ↑
   se envuelve       los () del final
   en paréntesis     la invocan de inmediato

   ¿POR QUÉ SE USA AQUÍ?
   En este archivo se declaran variables como "cards" y "selected".
   Sin IIFE, esas variables quedarían en el scope global — accesibles
   desde cualquier otro script de la página, lo que puede causar
   conflictos si otro archivo usa variables con el mismo nombre.

   Con IIFE, todo lo que se declare adentro solo existe dentro
   de esa función. Al terminar la función, desaparece. El scope
   global queda limpio.

   En clasificacion.js no se usa IIFE porque sus variables
   (classifyForm, datosLista, etc.) son únicas y no hay riesgo
   de colisión. Aquí sí se usa porque "cards" y "selected"
   son nombres genéricos que podrían repetirse en otros scripts.
   ============================================================ */

/* ============================================================
   BLOQUE 1 — SELECCIÓN DE TARJETA
   Registra un evento de clic y uno de teclado en cada tarjeta
   de caso. Al activar una, se limpia la selección anterior,
   se marca la nueva visualmente con CSS y ARIA, y se guarda
   en la variable "selected" para que el formulario sepa
   sobre cuál tarjeta operar.
   ============================================================ */

// IIFE (función inmediatamente invocada): encapsula el código para no contaminar el scope global.
(function () {
  'use strict'; // activa el modo estricto: JS lanza errores en vez de ignorar fallos silenciosos

  // querySelectorAll devuelve una NodeList con todas las tarjetas .case-card del HTML
  const cards = document.querySelectorAll('.case-card');

  // "selected" guarda la tarjeta actualmente activa para usarla en el formulario de cierre.
  // Se inicializa buscando si alguna ya tiene la clase seleccionada desde el HTML.
  // Se usa "let" (no "const") porque su valor cambia cada vez que el usuario elige otra tarjeta.
  let selected = document.querySelector('.case-card-selected');

  // forEach + callback flecha: itera sobre cada tarjeta y le registra dos eventos
  cards.forEach(card => {

    // Evento de clic (callback flecha): se ejecuta cuando el usuario hace clic en la tarjeta
    card.addEventListener('click', () => {

      // forEach anidado con función flecha: recorre TODAS las tarjetas y les quita la selección
      // antes de marcar la nueva — así solo una puede estar activa a la vez
      cards.forEach(c => {
        c.classList.remove('case-card-selected'); // quita el estilo visual de seleccionado
        c.setAttribute('aria-pressed', 'false');  // ARIA: indica que este elemento ya no está activo
      });

      card.classList.add('case-card-selected'); // marca visualmente la tarjeta clicada
      card.setAttribute('aria-pressed', 'true'); // ARIA: indica que este elemento está activo
      selected = card; // actualiza la variable para que el formulario sepa cuál está elegida
    });

    // Evento de teclado (callback flecha): permite operar con teclado para accesibilidad.
    // Enter y Espacio son las teclas estándar para activar elementos interactivos sin mouse.
    // card.click() simula un clic real, reutilizando el evento de clic ya registrado arriba.
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); // evita que Espacio haga scroll en la página
        card.click();
      }
    });
  });


  /* ============================================================
     BLOQUE 2 — FORMULARIO DE CIERRE DE CASO
     Al enviar el formulario se verifica que haya una tarjeta
     seleccionada y que no esté pendiente. Si pasa la validación,
     la tarjeta se marca como cerrada visualmente (CSS + badge),
     el formulario se oculta y aparece un mensaje de confirmación.
     ============================================================ */

  // getElementById busca el formulario de cierre en el DOM
  const form = document.getElementById('close-form');

  // Guarda: si el formulario no existe en la página, la función termina aquí.
  // El "return" dentro de una IIFE sale de la función completa.
  if (!form) return;

  // Evento de envío (callback flecha): intenta cerrar la tarjeta seleccionada
  form.addEventListener('submit', e => {
    e.preventDefault(); // cancela el comportamiento por defecto (recargar la página)

    // Doble guarda: no procede si no hay tarjeta seleccionada, o si su estado es "pending".
    // dataset.status lee el atributo data-status del HTML (ej: <div data-status="pending">)
    if (!selected || selected.dataset.status === 'pending') return;

    // Agrega la clase CSS que aplica el estilo visual de "caso cerrado" (opacidad, color, etc.)
    selected.classList.add('case-card-closed');

    // Actualiza el atributo data-status en el DOM para reflejar el nuevo estado
    selected.dataset.status = 'closed';

    // querySelector busca el badge (etiqueta de estado) dentro de la tarjeta seleccionada
    const badge = selected.querySelector('.badge');

    // Guarda: solo modifica el badge si existe en el HTML de esa tarjeta
    // Se reemplaza toda la className para limpiar cualquier clase de estado anterior
    if (badge) { badge.className = 'badge badge-closed'; badge.textContent = 'Cerrado'; }

    // Oculta el formulario asignando hidden = true (equivale a agregar el atributo hidden al HTML)
    form.hidden = true;

    // Busca el bloque de confirmación y lo hace visible agregando la clase 'visible'
    // La clase 'visible' en el CSS controla su aparición (display, opacity, etc.)
    const conf = document.getElementById('close-confirmation');
    if (conf) conf.classList.add('visible');
  });

// })() — los paréntesis del final invocan la función de inmediato al cargar el script
})();
