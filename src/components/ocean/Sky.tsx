"use client";
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { env, palette } from "./env";

const vertexShader = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uZenith;
  uniform vec3 uHorizon;
  uniform vec3 uMoonColor;
  uniform vec3 uMoonDir;
  uniform float uTime;
  varying vec3 vDir;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(vec3(i, 1.0));
    float b = hash(vec3(i + vec2(1.0, 0.0), 1.0));
    float c = hash(vec3(i + vec2(0.0, 1.0), 1.0));
    float e = hash(vec3(i + vec2(1.0, 1.0), 1.0));
    return mix(mix(a, b, f.x), mix(c, e, f.x), f.y);
  }

  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = mix(uHorizon, uZenith, pow(smoothstep(-0.02, 0.6, h), 0.75));

    float m = max(dot(d, uMoonDir), 0.0);
    float disc = smoothstep(0.99955, 0.99972, m);
    vec3 right = normalize(cross(uMoonDir, vec3(0.0, 1.0, 0.0)));
    vec3 up = cross(right, uMoonDir);
    vec2 uv = vec2(dot(d, right), dot(d, up)) / 0.03;
    float maria = noise(uv * 2.2 + 3.0) * 0.6 + noise(uv * 5.0 + 9.0) * 0.4;
    float limb = sqrt(max(0.0, 1.0 - dot(uv, uv)));
    float moonShade = mix(0.72, 1.0, smoothstep(0.35, 0.7, maria)) * (0.8 + 0.2 * limb);
    col += uMoonColor * (disc * 1.05 * moonShade + pow(m, 140.0) * 0.45 + pow(m, 14.0) * 0.12);

    vec3 grid = d * 240.0;
    vec3 cell = floor(grid);
    float s = hash(cell);
    float core = smoothstep(0.5, 0.0, length(fract(grid) - 0.5));
    float star = step(0.9972, s) * core * smoothstep(0.05, 0.35, h) * (1.0 - disc);
    star *= 0.55 + 0.45 * sin(uTime * (0.8 + s * 2.5) + s * 60.0);
    col += vec3(0.75, 0.88, 1.0) * star;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export function Sky() {
  const mesh = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.SphereGeometry(300, 48, 24), []);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: {
          uZenith: { value: palette.zenith },
          uHorizon: { value: palette.horizon },
          uMoonColor: { value: palette.moon },
          uMoonDir: { value: env.moonDir },
          uTime: { value: 0 },
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

  useFrame(({ camera }) => {
    if (!mesh.current) return;
    mesh.current.visible = env.under < 0.98;
    mesh.current.position.copy(camera.position);
    material.uniforms.uTime.value = env.time;
  });

  return <mesh ref={mesh} geometry={geometry} material={material} renderOrder={-1} frustumCulled={false} />;
}
