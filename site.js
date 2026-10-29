(() => {
  "use strict";

  document.documentElement.classList.add("js");
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector(".site-nav");

  function setMenu(open, restoreFocus = false) {
    if (!menuButton || !navigation) return;
    menuButton.setAttribute("aria-expanded", String(open));
    navigation.classList.toggle("is-open", open);
    const label = menuButton.querySelector("[data-menu-label]");
    if (label) label.textContent = open ? "Close" : "Menu";
    if (restoreFocus) menuButton.focus();
  }

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });
  navigation?.addEventListener("click", event => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", event => {
    if (header && !header.contains(event.target)) setMenu(false);
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuButton?.getAttribute("aria-expanded") === "true") {
      setMenu(false, true);
    }
  });
  window.matchMedia("(min-width: 801px)").addEventListener("change", event => {
    if (event.matches) setMenu(false);
  });

  let scrollQueued = false;
  function updateHeader() {
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
    scrollQueued = false;
  }
  updateHeader();
  window.addEventListener("scroll", () => {
    if (!scrollQueued) {
      scrollQueued = true;
      window.requestAnimationFrame(updateHeader);
    }
  }, { passive: true });

  const toast = document.querySelector("[data-toast]");
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toastTimer = window.setTimeout(() => { toast.hidden = true; }, 2600);
  }

  async function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        return true;
      } catch { /* Try the local copy fallback below. */ }
    }
    const field = document.createElement("textarea");
    field.value = value;
    field.readOnly = true;
    field.style.cssText = "position:fixed;left:-10000px;top:0;opacity:0";
    const previousFocus = document.activeElement;
    document.body.append(field);
    field.select();
    let success = false;
    try { success = document.execCommand("copy"); } catch { success = false; }
    field.remove();
    previousFocus?.focus();
    return success;
  }

  document.querySelectorAll("[data-copy-email]").forEach(button => {
    let resetTimer;
    button.addEventListener("click", async () => {
      const copied = await copyText(button.dataset.copyEmail);
      showToast(copied ? "Email address copied." : "Copy unavailable. You can use the email link.");
      const label = button.querySelector("[data-copy-label]");
      if (!label) return;
      window.clearTimeout(resetTimer);
      label.textContent = copied ? "Copied" : "Copy";
      resetTimer = window.setTimeout(() => { label.textContent = "Copy"; }, 2000);
    });
  });

  document.querySelectorAll("[data-filter-group]").forEach(group => {
    const controls = [...group.querySelectorAll("[data-filter]")];
    const items = [...group.querySelectorAll("[data-filter-item]")];
    const status = group.querySelector("[data-filter-status]");
    const noun = group.dataset.itemLabel || "items";

    function filter(category) {
      let visible = 0;
      items.forEach(item => {
        const matches = category === "all" || item.dataset.category.split(" ").includes(category);
        item.hidden = !matches;
        if (matches) visible += 1;
      });
      controls.forEach(control => {
        control.setAttribute("aria-pressed", String(control.dataset.filter === category));
      });
      if (status) status.textContent = `Showing ${visible} of ${items.length} ${noun}`;
      group.dispatchEvent(new CustomEvent("filterchange"));
    }

    controls.forEach(control => control.addEventListener("click", () => filter(control.dataset.filter)));
    filter(controls.find(control => control.getAttribute("aria-pressed") === "true")?.dataset.filter || "all");
  });

  document.querySelectorAll("[data-expand-all]").forEach(button => {
    const group = button.closest("[data-filter-group]");
    if (!group) return;
    const visibleDetails = () => [...group.querySelectorAll(".role-details")].filter(details => !details.closest("[data-filter-item]").hidden);
    function updateLabel() {
      const details = visibleDetails();
      const expanded = details.length > 0 && details.every(item => item.open);
      button.textContent = expanded ? "Collapse all details" : "Expand all details";
      button.setAttribute("aria-expanded", String(expanded));
    }
    button.addEventListener("click", () => {
      const details = visibleDetails();
      const expand = !details.every(item => item.open);
      details.forEach(item => { item.open = expand; });
      updateLabel();
    });
    group.addEventListener("toggle", updateLabel, true);
    group.addEventListener("filterchange", updateLabel);
    updateLabel();
  });

  document.querySelectorAll("[data-book-tabs]").forEach(group => {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    const panels = [...group.querySelectorAll('[role="tabpanel"]')];
    if (!tabs.length) return;
    function activate(tab, focus = false) {
      tabs.forEach(item => {
        const active = item === tab;
        item.setAttribute("aria-selected", String(active));
        item.tabIndex = active ? 0 : -1;
      });
      panels.forEach(panel => { panel.hidden = panel.id !== tab.getAttribute("aria-controls"); });
      if (focus) {
        tab.focus();
        tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
      }
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", event => {
        let next;
        if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
        else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = tabs.length - 1;
        else return;
        event.preventDefault();
        activate(tabs[next], true);
      });
    });
    group.classList.add("is-ready");
    activate(tabs.find(tab => tab.getAttribute("aria-selected") === "true") || tabs[0]);
  });

  function openHashTarget() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const item = target.closest("[data-filter-item]");
    if (item?.hidden) item.closest("[data-filter-group]")?.querySelector('[data-filter="all"]')?.click();
    const panel = target.closest('[role="tabpanel"]');
    if (panel?.hidden) {
      document.querySelector(`[role="tab"][aria-controls="${panel.id}"]`)?.click();
    }
    const details = target.matches("details") ? target : target.querySelector(".role-details, .project-notes");
    if (details) details.open = true;
    window.requestAnimationFrame(() => target.scrollIntoView({ block: "start", behavior: "auto" }));
  }
  window.addEventListener("hashchange", openHashTarget);
  openHashTarget();

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (typeof entry.target.animate === "function") {
          entry.target.animate([{ opacity: .4, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }], { duration: 360, easing: "ease-out" });
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    document.querySelectorAll("[data-reveal]").forEach(item => observer.observe(item));
  }
})();
