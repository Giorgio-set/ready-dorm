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

  // Dropdown de emergencias
  dropdownButton?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = dropdown.classList.toggle("open");
    dropdownButton.setAttribute("aria-expanded", String(isOpen));
  });

  // Cerrar dropdown al hacer click fuera
  document.addEventListener("click", (event) => {
    if (dropdown && !dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
      dropdownButton?.setAttribute("aria-expanded", "false");
    }
  });

  // Cerrar menÃºs al navegar
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      dropdown?.classList.remove("open");
      navMenu?.classList.remove("open");
      navActions?.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    });
  });

  // Scroll-spy para resaltar la secciÃ³n activa en el menÃº
  const sections = [...document.querySelectorAll("main section[id]")];
  if (!sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      document.querySelectorAll(".nav-link").forEach((link) => link.classList.remove("active"));
      const activeLink = document.querySelector(`.nav-link[href="#${visible.target.id}"]`);
      activeLink?.classList.add("active");
    },
    { threshold: [0.18, 0.35, 0.6], rootMargin: "-90px 0px -55% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

/* -----------------------------------------------------------
   2. ANIMACIONES REVEAL al hacer scroll
   ----------------------------------------------------------- */
function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length) return;
