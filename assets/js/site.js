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

// ---------- F6.3 — Page transitions (feature-flagged via <body data-page-transitions>) ----------
(function () {
  'use strict';

  if (!document.body || document.body.dataset.pageTransitions === undefined) return;

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Resolve transition duration from --motion-base (fallback 350ms).
  function getDurationMs() {
    try {
      var raw = getComputedStyle(document.documentElement)
        .getPropertyValue('--motion-base').trim();
      if (!raw) return 350;
      if (raw.indexOf('ms') !== -1) return parseFloat(raw);
      if (raw.indexOf('s') !== -1) return parseFloat(raw) * 1000;
      var n = parseFloat(raw);
      return isNaN(n) ? 350 : n;
    } catch (e) {
      return 350;
    }
  }

  // Briefly add is-entering on load, then remove next frame.
  if (!prefersReduced) {
    document.body.classList.add('is-entering');
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        document.body.classList.remove('is-entering');
      });
    });
  }

  function isInternalNav(a, e) {
    if (!a || !a.href) return false;
    if (e.defaultPrevented) return false;
    if (e.button !== 0) return false;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== '' && a.target !== '_self') return false;
    var href = a.getAttribute('href') || '';
    if (!href) return false;
    if (/^(mailto:|tel:|javascript:|data:)/i.test(href)) return false;
    if (href.charAt(0) === '#') return false;
    // Same origin?
    if (a.origin && a.origin !== window.location.origin) return false;
    // Skip same-page anchor links (path/hash only)
    if (a.pathname === window.location.pathname &&
        a.search === window.location.search &&
        a.hash) {
      return false;
    }
    return true;
  }

  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    if (!isInternalNav(a, e)) return;
    if (prefersReduced) return; // navigate normally

    e.preventDefault();
    var href = a.href;
    document.body.classList.add('is-leaving');
    window.setTimeout(function () {
      window.location.href = href;
    }, getDurationMs());
  });

  // Restore on bfcache restore
  window.addEventListener('pageshow', function (evt) {
    if (evt.persisted) {
      document.body.classList.remove('is-leaving');
    }
  });
})();

// ---------- F5.2 — Scroll-to-top button ----------
(function () {
  'use strict';

  var buttons = document.querySelectorAll('.btn-to-top');
  if (!buttons.length) return;

  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener('click', function () {
      var prefersReduced = window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? 'auto' : 'smooth'
      });
    });
  });
})();

/* ---- v3.1 — Hero headline rotation (monopo float-up animation) --------- */
(function () {
  'use strict';
  var host = document.querySelector('.hero__title[data-rotate]');
  if (!host) return;

  // Each phrase ships as HTML so one letter can be italicised in monopo style.
  var phrases = [
    'Hello',
    'J<em>i</em>ng Hui Wong',
    'Build<em>i</em>ng with AI',
    'Data Sc<em>i</em>entist'
  ];
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Render the initial phrase wrapped in an inner span that owns the
  // transform/opacity animation. Final phrase is the static fallback
  // for reduced-motion + no-JS users.
  function render(html) {
    host.innerHTML = '<span class="hero__title__inner">' + html + '</span>';
    return host.firstChild;
  }

  if (prefersReduced) {
    render(phrases[phrases.length - 1]);
    return;
  }

  var index = 0;
  var inner = render(phrases[0]);

  var INTERVAL  = 2500;
  var SLIDE_OUT = 450;
  var SLIDE_IN  = 450;
  var timer = null;

  function tick() {
    // Slide current out
    inner.classList.add('hero__title__inner--out');
    setTimeout(function () {
      // Swap to next phrase, mount it pre-positioned below
      index = (index + 1) % phrases.length;
      inner = render(phrases[index]);
      inner.classList.add('hero__title__inner--in');
      // Force layout, then remove the --in class so transition runs into place
      // (next animation frame so the browser registers the start state).
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          inner.classList.remove('hero__title__inner--in');
        });
      });
    }, SLIDE_OUT);
  }

  function start() { if (!timer) timer = setInterval(tick, INTERVAL); }
  function stop()  { if (timer) { clearInterval(timer); timer = null; } }

  start();
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });
})();
