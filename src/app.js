import { siteConfig } from "./data/siteConfig.js";
import { getPageBySlug, pages } from "./data/pages.js";
import { markdownToHtml } from "./markdown.js";

const createLink = (href, label, className = "") => `<a${className ? ` class="${className}"` : ""} href="${href}">${label}</a>`;

const renderHeader = () => {
  const slujbe = pages.filter((page) => page.navGroup === "Slujbe");
  const informatii = pages.filter((page) => page.navGroup === "Informații");

  return `
    <div class="top-strip">
      <div class="container top-strip__inner">
        <span>Adresă: ${siteConfig.address}</span>
        <a href="mailto:${siteConfig.email}">Email: ${siteConfig.email}</a>
        <a href="${siteConfig.phoneHref}">Telefon părinte: ${siteConfig.phone}</a>
      </div>
    </div>
    <header class="site-header">
      <div class="container header__inner">
        <a class="brand" href="/" aria-label="${siteConfig.siteName}">
          <img class="logoIconImage" src="${siteConfig.logo}" alt="Sfânta Cuvioasă Parascheva">
          <span class="brand__text">
            <span>PAROHIA</span>
            <strong>„Sf. Parascheva<br>de la Iași”</strong>
            <span>EINDHOVEN–TILBURG</span>
          </span>
        </a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation">
          <span class="sr-only">Deschide meniul</span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </button>
        <nav class="primary-nav" id="primary-navigation" aria-label="Navigație principală">
          ${createLink("/", "ACASĂ")}
          ${createLink("/despre-noi/", "DESPRE NOI")}
          <div class="info-menu">
            ${createLink("/program-liturgic/", "SLUJBE")}
            <div class="info-menu__panel">${slujbe.map((page) => createLink(page.route, page.title)).join("")}</div>
          </div>
          <div class="info-menu">
            ${createLink("/botez/", "INFORMAȚII")}
            <div class="info-menu__panel">${informatii.map((page) => createLink(page.route, page.title)).join("")}</div>
          </div>
          ${createLink("/contact/", "CONTACT")}
          ${createLink("/donatii/", "DONEAZĂ", "nav-donate")}
        </nav>
      </div>
    </header>
  `;
};

const renderFooter = () => `
  <footer class="site-footer">
    <div class="container footer__grid">
      <div>
        <h2>Parohia „Sf. Parascheva de la Iași”<br>Eindhoven–Tilburg</h2>
        <p>O comunitate unită în credință,<br>iubire și rugăciune.</p>
      </div>
      <nav aria-label="Linkuri utile">
        <h3>Linkuri utile</h3>
        <a href="/despre-noi/">Despre noi</a>
        <a href="/program-liturgic/">Slujbe</a>
        <a href="/botez/">Informații</a>
        <a href="/contact/">Contact</a>
      </nav>
      <nav aria-label="Urmărește parohia">
        <h3>Urmărește</h3>
        <a href="${siteConfig.facebook}" target="_blank" rel="noopener noreferrer">Facebook</a>
      </nav>
    </div>
    <div class="container footer__bottom">
      <span>© ${new Date().getFullYear()} ${siteConfig.siteName}. Toate drepturile rezervate.</span>
    </div>
  </footer>
`;

const setMeta = (page) => {
  document.title = page.seoTitle;
  document.documentElement.lang = "ro";
  const set = (selector, attr, value) => {
    const element = document.head.querySelector(selector);
    if (element) element.setAttribute(attr, value);
  };
  set('meta[name="description"]', "content", page.seoDescription);
  set('meta[property="og:title"]', "content", page.seoTitle);
  set('meta[property="og:description"]', "content", page.seoDescription);
  set('meta[property="og:image"]', "content", page.heroImages?.[0] || page.heroImage);
  set('link[rel="canonical"]', "href", page.route);
};

const enhanceExternalLinks = (root) => {
  root.querySelectorAll('a[href^="http"]').forEach((link) => {
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
};

const initMenu = () => {
  const navToggle = document.querySelector(".nav-toggle");
  const primaryNav = document.querySelector(".primary-nav");
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

  if (!navToggle || !primaryNav) return;

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
    const dropdownTrigger = link?.closest(".info-menu")?.querySelector(":scope > a");

    if (link && link === dropdownTrigger) {
      const dropdown = link.closest(".info-menu");
      if (dropdown && window.matchMedia("(max-width: 1100px)").matches) {
        event.preventDefault();
        dropdown.classList.contains("is-open") ? closeDropdown(dropdown) : openDropdown(dropdown);
      }
      return;
    }

    if (link) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

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
    if (!event.target.closest(".info-menu")) closeAllDropdowns();
  });
};

const initHeroSlider = (container) => {
  const slides = Array.from(container.querySelectorAll(".hero__slide"));
  if (slides.length < 2) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

const renderPage = async () => {
  const slug = document.body.dataset.pageSlug;
  const page = getPageBySlug(slug);
  if (!page) return;

  document.querySelector("[data-site-header]").innerHTML = renderHeader();
  document.querySelector("[data-site-footer]").innerHTML = renderFooter();
  setMeta(page);
  initMenu();

  const main = document.querySelector("[data-page-main]");
  const heroImages = page.heroImages || [page.heroImage];
  const heroVisual = heroImages.length > 1
    ? `<div class="hero__slider" aria-hidden="true">${heroImages
        .map((image, index) => `<img class="hero__slide${index === 0 ? " is-active" : ""}" src="${image}" alt="">`)
        .join("")}</div><div class="hero__dots" data-hero-dots></div>`
    : "";
  const heroClass = heroImages.length > 1 ? "page-hero page-hero--slider" : "page-hero page-hero--image";
  const heroStyle = heroImages.length > 1 ? "" : ` style="--page-hero-image: url('${page.heroImage}')"`;

  main.innerHTML = `
    <section class="${heroClass}"${heroStyle} data-hero-slider>
      ${heroVisual}
      <div class="page-hero__shade"></div>
      <div class="container page-hero__inner">
        <div>
          <p class="eyebrow">${page.navGroup}</p>
          <h1>${page.title}</h1>
          <p>${page.description}</p>
        </div>
        <img class="page-icon" src="${page.icon}" alt="${page.title}">
      </div>
    </section>
    <section class="article-section">
      <div class="container article-layout">
        <article class="article-card markdown-body" data-markdown-content>
          <p>Se încarcă...</p>
        </article>
        <aside class="cta-card">
          <img src="${page.icon}" alt="" loading="lazy" decoding="async">
          <h2>Contact parohie</h2>
          <p>${siteConfig.address}</p>
          <a class="button button--burgundy" href="/contact/">Contactează părintele</a>
          <a class="button button--gold" href="${siteConfig.maps}" target="_blank" rel="noopener noreferrer">Vezi pe hartă</a>
        </aside>
      </div>
    </section>
  `;

  const response = await fetch(page.markdownFile);
  if (!response.ok) throw new Error(`Nu s-a putut încărca ${page.markdownFile}`);
  const markdown = await response.text();
  const content = main.querySelector("[data-markdown-content]");
  content.innerHTML = markdownToHtml(markdown);
  enhanceExternalLinks(content);
  main.querySelectorAll("[data-hero-slider]").forEach(initHeroSlider);
};

renderPage().catch((error) => {
  document.querySelector("[data-page-main]").innerHTML = `<section class="article-section"><div class="container article-card"><h1>Eroare</h1><p>${error.message}</p></div></section>`;
});
