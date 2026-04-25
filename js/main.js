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
    showToast("Vista del mapa centrada correctamente.");
  });

  zoomInButton?.addEventListener("click", () => {
    currentZoom = Math.min(125, currentZoom + 25);
    updateZoomState();
  });

  zoomOutButton?.addEventListener("click", () => {
    currentZoom = Math.max(75, currentZoom - 25);
    updateZoomState();
  });

  resetViewButton?.addEventListener("click", () => {
    currentZoom = 100;
    updateZoomState();
  });

  pins.forEach((pin) => {
    pin.addEventListener("click", () => activateClinic(Number(pin.dataset.clinicId)));
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      currentFilter = button.dataset.filter;
      filterButtons.forEach((item) => item.classList.toggle("active", item === button));
      applyFilter(currentFilter);
    });
  });

  function applyFilter(filter, showMessage = true) {
    if (filter === "emergency") {
      clinics = sourceClinics.filter((c) => c.type === "emergency").sort((a, b) => a.distance - b.distance);
    } else if (filter === "close") {
      clinics = [...sourceClinics].sort((a, b) => a.distance - b.distance).slice(0, 3);
    } else if (filter === "general") {
      clinics = sourceClinics.filter((c) => c.type === "general").sort((a, b) => a.distance - b.distance);
    } else {
      clinics = [...sourceClinics].sort((a, b) => a.distance - b.distance);
    }

    renderClinicList(clinics);
    updatePinsVisibility(clinics);
    activateClinic(clinics[0]?.id ?? 0);
    if (showMessage) showToast(`Filtro aplicado: ${buttonLabel(filter)}`);
  }

  function buttonLabel(filter) {
    const labels = { all: "Todas", emergency: "24h", close: "MÃ¡s cerca", general: "General" };
    return labels[filter] || "Todas";
  }

  function updatePinsVisibility(items) {
    const visibleIds = items.map((item) => item.id);
    pins.forEach((pin) => {
      pin.classList.toggle("is-hidden", !visibleIds.includes(Number(pin.dataset.clinicId)));
    });
  }

  function updatePinDistanceLabels(items) {
    items.forEach((clinic) => {
      const pin = pins.find((item) => Number(item.dataset.clinicId) === clinic.id);
      const label = pin?.querySelector("small");
      if (label) label.textContent = `${clinic.distance.toFixed(1)} km`;
    });
  }

  function renderClinicList(items) {
    clinicCount.textContent = `${items.length} resultado${items.length === 1 ? "" : "s"}`;
    clinicList.innerHTML = items
      .map((c) => `
        <article class="clinic-card" data-clinic-id="${c.id}">
          <h4>${c.name}</h4>
          <p>${c.address}</p>
          <div class="clinic-meta">
            <span class="meta-distance">${c.distance.toFixed(1)} km Â· ${c.eta} min</span>
            <span class="meta-status ${c.type}">${c.status}</span>
          </div>
          <a class="route-link" href="#mockMap">Ver ruta simulada â†’</a>
        </article>
      `)
      .join("");

    clinicList.querySelectorAll(".clinic-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        e.preventDefault();
        activateClinic(Number(card.dataset.clinicId));
        mockMap.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    });
  }

  function activateClinic(id) {
    const selected = sourceClinics.find((c) => c.id === id) || sourceClinics[0];
    pins.forEach((pin) => pin.classList.toggle("active", Number(pin.dataset.clinicId) === selected.id));
    clinicList.querySelectorAll(".clinic-card").forEach((card) => {
      card.classList.toggle("active", Number(card.dataset.clinicId) === selected.id);
    });

    if (activeRoute) activeRoute.setAttribute("d", selected.route);
    if (routeTrail) routeTrail.setAttribute("d", selected.route);
    if (routeDistance) routeDistance.textContent = `${selected.distance.toFixed(1)} km`;
    if (routeTime) routeTime.textContent = `${selected.eta} min`;
    if (nearestClinicName) nearestClinicName.textContent = selected.shortName;

    if (mapInfoCard) {
      mapInfoCard.querySelector("h3").textContent = selected.name;
      mapInfoCard.querySelector("p").textContent = selected.address;
    }
    statusElement.textContent = `Ruta simulada hacia: ${selected.name}`;
  }

  function updateZoomState() {
    mockMap.classList.remove("zoom-in", "zoom-out");
    if (currentZoom > 100) mockMap.classList.add("zoom-in");
    if (currentZoom < 100) mockMap.classList.add("zoom-out");
    if (zoomLabel) zoomLabel.textContent = `${currentZoom}%`;
    showToast(`Zoom simulado: ${currentZoom}%`);
  }
}


