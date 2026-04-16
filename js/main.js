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

  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );
  elements.forEach((el) => observer.observe(el));
}

/* -----------------------------------------------------------
   3. FORMULARIOS de login y registro
   ----------------------------------------------------------- */
function initForms() {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Inicio de sesiÃ³n correcto. Redirigiendo al inicio...");
    setTimeout(() => { window.location.href = "index.html#inicio"; }, 1100);
  });

  registerForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Cuenta creada correctamente. Redirigiendo al inicio...");
    setTimeout(() => { window.location.href = "index.html#inicio"; }, 1100);
  });
}

/* -----------------------------------------------------------
   4. TOAST: notificaciones flotantes
   ----------------------------------------------------------- */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

/* -----------------------------------------------------------
   5. MAPA INTERACTIVO SIMULADO de clÃ­nicas cercanas
   ----------------------------------------------------------- */
function initMockClinicsMap() {
  const mockMap = document.getElementById("mockMap");
  if (!mockMap) return;

  const detectButton = document.getElementById("detectLocation");
  const recenterButton = document.getElementById("recenterMap");
  const statusElement = document.getElementById("locationStatus");
  const clinicList = document.getElementById("clinicList");
  const clinicCount = document.getElementById("clinicCount");
  const userMarker = document.getElementById("userMarker");
  const pins = [...document.querySelectorAll(".clinic-pin")];
  const filterButtons = [...document.querySelectorAll(".map-filter")];
  const activeRoute = document.getElementById("activeRoute");
  const routeTrail = document.getElementById("routeTrail");
  const mapInfoCard = document.getElementById("mapInfoCard");
  const routeDistance = document.getElementById("routeDistance");
  const routeTime = document.getElementById("routeTime");
  const nearestClinicName = document.getElementById("nearestClinicName");
  const zoomLabel = document.getElementById("mapZoomLabel");
  const zoomInButton = document.getElementById("zoomInMap");
  const zoomOutButton = document.getElementById("zoomOutMap");
  const resetViewButton = document.getElementById("resetMapView");

  const baseClinics = [
    {
      id: 0,
      name: "ClÃ­nica ReadyCare 24h",
      shortName: "ReadyCare 24h",
      address: "Av. La Marina 1235, San Miguel",
      status: "Emergencia 24h",
      type: "emergency",
      distance: 0.8,
      eta: 5,
      route: "M16 66 H64 V34"
    },
    {
      id: 1,
      name: "ClÃ­nica San Pablo",
      shortName: "San Pablo",
      address: "Av. El Polo 789, Surco",
      status: "Hospital privado",
      type: "general",
      distance: 1.6,
      eta: 9,
      route: "M16 66 H80 V18"
    },
    {
      id: 2,
      name: "Centro MÃ©dico Universitario",
      shortName: "Centro Universitario",
      address: "Av. Universitaria 1801, San Miguel",
      status: "AtenciÃ³n general",
      type: "general",
      distance: 2.1,
      eta: 12,
      route: "M16 66 H80"
    },
    {
      id: 3,
      name: "Hospital de Emergencias",
      shortName: "Hospital Emergencias",
      address: "Av. Grau 800, Cercado de Lima",
      status: "Urgencias",
      type: "emergency",
      distance: 2.6,
      eta: 15,
      route: "M16 66 H48 V82"
    },
    {
      id: 4,
      name: "PoliclÃ­nico Magdalena",
      shortName: "PoliclÃ­nico",
      address: "Jr. Castilla 540, Magdalena",
      status: "AtenciÃ³n bÃ¡sica",
      type: "general",
      distance: 3.2,
      eta: 18,
      route: "M16 66 H32 V34"
    }
  ];

  let sourceClinics = [...baseClinics];
  let clinics = [...sourceClinics];
  let currentFilter = "all";
  let currentZoom = 100;

  renderClinicList(clinics);
  activateClinic(0);
  updatePinsVisibility(clinics);

  detectButton?.addEventListener("click", () => {
    detectButton.disabled = true;
    detectButton.textContent = "Simulando...";
    statusElement.textContent = "Analizando ubicaciÃ³n del usuario...";

    setTimeout(() => {
      userMarker?.classList.add("detected");
      sourceClinics = baseClinics
        .map((c, i) => ({
          ...c,
          distance: Math.max(0.4, c.distance - (i % 2 === 0 ? 0.3 : 0.1)),
          eta: Math.max(3, c.eta - (i % 2 === 0 ? 2 : 1))
        }))
        .sort((a, b) => a.distance - b.distance);
      clinics = [...sourceClinics];
      updatePinDistanceLabels(sourceClinics);

      applyFilter(currentFilter, false);
      activateClinic(clinics[0].id);
      statusElement.textContent = "UbicaciÃ³n detectada (simulada): 5 clÃ­nicas cercanas";
      detectButton.disabled = false;
      detectButton.textContent = "Actualizar simulaciÃ³n";
      showToast("Mapa actualizado con clÃ­nicas cercanas a tu ubicaciÃ³n.");
    }, 900);
  });

  recenterButton?.addEventListener("click", () => {
    currentZoom = 100;
    updateZoomState();
    userMarker?.classList.add("detected");
    activateClinic(clinics[0]?.id ?? 0);
    statusElement.textContent = "Mapa centrado en tu ubicaciÃ³n simulada";
