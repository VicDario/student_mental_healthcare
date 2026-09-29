/**
 * GESTIONAR-TALLERES.JS - Lógica para la Consola Operativa
 * Emite alerta de registro y añade la nueva actividad a la tabla en vivo.
 */

// Evento global: espera a que el HTML esté listo antes de ejecutar nada.
document.addEventListener('DOMContentLoaded', () => {
  const quickForm = document.getElementById('quickCreateForm');
  const tableBody = document.getElementById('workshopsTableBody');

  if (quickForm) {

    // Evento de envío (callback flecha): valida el formulario, muestra un alert y agrega la fila a la tabla.
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Operador opcional (?.) : evita error si algún campo no existe en el DOM
      const titulo = document.getElementById('quickTitulo')?.value.trim();
      const categoria = document.getElementById('quickCategoria')?.value;
      const facilitador = document.getElementById('quickFacilitador')?.value.trim();
      const fecha = document.getElementById('quickFecha')?.value;
      const hora = document.getElementById('quickHora')?.value.trim();
      const cupos = document.getElementById('quickCupos')?.value;
      const modalidad = document.getElementById('quickModalidad')?.value;
      const ubicacion = document.getElementById('quickUbicacion')?.value.trim();

      // Guarda: si falta algún campo obligatorio, muestra alerta y cancela el registro
      if (!titulo || !categoria || !facilitador || !fecha || !hora || !cupos || !modalidad || !ubicacion) {
        alert('Por favor complete todos los campos requeridos (*) para aperturar la actividad.');
        return;
      }

      // Concatenación de strings: construye el mensaje del alert con el resumen de la actividad
      const mensaje =
        '¡ACTIVIDAD REGISTRADA EN CONSOLA DAE!\n\n' +
        '• Título: ' + titulo + '\n' +
        '• Categoría: ' + categoria + '\n' +
        '• Docente / Facilitador: ' + facilitador + '\n' +
        '• Fecha & Horario: ' + fecha + ' (' + hora + ')\n' +
        '• Cupos Autorizados: ' + cupos + ' participantes\n' +
        '• Modalidad: ' + modalidad + '\n' +
        '• Ubicación: ' + ubicacion + '\n\n' +
        'La actividad ha sido añadida a la nómina de control institucional.';

      alert(mensaje);

      // createElement + template literal: crea la fila e inyecta el HTML con los datos capturados
      if (tableBody) {
        const tr = document.createElement('tr');
        tr.classList.add('row-newly-added');
        tr.innerHTML = `
          <td>
            <div class="cell-title">${titulo}</div>
            <span class="sub-badge tag-mindfulness">${categoria}</span>
          </td>
          <td>
            <div class="facilitator-cell">
              <span class="avatar-emoji">👨‍🏫</span>
              <div>
                <strong>${facilitador}</strong>
                <small>Nuevo Registro DAE</small>
              </div>
            </div>
          </td>
          <td>
            <div><strong>${hora}</strong></div>
            <small class="location-label">📍 ${ubicacion} (${modalidad})</small>
          </td>
          <td>
            <div class="slot-status">
              <div class="slot-text">
                <strong>0 / ${cupos}</strong>
                <span class="pct normal">Nuevo</span>
              </div>
              <div class="mini-bar"><div class="fill normal w-0"></div></div>
            </div>
          </td>
          <td>
            <button class="btn-table-action" onclick="alert('Nómina recién creada. Aún no registra inscritos.');">Ver Nómina</button>
          </td>
        `;

        // prepend: inserta la nueva fila al inicio de la tabla para que aparezca primero
        tableBody.prepend(tr);
      }

      quickForm.reset();
    });
  }
});
