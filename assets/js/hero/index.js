import * as THREE from 'three';
import { createBackground } from './background.js';
import { createLens }       from './lens.js';
import { createPointer }    from './pointer.js';

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

  const prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const PIXEL_RATIO_CAP = 1.75;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, PIXEL_RATIO_CAP));

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(70, 1, 0.001, 1000);
  camera.position.set(0, 0, 1.3);

  const bg   = createBackground();
  const lens = createLens();
  scene.add(bg.mesh);
  scene.add(lens.mesh);
  // Stage the lens slightly forward of the background so refraction
  // samples from a meaningful distance.
  lens.mesh.position.set(0, 0, 0.6);

  const pointer = createPointer(heroSection, camera, lens.mesh);

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
    pointer.update();
    lens.refresh(renderer, scene);
    renderer.render(scene, camera);

    if (!prefersReduced && inView && visible) {
      raf = requestAnimationFrame(tick);
    }
  }

  function kick() {
    if (raf) return;
    if (!inView || !visible) return;
    lastTime = performance.now();
    raf = requestAnimationFrame(tick);
  }

  // Always render at least one frame so the lens has content even if
  // reduced-motion is on or the hero is offscreen on load.
  tick(performance.now());
})();