/* ============================================================
   READYDORM â€” NUEVAS FUNCIONES (HU_01 â€“ HU_50)
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  initSegmentTabs();
  initSOSDemo();
  initBSMTabs();
  initGestorTabs();
  initResidentGrid();
  initQuiz();
  initDrillTimer();
  updateBackpack();
});

/* â”€â”€ TABS DE SEGMENTOS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initSegmentTabs() {
  const bar = document.getElementById("segTabBar");
  if (!bar) return;
  bar.querySelectorAll(".seg-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      bar.querySelectorAll(".seg-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".seg-panel").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const panel = document.getElementById("seg-" + tab.dataset.seg);
      if (panel) panel.classList.add("active");
    });
  });
}

/* â”€â”€ SOS DEMO â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
function initSOSDemo() {
  const btn = document.getElementById("sosBtnHold");
  if (!btn) return;
  let holdTimer = null;
  let countdown = 3;
  let countInterval = null;

  const updateClock = () => {
    const el = document.getElementById("sosTimeDisplay");
    if (!el) return;
    const now = new Date();
    el.textContent = now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0");
  };
  updateClock();
  setInterval(updateClock, 10000);

  const startHold = () => {
    countdown = 3;
    const label = document.getElementById("sosBtnLabel");
    const sub   = document.getElementById("sosBtnSub");
    const core  = btn.querySelector(".shb-core");
    if (label) label.textContent = "3";
    if (sub)   sub.textContent = "suelta para cancelar";
    if (core)  core.classList.add("counting");
    countInterval = setInterval(() => {
      countdown--;
      if (countdown <= 0) {
        clearInterval(countInterval);
        cancelHold();
        triggerSOS();
      } else {
        if (label) label.textContent = String(countdown);
      }
    }, 1000);
  };

  const cancelHold = () => {
    clearInterval(countInterval);
    const label = document.getElementById("sosBtnLabel");
    const sub   = document.getElementById("sosBtnSub");
    const core  = btn.querySelector(".shb-core");
    if (label) label.textContent = "SOS";
    if (sub)   sub.textContent = "Mantener 3s";
    if (core)  core.classList.remove("counting");
  };

  btn.addEventListener("mousedown",  startHold);
  btn.addEventListener("touchstart", startHold, { passive: true });
  btn.addEventListener("mouseup",    cancelHold);
  btn.addEventListener("mouseleave", cancelHold);
  btn.addEventListener("touchend",   cancelHold);
}

function triggerSOS() {
  showSOSState("sosStateSent");
  showToast("ðŸ†˜ SOS activado â€” 3 contactos notificados con GPS");
}

function cancelSOS() {
  showSOSState("sosStateCancelled");
  showToast("Alerta cancelada â€” tus contactos fueron informados");
}

function reportSafe() {
  showSOSState("sosStateSafe");
  showToast("âœ… Tus contactos saben que estÃ¡s a salvo");
}

function activateVoice() {
  showSOSState("sosStateVoice");
  setTimeout(() => {
    triggerSOS();
    showToast("ðŸŽ¤ Voz reconocida: SOS activado automÃ¡ticamente");
  }, 2800);
}

function toggleTorch() {
  const btn    = document.getElementById("torchBtn");
  const status = document.getElementById("torchStatus");
  const isOn   = btn?.textContent.includes("apagada") === false && status?.textContent.includes("encendida");
  if (status) status.textContent = isOn ? "Linterna: apagada" : "Linterna: encendida ðŸ”¦";
  if (btn)    btn.textContent    = isOn ? "ðŸ”¦ Linterna"      : "ðŸ’¡ Encendida";
  showToast(isOn ? "Linterna apagada" : "Linterna encendida âœ“");
}

function showProximityAlert() {
  const pa = document.getElementById("proximityAlert");
