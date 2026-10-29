/* Shared navigation and small site interactions for Unboxed Thinking */
(function () {
  "use strict";

  function init() {
    var nav = document.querySelector(".nav, header.nav");
    var menu = document.querySelector(".mobile-menu");
    var toggles = document.querySelectorAll(".menu-btn, .menu-toggle");

    function setMenu(open) {
      if (menu) menu.classList.toggle("active", open);
      toggles.forEach(function (button) {
        button.classList.toggle("active", open);
        button.setAttribute("aria-expanded", open ? "true" : "false");
        button.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      });
      document.body.classList.toggle("menu-open", open);
    }

    toggles.forEach(function (button) {
      button.addEventListener("click", function () {
        setMenu(!(menu && menu.classList.contains("active")));
      });
    });

    if (menu) {
      menu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () { setMenu(false); });
      });
      menu.addEventListener("click", function (event) {
        if (event.target === menu) setMenu(false);
      });
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setMenu(false);
    });

    function updateNav() {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
    }
    window.addEventListener("scroll", updateNav, { passive: true });
    updateNav();

    document.querySelectorAll(".year").forEach(function (node) {
      node.textContent = new Date().getFullYear();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
