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
    // threshold 0 (not 0.15) so very tall containers — like a full
    // project blog article — fire as soon as their top edge enters
    // the viewport. The previous 0.15 required 15% of the element to
    // intersect, which a 5000px article relative to an 800px viewport
    // never reaches → element stays at opacity 0 → content invisible.
    threshold: 0,
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

/* ---- v6.2 — Hero typewriter rotation (monospace, single-line) --------- */
(function () {
  'use strict';
  var host = document.querySelector('.hero__title[data-rotate]');
  if (!host) return;

  var phrases = ['Hello', 'Jing Hui Wong', 'Building with AI', 'AI Engineer'];

  // v8.1 — the typewriter no longer short-circuits under
  // prefers-reduced-motion. The phrase cycle is essential motion
  // (it's the page's identity, not decoration), and OS-level reduced
  // motion settings (often inherited from iOS Low Power Mode) were
  // freezing it on most mobile devices. The caret blink remains
  // gated via CSS @media (prefers-reduced-motion).

  // Two-span structure: a stable text node holds the typed characters,
  // a sibling span renders the blinking caret. Replace the host's inner
  // markup once on init; subsequent ticks only mutate textContent.
  function mount(initialText) {
    host.innerHTML =
      '<span class="hero__title__char"></span>' +
      '<span class="hero__title__caret" aria-hidden="true">|</span>';
    var charEl = host.firstChild;
    charEl.textContent = initialText;
    return charEl;
  }

  var charEl = mount('');

  // State machine: TYPING → PAUSE_AFTER → DELETING → PAUSE_BEFORE → next
  var TYPE_MS         = 70;
  var DELETE_MS       = 40;
  var PAUSE_AFTER_MS  = 1500;
  var PAUSE_BEFORE_MS = 250;

  var phraseIdx = 0;
  var charPos   = 0;
  var mode      = 'typing'; // typing | deleting
  var timer     = null;
  var paused    = false;

  function schedule(ms, fn) {
    if (paused) return;
    timer = setTimeout(fn, ms);
  }

  function tick() {
    timer = null;
    var phrase = phrases[phraseIdx];

    if (mode === 'typing') {
      if (charPos < phrase.length) {
        charPos++;
        charEl.textContent = phrase.slice(0, charPos);
        schedule(TYPE_MS, tick);
      } else {
        // Hold the full phrase, then start deleting.
        mode = 'deleting';
        schedule(PAUSE_AFTER_MS, tick);
      }
    } else { // deleting
      if (charPos > 0) {
        charPos--;
        charEl.textContent = phrase.slice(0, charPos);
        schedule(DELETE_MS, tick);
      } else {
        // Empty — advance to the next phrase, brief pause, then type it.
        phraseIdx = (phraseIdx + 1) % phrases.length;
        mode = 'typing';
        schedule(PAUSE_BEFORE_MS, tick);
      }
    }
  }

  function start() { if (!timer && !paused) tick(); }
  function stop()  { if (timer) { clearTimeout(timer); timer = null; } }

  start();
  document.addEventListener('visibilitychange', function () {
    paused = document.hidden;
    if (paused) stop(); else start();
  });
})();

/* ---- v3.3 — Vanilla cursor dot (small white circle, lerped) ----------- */
(function () {
  'use strict';

  // Skip on touch / hover-less devices and when the user prefers reduced
  // motion. Skip when no fine pointer (rules out tablets in tablet mode).
  var hasFinePointer = window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!hasFinePointer || prefersReduced) return;

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  var targetX = window.innerWidth  / 2;
  var targetY = window.innerHeight / 2;
  var dotX    = targetX;
  var dotY    = targetY;
  var lerp    = 0.18;
  var raf     = null;
  var seen    = false;

  function onMove(e) {
    targetX = e.clientX;
    targetY = e.clientY;
    if (!seen) {
      seen = true;
      dotX = targetX;
      dotY = targetY;
      dot.classList.add('cursor-dot--visible');
    }
    if (!raf) raf = requestAnimationFrame(tick);
  }

  function onLeave() {
    dot.classList.remove('cursor-dot--visible');
  }
  function onEnter() {
    if (seen) dot.classList.add('cursor-dot--visible');
  }

  function tick() {
    raf = null;
    dotX += (targetX - dotX) * lerp;
    dotY += (targetY - dotY) * lerp;
    dot.style.transform =
      'translate3d(' + dotX + 'px, ' + dotY + 'px, 0) translate(-50%, -50%)';
    var dx = targetX - dotX;
    var dy = targetY - dotY;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      raf = requestAnimationFrame(tick);
    }
  }

  window.addEventListener('mousemove',  onMove,  { passive: true });
  document.addEventListener('mouseleave', onLeave);
  document.addEventListener('mouseenter', onEnter);
  // Hide while interacting with form controls / links so the OS cursor
  // change (text caret, pointer hand) is unambiguous.
  document.addEventListener('mousedown', function () {
    dot.classList.add('cursor-dot--pressed');
  });
  document.addEventListener('mouseup', function () {
    dot.classList.remove('cursor-dot--pressed');
  });
})();

