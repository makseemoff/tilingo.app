(function () {
  var menus = document.querySelectorAll("[data-menu]");

  function closeMenu(menu) {
    var button = menu.querySelector(".menu-toggle");
    var panel = menu.querySelector(".menu-panel");
    if (!button || !panel || button.getAttribute("aria-expanded") !== "true") {
      return;
    }

    menu.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    var isClosed = false;

    var onTransitionEnd = function (event) {
      if (event.target !== panel) {
        return;
      }
      if (isClosed) {
        return;
      }
      isClosed = true;
      panel.hidden = true;
      panel.removeEventListener("transitionend", onTransitionEnd);
      clearTimeout(fallbackTimer);
    };

    panel.addEventListener("transitionend", onTransitionEnd);
    var fallbackTimer = window.setTimeout(function () {
      if (isClosed) {
        return;
      }
      isClosed = true;
      panel.hidden = true;
      panel.removeEventListener("transitionend", onTransitionEnd);
    }, 240);
  }

  function openMenu(menu) {
    var button = menu.querySelector(".menu-toggle");
    var panel = menu.querySelector(".menu-panel");
    if (!button || !panel || button.getAttribute("aria-expanded") === "true") {
      return;
    }

    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    window.requestAnimationFrame(function () {
      menu.classList.add("is-open");
    });
  }

  menus.forEach(function (menu) {
    var button = menu.querySelector(".menu-toggle");
    if (!button) {
      return;
    }

    button.addEventListener("click", function (event) {
      event.stopPropagation();
      if (button.getAttribute("aria-expanded") === "true") {
        closeMenu(menu);
        return;
      }

      menus.forEach(function (otherMenu) {
        if (otherMenu !== menu) {
          closeMenu(otherMenu);
        }
      });
      openMenu(menu);
    });

    document.addEventListener("click", function (event) {
      if (!menu.contains(event.target)) {
        closeMenu(menu);
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeMenu(menu);
      }
    });
  });
})();
