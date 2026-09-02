const header = document.querySelector("[data-header]");
const platformTrack = document.querySelector("[data-platform-track]");
const platformTabs = Array.from(document.querySelectorAll("[data-platform-step]"));
const platformPanels = Array.from(document.querySelectorAll("[data-stage-panel]"));
const stageCount = document.querySelector("[data-stage-count]");
const stageTitle = document.querySelector("[data-stage-title]");
const stageDescription = document.querySelector("[data-stage-description]");

const platformStages = [
  {
    title: "Connected sources",
    description:
      "Connect DMS, CRM, inventory, market data, service repair orders, and financial signals into one governed foundation.",
  },
  {
    title: "Automotive digital twin",
    description:
      "Assemble a living model of every VIN, customer, deal, repair order, lender, and location—with the relationships that make each signal useful.",
  },
  {
    title: "Focused control towers",
    description:
      "Generate an operating view for each use case: what changed, why it matters, and where attention can create the greatest value.",
  },
  {
    title: "Governed decisions",
    description:
      "Surface recommended actions with rationale, potential impact, confidence, and the approval path defined by the business.",
  },
  {
    title: "Measured outcomes",
    description:
      "Compare each completed action with its baseline so operators can see what changed in gross, turn, utilization, or retention.",
  },
  {
    title: "Continuous learning",
    description:
      "Feed outcomes and operator corrections back into the model so recommendations improve by location, segment, and operating condition.",
  },
];

const interactivePlatform = window.matchMedia(
  "(min-width: 821px) and (prefers-reduced-motion: no-preference)",
);
const stackedApplications = window.matchMedia("(max-width: 620px)");
let activeStage = 0;
let scrollFrame = 0;

const setHeaderState = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 10);
};

const renderPlatformStage = (index, focusTab = false) => {
  const next = Math.max(0, Math.min(platformStages.length - 1, index));
  activeStage = next;
  const isInteractive = interactivePlatform.matches;

  platformTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === next;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focusTab) tab.focus();
  });

  platformPanels.forEach((panel, panelIndex) => {
    const selected = panelIndex === next;
    panel.classList.toggle("is-active", selected || !isInteractive);
    panel.hidden = isInteractive ? !selected : false;
  });

  if (stageCount) stageCount.textContent = `${String(next + 1).padStart(2, "0")} / 06`;
  if (stageTitle) stageTitle.textContent = platformStages[next].title;
  if (stageDescription) stageDescription.textContent = platformStages[next].description;
};

const scrollToPlatformStage = (index) => {
  if (!platformTrack || !interactivePlatform.matches) {
    renderPlatformStage(index, true);
    return;
  }

  const rect = platformTrack.getBoundingClientRect();
  const trackTop = rect.top + window.scrollY;
  const range = Math.max(0, rect.height - window.innerHeight);
  const target = trackTop + range * (index / (platformStages.length - 1));
  window.scrollTo({ top: target, behavior: "smooth" });
  renderPlatformStage(index, true);
};

const updatePlatformFromScroll = () => {
  scrollFrame = 0;
  if (!platformTrack || !interactivePlatform.matches) return;

  const rect = platformTrack.getBoundingClientRect();
  const range = rect.height - window.innerHeight;
  if (range <= 0) return;

  const progress = Math.max(0, Math.min(1, -rect.top / range));
  const nextStage = Math.min(
    platformStages.length - 1,
    Math.floor(progress * platformStages.length),
  );
  if (nextStage !== activeStage) renderPlatformStage(nextStage);
};

const scheduleScrollUpdate = () => {
  setHeaderState();
  if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updatePlatformFromScroll);
};

platformTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => scrollToPlatformStage(index));
  tab.addEventListener("keydown", (event) => {
    let target = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = (index + 1) % platformTabs.length;
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = (index - 1 + platformTabs.length) % platformTabs.length;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = platformTabs.length - 1;
    if (target === null) return;
    event.preventDefault();
    scrollToPlatformStage(target);
  });
});

const syncPlatformMode = () => {
  renderPlatformStage(activeStage);
  updatePlatformFromScroll();
};

interactivePlatform.addEventListener("change", syncPlatformMode);
window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
window.addEventListener("resize", scheduleScrollUpdate, { passive: true });
setHeaderState();
renderPlatformStage(0);

const applications = document.querySelector("[data-applications]");
const applicationPages = Array.from(document.querySelectorAll("[data-application-page]"));
const applicationDots = Array.from(document.querySelectorAll("[data-application-dot]"));
const applicationNav = Array.from(document.querySelectorAll("[data-application-nav]"));
let activeApplicationPage = 0;
let touchStartX = 0;

const renderApplicationPage = (index, focusDot = false) => {
  if (!applicationPages.length) return;
  const total = applicationPages.length;
  activeApplicationPage = (index + total) % total;
  const isStacked = stackedApplications.matches;

  applicationPages.forEach((page, pageIndex) => {
    const selected = pageIndex === activeApplicationPage;
    page.classList.toggle("is-active", selected || isStacked);
    page.hidden = isStacked ? false : !selected;
  });

  applicationDots.forEach((dot, dotIndex) => {
    const selected = dotIndex === activeApplicationPage;
    dot.setAttribute("aria-selected", String(selected));
    dot.tabIndex = selected ? 0 : -1;
    if (selected && focusDot) dot.focus();
  });
};

applicationNav.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.applicationNav === "next" ? 1 : -1;
    renderApplicationPage(activeApplicationPage + direction);
  });
});

applicationDots.forEach((dot, index) => {
  dot.addEventListener("click", () => renderApplicationPage(index));
  dot.addEventListener("keydown", (event) => {
    let target = null;
    if (event.key === "ArrowRight") target = index + 1;
    if (event.key === "ArrowLeft") target = index - 1;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = applicationDots.length - 1;
    if (target === null) return;
    event.preventDefault();
    renderApplicationPage(target, true);
  });
});

applications?.addEventListener(
  "touchstart",
  (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? 0;
  },
  { passive: true },
);

applications?.addEventListener(
  "touchend",
  (event) => {
    if (stackedApplications.matches) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX;
    const distance = endX - touchStartX;
    if (Math.abs(distance) < 55) return;
    renderApplicationPage(activeApplicationPage + (distance < 0 ? 1 : -1));
  },
  { passive: true },
);

stackedApplications.addEventListener("change", () => renderApplicationPage(activeApplicationPage));
renderApplicationPage(0);
