import * as THREE from 'three';

/**
 * Tracks pointer position over `surface`, projects onto the camera's
 * world plane at the lens's current Z, and lerps the lens mesh toward
 * that target. On pointer leave, recenters to (0, 0).
 */
export function createPointer(surface, camera, lensMesh) {
  const target  = new THREE.Vector3(0, 0, lensMesh.position.z);
  const ndc     = new THREE.Vector2(0, 0);
  const ray     = new THREE.Raycaster();
  const plane   = new THREE.Plane(new THREE.Vector3(0, 0, 1), -lensMesh.position.z);
  const hit     = new THREE.Vector3();
  const lerpFactor = 0.08;

  function setFromEvent(clientX, clientY) {
    const rect = surface.getBoundingClientRect();
    ndc.x =  ((clientX - rect.left) / rect.width)  * 2 - 1;
    ndc.y = -((clientY - rect.top)  / rect.height) * 2 + 1;
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) {
      target.copy(hit);
    }
  }

  function onMove(e) {
    setFromEvent(e.clientX, e.clientY);
  }
  function onTouch(e) {
    if (e.touches.length === 0) return;
    setFromEvent(e.touches[0].clientX, e.touches[0].clientY);
  }
  function onLeave() {
    target.set(0, 0, lensMesh.position.z);
  }

  surface.addEventListener('mousemove',  onMove,  { passive: true });
  surface.addEventListener('touchmove',  onTouch, { passive: true });
  surface.addEventListener('mouseleave', onLeave, { passive: true });
  surface.addEventListener('touchend',   onLeave, { passive: true });

  return {
    update() {
      lensMesh.position.lerp(target, lerpFactor);
    },
    dispose() {
      surface.removeEventListener('mousemove',  onMove);
      surface.removeEventListener('touchmove',  onTouch);
      surface.removeEventListener('mouseleave', onLeave);
      surface.removeEventListener('touchend',   onLeave);
    },
  };
}
