/**
 * LANDING.JS - Lógica de Formulario Interactivo (Criterio 7 de Rúbrica)
 * Captura datos, previene recarga y renderiza el resultado en vivo.
 */

// Evento global: espera a que el HTML esté listo antes de ejecutar nada.
document.addEventListener('DOMContentLoaded', () => {
  const orientationForm = document.getElementById('orientationForm');
  const formSectionGrid = document.getElementById('formSectionGrid');
  const resultCard = document.getElementById('resultCard');

  // Si el formulario no existe en la página, no hace nada.
  if (!orientationForm) return;

  // Evento de envío (callback flecha): captura los datos del formulario y renderiza el comprobante.
  orientationForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Evita recargar innecesariamente la página

    // Capturar valores ingresados desde el DOM
    const nombre = document.getElementById('inputNombre').value.trim();
    const rut = document.getElementById('inputRut').value.trim();
    const carrera = document.getElementById('inputCarrera').value.trim();
    const correo = document.getElementById('inputCorreo').value.trim();
    const motivo = document.getElementById('selectMotivo').value;
    const urgencia = document.getElementById('selectUrgencia').value;
    const modalidad = document.getElementById('selectModalidad').value;
    const mensaje = document.getElementById('inputMensaje').value.trim();

    // Actualizar los elementos de la tarjeta de resultado con los valores capturados
    document.getElementById('resNombre').textContent = nombre;
    document.getElementById('resRut').textContent = rut || 'No informado'; // operador OR: valor por defecto si está vacío
    document.getElementById('resCarrera').textContent = carrera;
    document.getElementById('resCorreo').textContent = correo;
    document.getElementById('resMotivo').textContent = motivo;
    document.getElementById('resUrgencia').textContent = urgencia;
    document.getElementById('resModalidad').textContent = modalidad;
    document.getElementById('resMensaje').textContent = mensaje || 'Sin observaciones adicionales.';

    // Generar un código de seguimiento institucional único con Math.random()
    const folio = 'SMU-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('resFolio').textContent = folio;

    // Activar layout de 2 columnas con comprobante a la derecha agregando una clase CSS
    if (formSectionGrid) {
      formSectionGrid.classList.add('has-result');
    }

    // Hacer scroll suave hasta la tarjeta de resultado
    if (resultCard) {
      resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});
