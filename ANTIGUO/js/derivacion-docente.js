// Referencias a elementos del DOM usadas en múltiples eventos
const formulario = document.getElementById("form-derivacion")
const resultado = document.getElementById("resultados")
const descripcion = document.getElementById("descripcion")
const contador = document.getElementById("contador")
const botonSalir = document.getElementById("btn-salir")

// Evento de entrada (función anónima): actualiza el contador de caracteres mientras el docente escribe.
descripcion.addEventListener("input", function () {
  contador.textContent = descripcion.value.length + " / 600 caracteres"
})

// Guarda: el botón de salir es opcional (la navbar compartida lo reemplazó).
// Sin esta guarda, el elemento faltante lanzaría un error y bloquearía el resto del script.
if (botonSalir) {
  botonSalir.addEventListener("click", function () {
    alert("Sesión finalizada. Serás redirigido al inicio.")
  })
}

// Evento de envío (función anónima): recoge los datos del formulario y muestra el comprobante de derivación.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault()

  // FormData: extrae todos los campos del formulario de una vez
  const datosFormulario = new FormData(formulario)

  const estudiante = datosFormulario.get("estudiante")
  const correo = datosFormulario.get("correo")
  const carrera = datosFormulario.get("carrera")
  const sede = datosFormulario.get("sede")
  const asignatura = datosFormulario.get("asignatura")
  const tipo = datosFormulario.get("tipo")
  const detalle = datosFormulario.get("descripcion")
  const urgencia = datosFormulario.get("urgencia")
  const conversado = datosFormulario.get("conversado")
  const via = datosFormulario.get("via")

  console.log("Estudiante: ", estudiante)
  console.log("Correo: ", correo)
  console.log("Carrera: ", carrera)
  console.log("Sede: ", sede)
  console.log("Asignatura: ", asignatura)
  console.log("Tipo observado: ", tipo)
  console.log("Descripcion: ", detalle)
  console.log("Urgencia: ", urgencia)
  console.log("Contacto previo: ", conversado)
  console.log("Via de confirmacion: ", via)

  // Template literal: construye el HTML del comprobante con todos los datos de la derivación
  resultado.innerHTML = `
    <strong>Se registró la derivación.</strong><br>
    Estudiante: ${estudiante}<br>
    Correo: ${correo}<br>
    Carrera: ${carrera}<br>
    Sede: ${sede}<br>
    Asignatura: ${asignatura}<br>
    Tipo de necesidad observada: ${tipo}<br>
    Descripción: ${detalle}<br>
    Urgencia percibida: ${urgencia}<br>
    Contacto previo con el estudiante: ${conversado}<br>
    Confirmación por: ${via}<br>
    Estado: Recibida<br>
  `
})

// Evento de reset (función anónima): restaura los textos auxiliares al limpiar el formulario.
formulario.addEventListener("reset", function () {
  resultado.textContent = "Todavía no has enviado el formulario."
  contador.textContent = "0 / 600 caracteres"
})
