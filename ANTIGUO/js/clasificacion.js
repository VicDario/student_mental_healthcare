// ¿Qué hace?

// Gestiona la pantalla de clasificación de solicitudes. Tiene dos
// responsabilidades:

// 1. Selección de tarjeta (Bloque 1): Cuando el usuario clica una
// tarjeta del panel izquierdo, la resalta visualmente y copia su
// código y resumen al panel derecho, para que el formulario sepa
// sobre qué solicitud se está trabajando.
// 2. Envío del formulario (Bloque 3): Al hacer submit intercepta el
// evento (preventDefault), lee los valores de todos los campos
// (tipo, prioridad, unidad de apoyo, observación, acceso
// restringido), los estructura en un array y los renderiza como una
// lista HTML visible debajo del formulario.

// ---
// ¿Dónde guarda los datos?

// En ningún lado de forma persistente. Los datos solo existen en:
// - Variables locales dentro del evento submit (se pierden al
// recargar).
// - El DOM: se renderizan en #datos-lista dentro de #datos-enviados.

// No hay llamadas a localStorage, sessionStorage, fetch/XHR, ni
// ninguna API de backend.

// ---
// Limitaciones

// Limitación: Sin persistencia
// Detalle: Recargar la página borra todo.
// ────────────────────────────────────────
// Limitación: Sin validación real
// Detalle: No verifica que haya tarjeta seleccionada antes de enviar

//   — solicitudCodigo podría quedar vacío.
// ────────────────────────────────────────
// Limitación: Sin feedback de error
// Detalle: Si falta un campo obligatorio no se muestra mensaje al
//   usuario.
// ────────────────────────────────────────
// Limitación: Un solo submit
// Detalle: Cada envío sobreescribe el resumen anterior; no acumula
//   historial.
// ────────────────────────────────────────
// Limitación: Sin comunicación con servidor
// Detalle: El formulario no envía datos a ningún backend.

/* ============================================================
   BLOQUE 1 — SELECCIÓN DE TARJETA
   Cuando el usuario hace clic en una tarjeta del panel izquierdo,
   se marca visualmente como seleccionada y se copian su código
   y resumen al panel derecho para que el formulario sepa
   sobre qué solicitud se está trabajando.
   ============================================================ */

// Función declarada: marca la tarjeta seleccionada y actualiza el panel derecho con sus datos.
function selectCard(card) {
  // forEach con función flecha: quita la selección de todas las tarjetas antes de marcar la nueva
  document
    .querySelectorAll(".request-card")
    .forEach((c) => c.classList.remove("request-card-selected"));
  card.classList.add("request-card-selected");

  // Actualiza el código y resumen del panel derecho con el contenido de la tarjeta clicada
  document.querySelector(".case-summary-code").textContent =
    card.querySelector(".request-code").textContent;

  document.querySelector(".case-summary-text").textContent = card
    .querySelector(".request-summary")
    .textContent.trim();
}

// forEach + callback flecha: registra el evento de clic en cada tarjeta de solicitud
document.querySelectorAll(".request-card").forEach((card) => {
  card.addEventListener("click", () => selectCard(card));
});

/* ============================================================
   BLOQUE 2 — REFERENCIAS AL DOM
   Se obtienen de una vez los tres elementos que se necesitan
   en el evento submit: el formulario, el bloque de resumen
   y la lista donde se renderizan los datos capturados.
   ============================================================ */

// Referencias a los elementos del formulario y del bloque de resumen
const classifyForm = document.getElementById("classify-form");
const datosEnviados = document.getElementById("datos-enviados");
const datosLista = document.getElementById("datos-lista");

/* ============================================================
   BLOQUE 3 — ENVÍO DEL FORMULARIO
   Al hacer submit se leen todos los campos del formulario
   (select, radio, textarea, checkbox), se estructuran en un
   array de objetos y se renderizan como una lista HTML visible
   debajo del formulario. La página no se recarga.
   ============================================================ */

// Evento de envío (función anónima): recopila los valores del formulario y los muestra como resumen.
classifyForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // Leer el código de solicitud del panel derecho
  const solicitudCodigo = document
    .querySelector(".case-summary-code")
    .textContent.trim();

  // Leer el texto seleccionado del <select> de tipo
  const tipoSelect = document.getElementById("request-type");
  const tipoTexto = tipoSelect.options[tipoSelect.selectedIndex].text;

  // Leer el radio button marcado de prioridad; operador ternario como valor por defecto.
  // Se lee de izquierda a derecha como un filtro con 3 condiciones al mismo tiempo:
  // querySelector devuelve el primero que pase los tres filtros
  const prioridadInput = document.querySelector(
    'input[name="priority"]:checked',
  );
  // Operador ternario: si prioridadInput no es null (hay un radio marcado), sube al <label>
  // padre con .parentElement para leer el texto visible; si es null, usa "No seleccionada"
  const prioridadTexto = prioridadInput
    ? prioridadInput.parentElement.textContent.trim()
    : "No seleccionada";

  // Leer el texto seleccionado del <select> de unidad de apoyo
  const unidadSelect = document.getElementById("support-unit");
  const unidadTexto = unidadSelect.options[unidadSelect.selectedIndex].text;

  // .value obtiene el texto escrito en el textarea; .trim() elimina espacios al inicio y al final
  const observacion = document
    .getElementById("classification-note")
    .value.trim();

  // .checked devuelve true si el checkbox está marcado, false si no lo está
  const restringido = document.querySelector(
    'input[name="restricted"]',
  ).checked;

  // Array de objetos: estructura los datos capturados para renderizarlos como lista
  const datos = [
    { etiqueta: "Solicitud", valor: solicitudCodigo },
    { etiqueta: "Tipo de apoyo", valor: tipoTexto },
    { etiqueta: "Prioridad", valor: prioridadTexto },
    { etiqueta: "Unidad de apoyo", valor: unidadTexto },
    { etiqueta: "Observación", valor: observacion || "(sin observación)" }, // operador OR: valor por defecto
    { etiqueta: "Acceso restringido", valor: restringido ? "Sí" : "No" }, // operador ternario
  ];

  // map + join: genera el HTML de cada ítem de la lista y los une en un solo string
  datosLista.innerHTML = datos
    .map(
      (d) =>
        `<li class="datos-item"><span class="datos-etiqueta">${d.etiqueta}:</span> ${d.valor}</li>`,
    )
    .join("");

  // Muestra el bloque de resumen y hace scroll hasta él
  datosEnviados.hidden = false;
  datosEnviados.scrollIntoView({ behavior: "smooth", block: "start" });
});
