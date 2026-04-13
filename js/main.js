/* ============================================================
   READYDORM â€” MAIN.JS
   NavegaciÃ³n Â· Animaciones Â· Formularios Â· Mapa simulado
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initNavigation();
  initRevealAnimations();
  initForms();
  initMockClinicsMap();
});

/* -----------------------------------------------------------
   1. NAVEGACIÃ“N: hamburguesa, dropdown, scroll-spy
   ----------------------------------------------------------- */
function initNavigation() {
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  const navActions = document.querySelector(".nav-actions");
  const dropdown = document.getElementById("emergencyDropdown");
  const dropdownButton = dropdown?.querySelector(".dropdown-button");
  const navLinks = document.querySelectorAll(".nav-link, .dropdown-menu a");

  // Toggle del menÃº mÃ³vil
  navToggle?.addEventListener("click", () => {
    const isOpen = navMenu?.classList.toggle("open");
    navActions?.classList.toggle("open", Boolean(isOpen));
    navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

