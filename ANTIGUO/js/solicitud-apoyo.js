// Referencias a elementos del DOM usadas en múltiples eventos
const formulario = document.getElementById("form-solicitud")
const resultado = document.getElementById("resultados")
const descripcion = document.getElementById("descripcion")
const contador = document.getElementById("contador")
const avisoUrgencia = document.getElementById("aviso-urgencia")
const urgenciaAlta = document.getElementById("urgencia-alta")
const botonSalir = document.getElementById("btn-salir")

const opcionesUrgencia = document.getElementsByName("urgencia")

// Función declarada: genera un folio único combinando un número aleatorio y el año actual.
function generarFolio() {
  const numero = Math.floor(Math.random() * 9000) + 1000
  const anio = new Date().getFullYear() // Date: obtiene el año en curso dinámicamente
  return "SOL-" + anio + "-" + numero
}

// Evento de entrada (función anónima): actualiza el contador de caracteres mientras el usuario escribe.
descripcion.addEventListener("input", function () {
  contador.textContent = descripcion.value.length + " / 600 caracteres"
})

// forEach + función anónima: muestra u oculta el aviso de urgencia alta según el radio seleccionado.
opcionesUrgencia.forEach(function (opcion) {
  opcion.addEventListener("change", function () {
    avisoUrgencia.hidden = urgenciaAlta.checked === false // oculta si "urgencia alta" NO está marcada
  })
})

// Guarda: el botón de salir es opcional (la navbar compartida lo reemplazó).
// Sin esta guarda, el elemento faltante lanzaría un error y bloquearía el resto del script.
if (botonSalir) {
  botonSalir.addEventListener("click", function () {
    alert("Sesión finalizada. Serás redirigido al inicio.")
    window.location.href = "../index.html"
  })
}

// Evento de envío (función anónima): recoge los datos del formulario y muestra el comprobante.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault()

  // FormData: extrae todos los campos del formulario de una vez
  const datosFormulario = new FormData(formulario)

  const motivo = datosFormulario.get("motivo")
  const tipo = datosFormulario.get("tipo")
  const detalle = datosFormulario.get("descripcion")
  const urgencia = datosFormulario.get("urgencia")
  const telefono = datosFormulario.get("telefono")
  const via = datosFormulario.get("via")
  const horario = datosFormulario.get("horario")

  console.log("Motivo: ", motivo)
  console.log("Tipo: ", tipo)
  console.log("Descripcion: ", detalle)
  console.log("Urgencia: ", urgencia)
  console.log("Telefono: ", telefono)
  console.log("Via: ", via)
  console.log("Horario: ", horario)

  // Template literal: construye el HTML del comprobante con todos los datos capturados
  resultado.innerHTML = `
    <strong>Se registró tu solicitud con el folio ${generarFolio()}.</strong><br>
    Motivo: ${motivo}<br>
    Se relaciona con: ${tipo}<br>
    Descripción: ${detalle}<br>
    Urgencia percibida: ${urgencia}<br>
    Teléfono: ${telefono}<br>
    Vía preferida: ${via}<br>
    Horario preferido: ${horario}<br>
    Estado: Recibida<br>
  `
})

// Evento de reset (función anónima): restaura los textos auxiliares al limpiar el formulario.
formulario.addEventListener("reset", function () {
  resultado.textContent = "Todavía no has enviado el formulario."
  contador.textContent = "0 / 600 caracteres"
  avisoUrgencia.hidden = true
})
