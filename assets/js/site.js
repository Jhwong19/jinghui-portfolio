// Redesign source of truth. Vanilla JS, IntersectionObserver, no jQuery.

(function () {
  'use strict';

  // ---------- F1.3 — Hamburger toggle, focus-trap, Esc-close ----------
  var burger = document.querySelector('.burger');
  var overlay = document.getElementById('overlay-nav');

  if (!burger || !overlay) return;

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';
  var lastFocused = null;

  function getFocusable() {
    return Array.prototype.slice.call(overlay.querySelectorAll(FOCUSABLE));
  }

  function openNav() {
    lastFocused = document.activeElement;
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('nav-open');
    var focusables = getFocusable();
    if (focusables.length) {
      // Focus first link after the transition starts
      window.setTimeout(function () { focusables[0].focus(); }, 50);
    }
    document.addEventListener('keydown', onKeydown);
  }

  function closeNav() {
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('nav-open');
    document.removeEventListener('keydown', onKeydown);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    } else {
      burger.focus();
    }
  }

  function toggleNav() {
    if (burger.getAttribute('aria-expanded') === 'true') closeNav();
    else openNav();
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      closeNav();
      return;
    }
    if (e.key === 'Tab') {
      var focusables = getFocusable();
      if (!focusables.length) {
        e.preventDefault();
        return;
      }
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      var active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (!overlay.contains(active)) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  burger.addEventListener('click', toggleNav);

  // Close overlay when an in-page link is clicked
  overlay.addEventListener('click', function (e) {
    var t = e.target;
    if (t && t.tagName === 'A') {
      // Skip closing for links opening in a new tab — overlay should remain
      // for the user to return to.
      if (t.getAttribute('target') === '_blank') return;
      // Allow navigation, then ensure state is reset for same-page anchors
      closeNav();
    }
  });
})();
