"use client";
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { env, palette } from "./env";

const waves = /* glsl */ `
  uniform float uTime;

  void addWave(inout vec3 acc, vec2 p, vec2 d, float a, float f, float s, float t) {
    float ph = dot(d, p) * f + t * s;
    acc.x += a * sin(ph);
    float c = a * f * cos(ph);
    acc.y += c * d.x;
    acc.z += c * d.y;
  }

  // x = height, yz = d(height)/d(x,z)
  vec3 swell(vec2 p, float t) {
    vec3 acc = vec3(0.0);
    addWave(acc, p, normalize(vec2(1.0, 0.3)), 0.22, 0.45, 0.9, t);
    addWave(acc, p, normalize(vec2(-0.4, 1.0)), 0.14, 0.8, 1.2, t);
    addWave(acc, p, normalize(vec2(0.7, -0.6)), 0.07, 1.6, 1.7, t);
    addWave(acc, p, normalize(vec2(-0.9, -0.2)), 0.035, 2.7, 2.3, t);
    return acc;
  }

  vec3 ripples(vec2 p, float t) {
    vec3 acc = vec3(0.0);
    addWave(acc, p, normalize(vec2(0.3, 1.0)), 0.012, 5.3, 3.1, t);
    addWave(acc, p, normalize(vec2(-1.0, 0.5)), 0.008, 8.7, 4.2, t);
    addWave(acc, p, normalize(vec2(0.8, 0.8)), 0.005, 13.0, 5.5, t);
    addWave(acc, p, normalize(vec2(-0.6, -1.0)), 0.003, 21.0, 6.8, t);
    return acc;
  }
`;

const vertexShader = /* glsl */ `
  ${waves}
  varying vec3 vWorld;
  varying float vH;

  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vec3 w = swell(wp.xz, uTime);
    wp.y += w.x;
    vH = w.x;
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const fragmentShader = /* glsl */ `
  ${waves}
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform vec3 uDeep;
  uniform vec3 uShallow;
  uniform vec3 uSky;
  uniform vec3 uUnder;
  uniform vec3 uMoonDir;
  uniform vec3 uMoonColor;
  varying vec3 vWorld;
  varying float vH;

  void main() {
    vec3 g = swell(vWorld.xz, uTime) + ripples(vWorld.xz, uTime);
    vec3 n = normalize(vec3(-g.y, 1.0, -g.z));
    vec3 toCam = cameraPosition - vWorld;
    float dist = length(toCam);
    vec3 v = toCam / dist;
    vec3 col;
    vec3 fogColor = uFogColor;

    if (gl_FrontFacing) {
      vec3 horizonDir = normalize(vec3(-v.x, 0.0, -v.z));
      float mh = max(dot(horizonDir, uMoonDir), 0.0);
      fogColor += uMoonColor * (pow(mh, 140.0) * 0.45 + pow(mh, 14.0) * 0.12);

      float ndv = max(dot(n, v), 0.0);
      float fresnel = 0.02 + 0.98 * pow(1.0 - ndv, 5.0);
      vec3 r = reflect(-v, n);
      vec3 sky = mix(uSky * 1.1, uSky * 0.3, smoothstep(0.0, 0.5, r.y));
      float m = max(dot(r, uMoonDir), 0.0);
      sky += uMoonColor * (pow(m, 700.0) * 7.0 + pow(m, 70.0) * 0.6 + pow(m, 9.0) * 0.07);

      float crest = clamp(vH * 1.4 + 0.35, 0.0, 1.0);
      vec3 body = mix(uDeep, uShallow, crest * 0.6);
      // Troughs and slopes facing away from the moon sit in shadow.
      float trough = smoothstep(0.2, -0.3, vH);
      float facing = clamp(dot(normalize(vec2(n.x, n.z) + 1e-4), normalize(uMoonDir.xz)) * 0.5 + 0.5, 0.0, 1.0);
      float shade = mix(0.45, 1.0, (1.0 - trough * 0.75) * mix(0.7, 1.0, facing));
      col = mix(body * shade, sky, fresnel * mix(0.6, 1.0, shade));
    } else {
      vec3 nb = -n;
      float ndv = max(dot(nb, v), 0.0);
      float window = smoothstep(0.5, 0.92, ndv);
      float shimmer = 0.5 + 0.5 * sin(vWorld.x * 2.1 + uTime * 1.3 + g.y * 6.0) * sin(vWorld.z * 1.7 - uTime * 1.1 + g.z * 6.0);
      col = mix(uFogColor * 0.85, uUnder * (0.75 + 0.45 * shimmer), window);
    }

    float fog = 1.0 - exp(-pow(uFogDensity * dist, 2.0));
    col = mix(col, fogColor, clamp(fog, 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function Water() {
  const mesh = useRef<THREE.Mesh>(null);
  const segments = env.quality === "high" ? 320 : 170;

  const geometry = useMemo(() => {
    const g = new THREE.PlaneGeometry(170, 170, segments, segments);
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0, -45);
    return g;
  }, [segments]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uFogColor: { value: new THREE.Color() },
          uFogDensity: { value: 0.03 },
          uDeep: { value: palette.waterDeep },
          uShallow: { value: palette.waterShallow },
          uSky: { value: palette.horizon },
          uUnder: { value: palette.underside },
          uMoonDir: { value: env.moonDir },
          uMoonColor: { value: palette.moon },
        },
      }),
    [],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(() => {
    if (!mesh.current) return;
    mesh.current.visible = env.camY > -28;
    const u = material.uniforms;
    u.uTime.value = env.time;
    u.uFogColor.value.copy(env.fogColor);
    u.uFogDensity.value = env.fogDensity;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} frustumCulled={false} />;
}
