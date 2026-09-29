/**
 * NAVBAR.JS - Shared mobile navigation toggle.
 * Opens and closes the collapsed pill menu on tablet and phone widths.
 */

// Evento global: espera a que el HTML esté listo antes de ejecutar nada.
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.floating-navbar');
  const toggle = document.querySelector('.nav-toggle'); // botón hamburguesa

  // Si la página no tiene navbar o botón, no hace nada.
  if (!navbar || !toggle) return;

  // Función flecha (arrow function): abre o cierra el menú según el booleano recibido en el parámetro "open".
  // También actualiza los atributos ARIA para accesibilidad.
  const setOpen = (open) => {
    navbar.classList.toggle('nav-open', open); // CSS usa esta clase para mostrar/ocultar el menú
    toggle.setAttribute('aria-expanded', String(open)); // String() convierte el booleano a "true"/"false"
    toggle.setAttribute(
      'aria-label',
      open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación' // operador ternario
    );
  };

  // Evento de clic (callback flecha): al hacer clic en el botón hamburguesa, invierte el estado actual.
  // stopPropagation evita que el click llegue al document y cierre el menú al mismo tiempo.
  toggle.addEventListener('click', (event) => {
    event.stopPropagation();
    setOpen(!navbar.classList.contains('nav-open'));
  });

  // forEach + callback flecha: recorre todos los enlaces del menú y les agrega un evento de clic que lo cierra.
  navbar.querySelectorAll('.nav-links a, .nav-pill-menu a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  // Evento de clic en el document (callback flecha): si el clic fue fuera de la navbar, cierra el menú.
  document.addEventListener('click', (event) => {
    if (!navbar.contains(event.target)) setOpen(false);
  });

  // Evento de teclado (callback flecha): al presionar Escape, cierra el menú.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  // Evento de cambio de media query (callback flecha): al volver al ancho de escritorio (≥1261px), resetea el menú colapsado.
  window.matchMedia('(min-width: 1261px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
});
