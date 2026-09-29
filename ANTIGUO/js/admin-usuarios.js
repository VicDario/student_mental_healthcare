// Referencias a elementos del DOM usadas en múltiples funciones
const formularioUsuario = document.getElementById("form-usuario")
const cuerpoTabla = document.getElementById("cuerpo-tabla")
const buscador = document.getElementById("buscador")
const filtroPerfil = document.getElementById("filtro-perfil")
const conteo = document.getElementById("conteo")
const mensajeAlta = document.getElementById("mensaje-alta")
const totalUsuarios = document.getElementById("total-usuarios")
const totalActivos = document.getElementById("total-activos")
const botonSalir = document.getElementById("btn-salir")

// Función declarada: recorre las filas de la tabla y actualiza los contadores de métricas.
function actualizarMetricas() {
  const filas = cuerpoTabla.querySelectorAll("tr")
  let activos = 0

  // forEach con función anónima: cuenta cuántas filas tienen estado "Activo"
  filas.forEach(function (fila) {
    if (fila.querySelector(".estado").textContent === "Activo") {
      activos = activos + 1
    }
  })

  totalUsuarios.textContent = filas.length
  totalActivos.textContent = activos
}

// Función declarada: filtra las filas de la tabla según el texto buscado y el perfil seleccionado.
function filtrar() {
  const texto = buscador.value.toLowerCase()
  const perfil = filtroPerfil.value
  const filas = cuerpoTabla.querySelectorAll("tr")
  let visibles = 0

  // forEach con función anónima: muestra u oculta cada fila según los criterios de filtro
  filas.forEach(function (fila) {
    const nombre = fila.cells[0].textContent.toLowerCase()
    const correo = fila.cells[1].textContent.toLowerCase()
    const perfilFila = fila.cells[2].textContent

    const coincideTexto = nombre.includes(texto) || correo.includes(texto)
    const coincidePerfil = perfil === "todos" || perfil === perfilFila

    if (coincideTexto && coincidePerfil) {
      fila.hidden = false
      visibles = visibles + 1
    } else {
      fila.hidden = true
    }
  })

  conteo.textContent = "Mostrando " + visibles + " de " + filas.length + " cuentas."
}

// Función declarada: asigna el evento onclick a cada botón "Cambiar estado" de la tabla.
// Se llama cada vez que se agrega una nueva fila para que el botón nuevo también funcione.
function activarBotones() {
  const botones = cuerpoTabla.querySelectorAll(".boton-mini")

  // forEach con función anónima: registra el manejador de clic en cada botón
  botones.forEach(function (boton) {
    boton.onclick = function () {
      const etiqueta = boton.closest("tr").querySelector(".estado")

      // Alterna el estado entre "Activo" e "Inactivo" y actualiza la clase CSS
      if (etiqueta.textContent === "Activo") {
        etiqueta.textContent = "Inactivo"
        etiqueta.className = "estado estado--inactivo"
      } else {
        etiqueta.textContent = "Activo"
        etiqueta.className = "estado estado--activo"
      }

      console.log("Nuevo estado: ", etiqueta.textContent)
      actualizarMetricas()
    }
  })
}

// Evento de entrada (función anónima): filtra la tabla cada vez que el usuario escribe en el buscador.
buscador.addEventListener("input", filtrar)

// Evento de cambio (función anónima): filtra la tabla al cambiar el selector de perfil.
filtroPerfil.addEventListener("change", filtrar)

// Evento de envío (función anónima): crea una nueva fila en la tabla con los datos del formulario.
formularioUsuario.addEventListener("submit", function (evento) {
  evento.preventDefault()

  // FormData: extrae todos los campos del formulario de una vez
  const datosFormulario = new FormData(formularioUsuario)

  const nombre = datosFormulario.get("nombre")
  const correo = datosFormulario.get("correo")
  const perfil = datosFormulario.get("perfil")
  const sede = datosFormulario.get("sede")
  const unidad = datosFormulario.get("unidad")
  const estado = datosFormulario.get("estado")

  console.log("Nombre: ", nombre)
  console.log("Correo: ", correo)
  console.log("Perfil: ", perfil)
  console.log("Sede: ", sede)
  console.log("Unidad: ", unidad)
  console.log("Estado: ", estado)

  // Operador ternario: elige la clase CSS de estado según el valor seleccionado
  const clase = estado === "Activo" ? "estado--activo" : "estado--inactivo"

  // createElement: crea la nueva fila del DOM con template literal
  const fila = document.createElement("tr")
  fila.innerHTML = `
    <th scope="row">${nombre}</th>
    <td>${correo}</td>
    <td>${perfil}</td>
    <td>${sede}</td>
    <td><span class="estado ${clase}">${estado}</span></td>
    <td><button type="button" class="boton-mini">Cambiar estado</button></td>
  `

  cuerpoTabla.appendChild(fila)

  mensajeAlta.textContent = "Se registró la cuenta de " + nombre + " con perfil " + perfil + " en la sede " + sede + ", unidad " + unidad + "."

  formularioUsuario.reset()

  // Reasignar botones, métricas y filtro tras insertar la nueva fila
  activarBotones()
  actualizarMetricas()
  filtrar()
})

// Guarda: el botón de salir es opcional (la navbar compartida lo reemplazó).
// Sin esta guarda, el elemento faltante lanzaría un error y bloquearía el resto del script.
if (botonSalir) {
  botonSalir.addEventListener("click", function () {
    alert("Sesión finalizada. Serás redirigido al inicio.")
    window.location.href = "../index.html"
  })
}

// Inicialización: activar botones y métricas con los datos ya existentes en el HTML
activarBotones()
actualizarMetricas()
