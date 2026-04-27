import * as THREE from 'three';
import { createBackground } from './background.js';

(function bootstrap() {
  const heroSection = document.getElementById('hero');
  const canvas      = document.getElementById('hero-canvas');
  if (!heroSection || !canvas) return;

  // WebGL capability gate. On failure, leave .hero__orb visible.
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (err) {
    console.warn('[hero] WebGL init failed, keeping CSS fallback orb.', err);
    return;
  }

  // v8.1 — the WebGL background no longer freezes under
  // prefers-reduced-motion. The motion is a slow chrome-surface drift
  // (no parallax, no fast pans, no flashing), and OS-level reduced
  // motion settings — often inherited from iOS Low Power Mode —
  // were freezing the hero on most mobile devices. Vestibular safety
  // is preserved by the existing low velocity. Decorative effects
  // that ARE high-velocity (caret blink, scroll-fill transitions)
  // remain CSS-gated by @media (prefers-reduced-motion).

  const PIXEL_RATIO_CAP = 1.75;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, 1, 0.001, 1000);
  camera.position.set(0, 0, 1.3);

  const bg = createBackground();
  scene.add(bg.mesh);

  function resize() {
    const rect = heroSection.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    bg.setResolution(w, h);
  }
  resize();
  window.addEventListener('resize', resize);

  // Mark as canvas-on so the CSS orb fades out (one-shot).
  heroSection.classList.add('hero--canvas-on');

  // Visibility / intersection gating.
  let inView   = true;
  let visible  = !document.hidden;
  let raf      = null;
  let lastTime = performance.now();

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => { inView = e.intersectionRatio > 0.05; });
      kick();
    },
    { threshold: [0, 0.05, 0.5, 1] }
  );
  io.observe(heroSection);

  document.addEventListener('visibilitychange', () => {
    visible = !document.hidden;
    kick();
  });

  function tick(now) {
    raf = null;
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    bg.update(dt);
    renderer.render(scene, camera);

    if (inView && visible) {
      raf = requestAnimationFrame(tick);
    }
  }

  function kick() {
    if (raf) return;
    if (!inView || !visible) return;
    lastTime = performance.now();
    raf = requestAnimationFrame(tick);
  }

  // Render the first frame and let kick()/IntersectionObserver own
  // subsequent scheduling. If the hero starts offscreen we still get
  // one paint so the surface is never blank.
  tick(performance.now());
})();
