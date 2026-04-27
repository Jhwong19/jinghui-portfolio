import * as THREE from 'three';

const vertexShader = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  varying vec3 vPosition;
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;
  uniform float time;
  uniform vec4  resolution;
  varying vec2  vUv;
  varying vec3  vPosition;

  // Cheap value noise — same as the reference, used for color drift
  float mod289(float x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x)   { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 perm(vec4 x)     { return mod289(((x * 34.0) + 1.0) * x); }

  float noise(vec3 p) {
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);
    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);
    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);
    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));
    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);
    return o4.y * d.y + o4.x * (1.0 - d.y);
  }

  void main() {
    // Palette tuned to monopo's olive / amber / black chrome look.
    vec3 darkBase  = vec3(0.04, 0.05, 0.04);   // near-black background
    vec3 olive     = vec3(120.0/255.0, 130.0/255.0,  85.0/255.0);
    vec3 amber     = vec3(224.0/255.0, 148.0/255.0,  66.0/255.0);

    // Two-octave smooth noise drives a soft chrome-like color blend.
    float n1 = noise(vPosition * 1.4 + time * 0.4);
    float n2 = noise(vPosition * 3.2 - time * 0.25);
    float blend = smoothstep(0.25, 0.85, 0.6 * n1 + 0.4 * n2);

    vec3 metal = mix(darkBase, mix(olive, amber, blend), blend);

    // Add a subtle highlight that lives in the upper-right of the
    // sphere's surface so the visible portion looks "lit" from above
    // and to the right (matches the monopo screenshot composition).
    float ru = vPosition.x * 0.6 + vPosition.y * 0.6;
    float highlight = smoothstep(0.6, 1.4, ru);
    metal = mix(metal, amber * 1.1, highlight * 0.45);

    gl_FragColor = vec4(metal, 1.0);
  }
`;

export function createBackground() {
  // Larger inner-facing sphere so the camera samples a big curved
  // surface instead of a small object floating in space.
  const geometry = new THREE.SphereGeometry(2.5, 64, 64);
  const material = new THREE.ShaderMaterial({
    side: THREE.BackSide, // we look at the inner wall
    uniforms: {
      time:       { value: 0 },
      resolution: { value: new THREE.Vector4() },
    },
    vertexShader,
    fragmentShader,
  });
  const mesh = new THREE.Mesh(geometry, material);

  return {
    mesh,
    update(deltaSeconds) {
      material.uniforms.time.value += deltaSeconds;
      // Slow rotation so the highlight drifts across the visible area.
      mesh.rotation.y += deltaSeconds * 0.04;
      mesh.rotation.x += deltaSeconds * 0.02;
    },
    setResolution(w, h) {
      material.uniforms.resolution.value.set(w, h, 1, 1);
    },
  };
}
