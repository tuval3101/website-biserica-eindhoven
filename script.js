const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const currentYear = document.querySelector("[data-current-year]");

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const initNavigation = () => {
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector("#primary-navigation");
  const dropdowns = Array.from(document.querySelectorAll(".info-menu"));
  let activeDropdown = null;
  let closeTimer = null;

  const closeDropdown = (dropdown = activeDropdown) => {
    if (!dropdown) return;
    dropdown.classList.remove("is-open");
    dropdown.querySelector(":scope > a")?.setAttribute("aria-expanded", "false");
    if (activeDropdown === dropdown) activeDropdown = null;
  };

  const closeAllDropdowns = () => dropdowns.forEach(closeDropdown);

  const openDropdown = (dropdown) => {
    window.clearTimeout(closeTimer);
    if (activeDropdown && activeDropdown !== dropdown) closeDropdown(activeDropdown);
    activeDropdown = dropdown;
    dropdown.classList.add("is-open");
    dropdown.querySelector(":scope > a")?.setAttribute("aria-expanded", "true");
  };

  const scheduleClose = (dropdown) => {
    window.clearTimeout(closeTimer);
    closeTimer = window.setTimeout(() => closeDropdown(dropdown), 700);
  };

  if (navToggle && primaryNav) {
    const closeMenu = () => {
      navToggle.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      closeAllDropdowns();
    };

    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!isOpen));
      primaryNav.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });

    primaryNav.addEventListener("click", (event) => {
      const link = event.target instanceof HTMLAnchorElement ? event.target : null;

      if (link) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  }

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(":scope > a");
    trigger?.setAttribute("aria-haspopup", "true");
    trigger?.setAttribute("aria-expanded", "false");

    dropdown.addEventListener("mouseenter", () => openDropdown(dropdown));
    dropdown.addEventListener("mouseleave", () => scheduleClose(dropdown));
    dropdown.addEventListener("focusin", () => openDropdown(dropdown));
    dropdown.addEventListener("focusout", (event) => {
      if (!dropdown.contains(event.relatedTarget)) scheduleClose(dropdown);
    });
  });

  document.addEventListener("click", (event) => {
    if (
      primaryNav?.classList.contains("is-open") &&
      !event.target.closest("#primary-navigation") &&
      !event.target.closest(".nav-toggle")
    ) {
      navToggle?.setAttribute("aria-expanded", "false");
      primaryNav.classList.remove("is-open");
      document.body.classList.remove("nav-open");
      closeAllDropdowns();
    }

    if (!event.target.closest(".info-menu")) closeAllDropdowns();
  });
};

const initHeroSlider = (container) => {
  const slides = Array.from(container.querySelectorAll(".hero__slide"));
  if (slides.length < 2) return;

  let activeSlide = Math.max(0, slides.findIndex((slide) => slide.classList.contains("is-active")));
  let rotationTimer = null;
  const dotsWrap = container.querySelector("[data-hero-dots]") || document.createElement("div");

  dotsWrap.className = "hero__dots";
  dotsWrap.dataset.heroDots = "";
  if (!dotsWrap.parentElement) container.appendChild(dotsWrap);

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero__dot";
    dot.setAttribute("aria-label", `Afișează imaginea hero ${index + 1}`);
    dot.addEventListener("click", () => {
      setActiveSlide(index);
      startRotation();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  const updateDots = () => {
    dots.forEach((dot, index) => {
      const isActive = index === activeSlide;
      dot.classList.toggle("is-active", isActive);
      dot.setAttribute("aria-pressed", String(isActive));
    });
  };

  function setActiveSlide(index) {
    slides[activeSlide].classList.remove("is-active");
    activeSlide = index;
    slides[activeSlide].classList.add("is-active");
    updateDots();

    const nextSlide = slides[(activeSlide + 1) % slides.length];
    const preload = new Image();
    preload.src = nextSlide.currentSrc || nextSlide.src;
  }

  function startRotation() {
    window.clearInterval(rotationTimer);
    if (prefersReducedMotion) return;
    rotationTimer = window.setInterval(() => {
      setActiveSlide((activeSlide + 1) % slides.length);
    }, 8000);
  }

  slides.forEach((slide) => {
    const preload = new Image();
    preload.src = slide.currentSrc || slide.src;
  });
  updateDots();
  startRotation();
};

initNavigation();
document.querySelectorAll("[data-hero-slider], .hero").forEach(initHeroSlider);
