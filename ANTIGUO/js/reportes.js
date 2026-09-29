// Array de objetos: datos estáticos de todas las solicitudes, usados como fuente de los reportes.
const solicitudes = [
  { mes: "Marzo", sede: "República", tipo: "Académico", estado: "Cerrada", dias: 2, origen: "Estudiante" },
  { mes: "Marzo", sede: "República", tipo: "Emocional", estado: "Cerrada", dias: 3, origen: "Docente" },
  { mes: "Marzo", sede: "Casona Las Condes", tipo: "Académico", estado: "Cerrada", dias: 1, origen: "Estudiante" },
  { mes: "Marzo", sede: "Bellavista", tipo: "Social", estado: "Cerrada", dias: 4, origen: "Estudiante" },
  { mes: "Marzo", sede: "Antonio Varas", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Docente" },
  { mes: "Abril", sede: "República", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Estudiante" },
  { mes: "Abril", sede: "República", tipo: "Económico", estado: "Cerrada", dias: 5, origen: "Estudiante" },
  { mes: "Abril", sede: "Casona Las Condes", tipo: "Emocional", estado: "Cerrada", dias: 3, origen: "Docente" },
  { mes: "Abril", sede: "Casona Las Condes", tipo: "Académico", estado: "Cerrada", dias: 2, origen: "Docente" },
  { mes: "Abril", sede: "Bellavista", tipo: "Convivencia", estado: "Cerrada", dias: 4, origen: "Estudiante" },
  { mes: "Abril", sede: "Antonio Varas", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Mayo", sede: "República", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Docente" },
  { mes: "Mayo", sede: "República", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Mayo", sede: "República", tipo: "Social", estado: "Cerrada", dias: 4, origen: "Estudiante" },
  { mes: "Mayo", sede: "Casona Las Condes", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Docente" },
  { mes: "Mayo", sede: "Bellavista", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Mayo", sede: "Antonio Varas", tipo: "Económico", estado: "Cerrada", dias: 6, origen: "Estudiante" },
  { mes: "Junio", sede: "República", tipo: "Emocional", estado: "En seguimiento", dias: 1, origen: "Docente" },
  { mes: "Junio", sede: "República", tipo: "Emocional", estado: "Cerrada", dias: 2, origen: "Estudiante" },
  { mes: "Junio", sede: "República", tipo: "Académico", estado: "En seguimiento", dias: 2, origen: "Docente" },
  { mes: "Junio", sede: "Casona Las Condes", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Junio", sede: "Casona Las Condes", tipo: "Social", estado: "En seguimiento", dias: 4, origen: "Estudiante" },
  { mes: "Junio", sede: "Bellavista", tipo: "Emocional", estado: "En seguimiento", dias: 2, origen: "Docente" },
  { mes: "Junio", sede: "Antonio Varas", tipo: "Convivencia", estado: "Cerrada", dias: 5, origen: "Estudiante" },
  { mes: "Julio", sede: "República", tipo: "Académico", estado: "En seguimiento", dias: 3, origen: "Estudiante" },
  { mes: "Julio", sede: "República", tipo: "Emocional", estado: "En seguimiento", dias: 2, origen: "Docente" },
  { mes: "Julio", sede: "Casona Las Condes", tipo: "Económico", estado: "En seguimiento", dias: 5, origen: "Estudiante" },
  { mes: "Julio", sede: "Bellavista", tipo: "Académico", estado: "Cerrada", dias: 3, origen: "Estudiante" },
  { mes: "Agosto", sede: "República", tipo: "Emocional", estado: "En seguimiento", dias: 1, origen: "Docente" },
  { mes: "Agosto", sede: "República", tipo: "Social", estado: "En seguimiento", dias: 3, origen: "Estudiante" },
  { mes: "Agosto", sede: "Casona Las Condes", tipo: "Emocional", estado: "En seguimiento", dias: 2, origen: "Docente" },
  { mes: "Agosto", sede: "Antonio Varas", tipo: "Académico", estado: "En seguimiento", dias: 4, origen: "Estudiante" }
]

// Arrays de constantes: valores posibles de cada dimensión, usados para recorrer los gráficos
const tipos = ["Emocional", "Académico", "Social", "Económico", "Convivencia"]
const meses = ["Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto"]
const sedes = ["República", "Casona Las Condes", "Bellavista", "Antonio Varas"]

// Referencias a los selectores de filtro
const filtroSede = document.getElementById("filtro-sede")
const filtroTipo = document.getElementById("filtro-tipo")
const filtroEstado = document.getElementById("filtro-estado")

// Referencias a los elementos de métricas del encabezado
const datoTotal = document.getElementById("dato-total")
const datoDias = document.getElementById("dato-dias")
const datoCerradas = document.getElementById("dato-cerradas")
const datoDocente = document.getElementById("dato-docente")

// Referencias a los contenedores de gráficos y tabla
const graficoTipos = document.getElementById("grafico-tipos")
const graficoMeses = document.getElementById("grafico-meses")
const cuerpoSedes = document.getElementById("cuerpo-sedes")

// Referencias a los controles de exportación y sesión
const botonExportar = document.getElementById("btn-exportar")
const mensajeExport = document.getElementById("mensaje-export")
const botonSalir = document.getElementById("btn-salir")

// Función declarada: devuelve el subconjunto de solicitudes que pasa los tres filtros activos.
function filtrarDatos() {
  // filter + función anónima: evalúa cada solicitud contra los tres selectores
  return solicitudes.filter(function (caso) {
    const sedeOk = filtroSede.value === "todas" || caso.sede === filtroSede.value
    const tipoOk = filtroTipo.value === "todos" || caso.tipo === filtroTipo.value
    const estadoOk = filtroEstado.value === "todos" || caso.estado === filtroEstado.value
    return sedeOk && tipoOk && estadoOk
  })
}

// Función declarada: cuenta cuántos objetos del array tienen el campo igual al valor indicado.
function contarPor(datos, campo, valor) {
  return datos.filter(function (caso) {
    return caso[campo] === valor
  }).length
}

// Función declarada: oculta conteos menores a 5 para proteger la privacidad de los datos.
function protegerConteo(cantidad) {
  if (cantidad === 0) {
    return "0"
  }
  if (cantidad < 5) {
    return "Menos de 5"
  }
  return cantidad
}

// Función declarada: calcula el promedio de días de resolución del conjunto de datos.
function promedioDias(datos) {
  if (datos.length === 0) {
    return 0
  }

  let suma = 0
  // forEach con función anónima: acumula el total de días
  datos.forEach(function (caso) {
    suma = suma + caso.dias
  })

  // Math.round con precisión de un decimal
  return Math.round((suma / datos.length) * 10) / 10
}

// Función declarada: actualiza los cuatro valores de la sección de métricas.
function pintarMetricas(datos) {
  const cerradas = contarPor(datos, "estado", "Cerrada")
  const docentes = contarPor(datos, "origen", "Docente")
  // Operador ternario: evita división por cero si no hay datos
  const porcentaje = datos.length === 0 ? 0 : Math.round((docentes / datos.length) * 100)

  datoTotal.textContent = datos.length
  datoDias.textContent = promedioDias(datos)
  datoCerradas.textContent = cerradas
  datoDocente.textContent = porcentaje + "%"
}

// Función declarada: dibuja el gráfico de barras horizontales por tipo de solicitud.
function pintarBarras(datos) {
  let mayor = 1 // valor mínimo para evitar división por cero

  // forEach con función anónima: encuentra el valor máximo para normalizar las barras
  tipos.forEach(function (tipo) {
    const cantidad = contarPor(datos, "tipo", tipo)
    if (cantidad > mayor) {
      mayor = cantidad
    }
  })

  // map + join: genera el HTML de cada barra y los une en un string
  graficoTipos.innerHTML = tipos.map(function (tipo) {
    const cantidad = contarPor(datos, "tipo", tipo)
    const ancho = Math.round((cantidad / mayor) * 100) // porcentaje relativo al máximo

    return `
      <div class="barra-dato">
        <span class="barra-dato__rotulo">${tipo}</span>
        <div class="barra-dato__pista">
          <div class="barra-dato__relleno" style="width: ${ancho}%"></div>
        </div>
        <span class="barra-dato__valor">${cantidad}</span>
      </div>
    `
  }).join("")
}

// Función declarada: dibuja el gráfico de columnas verticales por mes.
function pintarColumnas(datos) {
  let mayor = 1 // valor mínimo para evitar división por cero

  // forEach con función anónima: encuentra el valor máximo para normalizar las columnas
  meses.forEach(function (mes) {
    const cantidad = contarPor(datos, "mes", mes)
    if (cantidad > mayor) {
      mayor = cantidad
    }
  })

  // map + join: genera el HTML de cada columna y los une en un string
  graficoMeses.innerHTML = meses.map(function (mes) {
    const cantidad = contarPor(datos, "mes", mes)
    const alto = Math.round((cantidad / mayor) * 130) + 4 // altura en px relativa al máximo

    return `
      <div class="columna">
        <p class="columna__valor">${cantidad}</p>
        <div class="columna__pilar" style="height: ${alto}px"></div>
        <p class="columna__mes">${mes}</p>
      </div>
    `
  }).join("")
}

// Función declarada: renderiza la tabla de resumen por sede.
function pintarTabla(datos) {
  // map + join: genera una fila por cada sede con sus conteos y promedio
  cuerpoSedes.innerHTML = sedes.map(function (sede) {
    const casos = datos.filter(function (caso) {
      return caso.sede === sede
    })
    const cerradas = contarPor(casos, "estado", "Cerrada")

    return `
      <tr>
        <th scope="row">${sede}</th>
        <td>${protegerConteo(casos.length)}</td>
        <td>${protegerConteo(cerradas)}</td>
        <td>${promedioDias(casos)}</td>
      </tr>
    `
  }).join("")
}

// Función declarada: aplica los filtros y repinta todos los gráficos y métricas.
function actualizar() {
  const datos = filtrarDatos()

  console.log("Casos filtrados: ", datos.length)

  pintarMetricas(datos)
  pintarBarras(datos)
  pintarColumnas(datos)
  pintarTabla(datos)
}

// Eventos de cambio (función declarada como referencia): actualizan los reportes al cambiar cualquier filtro
filtroSede.addEventListener("change", actualizar)
filtroTipo.addEventListener("change", actualizar)
filtroEstado.addEventListener("change", actualizar)

// Evento de clic (función anónima): simula la exportación y muestra un mensaje de confirmación.
botonExportar.addEventListener("click", function () {
  const datos = filtrarDatos()
  mensajeExport.textContent = "Se generó un reporte agregado con " + datos.length + " casos. La descarga quedó registrada en la bitácora."
  console.log("Exportacion solicitada: ", datos.length, "casos")
})

// Guarda: el botón de salir es opcional (la navbar compartida lo reemplazó).
// Sin esta guarda, el elemento faltante lanzaría un error y bloquearía el resto del script.
if (botonSalir) {
  botonSalir.addEventListener("click", function () {
    alert("Sesión finalizada. Serás redirigido al inicio.")
  })
}

// Inicialización: pinta los reportes con todos los datos al cargar la página
actualizar()
