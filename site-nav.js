/* Per-page hamburger controller. Each page owns its own toggle and menu panel. */
(function () {
  "use strict";

  function getPairs() {
    var toggles = Array.prototype.slice.call(document.querySelectorAll(".menu-toggle"));
    return toggles.map(function (toggle) {
      var targetId = toggle.getAttribute("data-menu-target");
      var menu = targetId ? document.getElementById(targetId) : null;

      /* Backward compatibility for pages still using the original shared IDs. */
      if (!menu && toggle.id === "menuToggle") menu = document.getElementById("mobileMenu");
      return menu ? { toggle: toggle, menu: menu } : null;
    }).filter(Boolean);
  }

  function setMenu(toggle, menu, open) {
    if (!toggle || !menu) return;

    menu.classList.toggle("active", open);
    menu.classList.toggle("open", open);
    menu.setAttribute("aria-hidden", open ? "false" : "true");

    if (open) {
      menu.style.setProperty("display", "flex", "important");
      menu.style.setProperty("visibility", "visible", "important");
      menu.style.setProperty("opacity", "1", "important");
      menu.style.setProperty("pointer-events", "auto", "important");
      menu.style.setProperty("z-index", "11000", "important");
      menu.style.setProperty("transform", "none", "important");
    } else {
      ["display", "visibility", "opacity", "pointer-events", "z-index", "transform"]
        .forEach(function (property) { menu.style.removeProperty(property); });
    }

    toggle.classList.toggle("active", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  }

  function closeAll() {
    getPairs().forEach(function (pair) {
      setMenu(pair.toggle, pair.menu, false);
    });
  }

  function init() {
    getPairs().forEach(function (pair) {
      var toggle = pair.toggle;
      var menu = pair.menu;

      if (toggle.dataset.hamburgerBound !== "v8") {
        toggle.dataset.hamburgerBound = "v8";
        toggle.addEventListener("click", function (event) {
          event.preventDefault();
          event.stopPropagation();
          var isOpen = menu.classList.contains("active") || menu.classList.contains("open");
          setMenu(toggle, menu, !isOpen);
        }, true);
      }

      if (menu.dataset.hamburgerBound !== "v8") {
        menu.dataset.hamburgerBound = "v8";
        menu.addEventListener("click", function (event) {
          if (event.target === menu || (event.target.closest && event.target.closest("a"))) {
            setMenu(toggle, menu, false);
          }
        });
      }
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeAll();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) closeAll();
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  /* Supports navigation markup inserted after initial page load. */
  new MutationObserver(init).observe(document.documentElement, { childList: true, subtree: true });
})();