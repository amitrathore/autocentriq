const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-toggle]");
const menu = document.querySelector("[data-menu]");
const form = document.querySelector("[data-lead-form]");
const formMessage = document.querySelector("[data-form-message]");
const stickyCta = document.querySelector(".sticky-mobile-cta");

const setHeaderState = () => {
  const isScrolled = window.scrollY > 12;
  header?.classList.toggle("is-scrolled", isScrolled);
  stickyCta?.classList.toggle("is-visible", window.scrollY > 420);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = menu?.classList.toggle("is-open") ?? false;
  document.body.classList.toggle("menu-open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
});

menu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuButton?.setAttribute("aria-expanded", "false");
  });
});

document.querySelectorAll(".machine-card").forEach((card) => {
  card.addEventListener("click", () => {
    const isOpen = card.classList.toggle("is-open");
    card.setAttribute("aria-expanded", String(isOpen));
  });
});

document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  const buttons = Array.from(tabs.querySelectorAll('[role="tab"]'));
  const panels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.setAttribute("aria-selected", "false"));
      panels.forEach((panel) => {
        panel.hidden = true;
      });

      button.setAttribute("aria-selected", "true");
      const panel = tabs.querySelector(`#${button.getAttribute("aria-controls")}`);
      if (panel) {
        panel.hidden = false;
      }
    });
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!formMessage) return;

  formMessage.textContent =
    "Your Outcome Assessment request is received. We will prepare for a focused discussion about your highest-value opportunities.";
  form.reset();
});
