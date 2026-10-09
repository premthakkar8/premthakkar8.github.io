"use client";
"use no memo";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { env, seeded, smoothstep } from "./env";

type Kind = "SNOW" | "BUBBLE" | "GLOW";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uCamY;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uRangeY;
  uniform float uFadeDist;
  attribute float aSeed;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec3 p = position;
    #ifdef BUBBLE
      p.y += uTime * (0.7 + aSeed * 0.9);
      p.x += sin(uTime * 2.0 + aSeed * 30.0) * 0.08;
    #else
      p.y -= uTime * (0.04 + aSeed * 0.07);
      p.x += sin(uTime * 0.3 + aSeed * 20.0) * 0.45;
      p.z += cos(uTime * 0.25 + aSeed * 15.0) * 0.45;
    #endif
    p.y = mod(p.y - uCamY + uRangeY, 2.0 * uRangeY) - uRangeY + uCamY;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float dist = max(-mv.z, 0.1);
    gl_PointSize = uSize * (0.45 + aSeed) * uPixelRatio * (10.0 / dist);

    vAlpha = smoothstep(-0.2, -1.4, p.y) * (1.0 - smoothstep(uFadeDist * 0.5, uFadeDist, dist));
    vSeed = aSeed;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uColor2;
  uniform float uOpacity;
  uniform float uTime;
  varying float vAlpha;
  varying float vSeed;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    #ifdef BUBBLE
      float ring = smoothstep(0.5, 0.42, r) * smoothstep(0.22, 0.44, r);
      float highlight = smoothstep(0.14, 0.0, length(c - vec2(-0.14, -0.14)));
      float a = ring * 0.75 + highlight * 0.9;
    #else
      float a = smoothstep(0.5, 0.0, r);
      a *= a;
    #endif
    #ifdef GLOW
      a *= 0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * (0.6 + vSeed * 1.6) + vSeed * 40.0), 3.0);
    #endif
    vec3 col = mix(uColor, uColor2, step(0.62, vSeed));
    gl_FragColor = vec4(col, a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }
`;

type FieldProps = {
  kind: Kind;
  count: number;
  seed: number;
  spread: [number, number, number, number];
  size: number;
  color: string;
  color2: string;
  fadeDist: number;
  opacity: () => number;
};

function ParticleField({ kind, count, seed, spread, size, color, color2, fadeDist, opacity }: FieldProps) {
  const points = useRef<THREE.Points>(null);
  const dpr = useThree((s) => s.viewport.dpr);
  const [halfX, rangeY, zNear, zFar] = spread;

  const geometry = useMemo(() => {
    const rand = seeded(seed);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() * 2 - 1) * halfX;
      positions[i * 3 + 1] = (rand() * 2 - 1) * rangeY;
      positions[i * 3 + 2] = zFar + rand() * (zNear - zFar);
      seeds[i] = rand();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return g;
  }, [count, seed, halfX, rangeY, zNear, zFar]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        defines: { [kind]: "" },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uCamY: { value: 0 },
          uSize: { value: size },
          uPixelRatio: { value: 1 },
          uRangeY: { value: rangeY },
          uFadeDist: { value: fadeDist },
          uColor: { value: new THREE.Color(color) },
          uColor2: { value: new THREE.Color(color2) },
          uOpacity: { value: 0 },
        },
      }),
    [kind, size, rangeY, fadeDist, color, color2],
  );

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  useFrame(() => {
    if (!points.current) return;
    const o = opacity();
    points.current.visible = o > 0.005;
    const u = material.uniforms;
    u.uTime.value = env.time;
    u.uCamY.value = env.camY;
    u.uOpacity.value = o;
    u.uPixelRatio.value = dpr;
  });

  return <points ref={points} geometry={geometry} material={material} frustumCulled={false} />;
}

export function MarineSnow() {
  return (
    <ParticleField
      kind="SNOW"
      count={env.quality === "high" ? 1600 : 700}
      seed={11}
      spread={[16, 12, 7, -24]}
      size={2.2}
      color="#c8f1ff"
      color2="#7dd3fc"
      fadeDist={30}
      opacity={() => env.under * 0.6}
    />
  );
}

export function Bubbles() {
  return (
    <ParticleField
      kind="BUBBLE"
      count={env.quality === "high" ? 140 : 70}
      seed={23}
      spread={[9, 9, 5, -12]}
      size={5.5}
      color="#d9f6ff"
      color2="#a5f3fc"
      fadeDist={20}
      opacity={() => env.under * (1 - smoothstep(-6, -20, env.camY)) * 0.85}
    />
  );
}

export function Bioluminescence() {
  return (
    <ParticleField
      kind="GLOW"
      count={env.quality === "high" ? 280 : 140}
      seed={37}
      spread={[15, 12, 6, -22]}
      size={4.2}
      color="#22d3ee"
      color2="#a78bfa"
      fadeDist={28}
      opacity={() => env.deep}
    />
  );
}
