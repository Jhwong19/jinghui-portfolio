import * as THREE from 'three';

const vertexShader = /* glsl */ `
  varying vec3 vReflect;
  varying vec3 vRefract[3];
  varying float vReflectionFactor;

  uniform float mRefractionRatio;
  uniform float mFresnelBias;
  uniform float mFresnelScale;
  uniform float mFresnelPower;

  void main() {
    vec4 mvPosition    = modelViewMatrix * vec4(position, 1.0);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);

    vec3 worldNormal = normalize(mat3(modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz) * normal);
    vec3 I = worldPosition.xyz - cameraPosition;

    vReflect    = reflect(I, worldNormal);
    vRefract[0] = refract(normalize(I), worldNormal, mRefractionRatio);
    vRefract[1] = refract(normalize(I), worldNormal, mRefractionRatio * 0.99);
    vRefract[2] = refract(normalize(I), worldNormal, mRefractionRatio * 0.98);
    vReflectionFactor = mFresnelBias + mFresnelScale *
      pow(1.0 + dot(normalize(I), worldNormal), mFresnelPower);

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform samplerCube tCube;
  varying vec3 vReflect;
  varying vec3 vRefract[3];
  varying float vReflectionFactor;

  void main() {
    vec4 reflectedColor = textureCube(tCube, vec3(-vReflect.x, vReflect.yz));
    vec4 refractedColor = vec4(1.0);
    refractedColor.r = textureCube(tCube, vec3(vRefract[0].x, vRefract[0].yz)).r;
    refractedColor.g = textureCube(tCube, vec3(vRefract[1].x, vRefract[1].yz)).g;
    refractedColor.b = textureCube(tCube, vec3(vRefract[2].x, vRefract[2].yz)).b;
    gl_FragColor = mix(refractedColor, reflectedColor, clamp(vReflectionFactor, 0.0, 1.0));
  }
`;

export function createLens() {
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
    format: THREE.RGBAFormat,
    generateMipmaps: true,
    minFilter: THREE.LinearMipmapLinearFilter,
  });
  const cubeCamera = new THREE.CubeCamera(0.1, 10, cubeRenderTarget);

  const geometry = new THREE.SphereGeometry(0.4, 32, 32);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      tCube: { value: cubeRenderTarget.texture },
      mRefractionRatio: { value: 1.02 },
      mFresnelBias:     { value: 0.1 },
      mFresnelScale:    { value: 4.0 },
      mFresnelPower:    { value: 2.0 },
    },
    vertexShader,
    fragmentShader,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.add(cubeCamera);

  return {
    mesh,
    cubeCamera,
    /**
     * Re-render the surrounding scene into the cube target so the lens
     * has fresh pixels to refract. Hide the lens before the capture so
     * it doesn't see itself.
     */
    refresh(renderer, scene) {
      mesh.visible = false;
      cubeCamera.update(renderer, scene);
      mesh.visible = true;
    },
  };
}
