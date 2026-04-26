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

// ---------- F1.4 — Reveal utility (IntersectionObserver) ----------
(function () {
  'use strict';

  var targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || typeof IntersectionObserver === 'undefined') {
    // Short-circuit: reveal everything immediately, no observer.
    Array.prototype.forEach.call(targets, function (el) {
      el.classList.add('is-inview');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  });

  Array.prototype.forEach.call(targets, function (el) {
    observer.observe(el);
  });
})();

// ---------- F4.3 — Member card "+" expand toggle ----------
(function () {
  'use strict';

  var buttons = document.querySelectorAll('.member__expand');
  if (!buttons.length) return;

  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var targetId = btn.getAttribute('aria-controls');
      var target = targetId ? document.getElementById(targetId) : null;

      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      btn.setAttribute('aria-label', expanded ? 'Expand bio' : 'Collapse bio');

      if (target) {
        if (expanded) {
          target.setAttribute('hidden', '');
        } else {
          target.removeAttribute('hidden');
        }
      }
    });
  });
})();

// ---------- F4.2 — Manifesto line-draw on intersection ----------
(function () {
  'use strict';

  var lines = document.querySelectorAll('.manifesto-line');
  if (!lines.length) return;

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced || typeof IntersectionObserver === 'undefined') {
    Array.prototype.forEach.call(lines, function (el) {
      el.classList.add('is-drawn');
    });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-drawn');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '0px 0px -10% 0px'
  });

  Array.prototype.forEach.call(lines, function (el) {
    observer.observe(el);
  });
})();