/* ---- v4.3 — Scroll-spy active section in the right-side nav ----------- */
(function () {
  'use strict';
  var items = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav li[data-spy]')
  );
  if (!items.length || typeof IntersectionObserver === 'undefined') return;

  // Map each spy id to its <li> if a section with that id exists on this page.
  var pairs = items
    .map(function (li) {
      var section = document.getElementById(li.getAttribute('data-spy'));
      return section ? { li: li, section: section, ratio: 0 } : null;
    })
    .filter(Boolean);
  if (!pairs.length) return;

  function setActive(li) {
    items.forEach(function (item) {
      item.classList.toggle('is-active', item === li);
    });
  }

  // Activate the section with the highest current intersection ratio.
  // If nothing is intersecting (between sections), keep the last winner.
  function pickWinner() {
    var winner = null;
    pairs.forEach(function (p) {
      if (!winner || p.ratio > winner.ratio) winner = p;
    });
    if (winner && winner.ratio > 0) setActive(winner.li);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var match = pairs.find(function (p) { return p.section === entry.target; });
      if (match) match.ratio = entry.intersectionRatio;
    });
    pickWinner();
  }, {
    // Bias toward the section whose top has crossed roughly 1/3 down the
    // viewport. Negative bottom margin pulls the trigger early.
    rootMargin: '-25% 0px -55% 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
  });

  pairs.forEach(function (p) { observer.observe(p.section); });
})();

/* ---- v7.3 — Bidirectional scroll-fill text reveal --------------------- */
/* Two modes (both REVERSIBLE — words / lines revert to grey when the
   user scrolls back up past them):
   - data-fill="line"  : the whole element transitions grey ↔ white.
   - data-fill="words" : each word fades grey ↔ white independently as
                         it enters or leaves the trigger band. A
                         per-word transition-delay creates a left-to-
                         right cascade so the line "fills" rather than
                         all words flipping at once.                       */
(function () {
  'use strict';
  var lineEls = document.querySelectorAll('[data-fill="line"]');
  var wordEls = document.querySelectorAll('[data-fill="words"]');
  if (!lineEls.length && !wordEls.length) return;

  var hasIO = typeof IntersectionObserver !== 'undefined';

  // v9.2 — the scroll-fill effect no longer short-circuits under
  // prefers-reduced-motion. The grey → white per-word reveal is
  // colour-only (no parallax, no fast pans, no flashing), and the
  // OS-level reduced-motion preference — frequently inherited from
  // iOS Low Power Mode — was forcing it to render as plain white
  // text on every mobile browser. Same root cause as the v8.1
  // typewriter / WebGL fix.
  //
  // We still short-circuit when IntersectionObserver isn't available
  // so JS-rich-but-IO-less environments (very old browsers) still
  // see legible content.
  if (!hasIO) {
    Array.prototype.forEach.call(lineEls, function (el) {
      el.classList.add('is-revealed');
    });
    Array.prototype.forEach.call(wordEls, function (el) {
      el.classList.add('is-revealed');
    });
    return;
  }

  // Helper: bidirectional toggle (no unobserve so the observer keeps
  // firing both directions as the element crosses the trigger band).
  function toggleObserver(rootMargin) {
    return new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-revealed', entry.isIntersecting);
      });
    }, { rootMargin: rootMargin, threshold: 0 });
  }

  // ---- line mode --------------------------------------------------------
  if (lineEls.length) {
    var lineObs = toggleObserver('0px 0px -25% 0px');
    Array.prototype.forEach.call(lineEls, function (el) { lineObs.observe(el); });
  }

  // ---- words mode -------------------------------------------------------
  // Split a plain-text element into <span class="fw">word</span> tokens
  // (preserving original whitespace). Sets a CSS custom property --i on
  // each word equal to its index, so the stylesheet can apply a
  // staggered transition-delay = --i * step → left-to-right cascade.
  function splitWords(el) {
    var text = el.textContent;
    if (!text) return [];
    var parts = text.split(/(\s+)/);
    el.textContent = '';
    var out = [];
    var idx = 0;
    parts.forEach(function (chunk) {
      if (!chunk) return;
      if (/^\s+$/.test(chunk)) {
        el.appendChild(document.createTextNode(chunk));
      } else {
        var s = document.createElement('span');
        s.className = 'fw';
        s.textContent = chunk;
        s.style.setProperty('--i', String(idx));
        el.appendChild(s);
        out.push(s);
        idx++;
      }
    });
    return out;
  }

  if (wordEls.length) {
    var wordObs = toggleObserver('0px 0px -30% 0px');
    Array.prototype.forEach.call(wordEls, function (el) {
      var words = splitWords(el);
      words.forEach(function (w) { wordObs.observe(w); });
    });
  }
})();

/* ---- v9.1 — Email obfuscation -------------------------------------- */
/* Plain mailto:user@domain in HTML is harvested aggressively by spam
   crawlers. We split the address into data-user / data-domain on the
   anchor, leaving no @ in the static markup, then assemble the real
   address client-side. Bots regex'ing for \w+@\w+\.\w+ find nothing.
   Real users keep the click → mail-client UX. JS-disabled users get
   a noscript "user dot name [at] domain dot com" fallback rendered
   server-side in the markup. */
(function () {
  'use strict';
  var anchors = document.querySelectorAll('a.contact__email[data-user][data-domain]');
  Array.prototype.forEach.call(anchors, function (a) {
    var user = a.getAttribute('data-user');
    var dom  = a.getAttribute('data-domain');
    if (!user || !dom) return;
    var addr = user + '@' + dom;
    a.href = 'mailto:' + addr;
    a.textContent = addr;
    // Drop the data-attrs once consumed so a curious DOM inspector
    // doesn't see the obfuscated form mid-page.
    a.removeAttribute('data-user');
    a.removeAttribute('data-domain');
  });
})();
