"use client";
"use no memo";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { env, palette, seeded } from "./env";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uSeed;
  varying vec2 vUv;

  void main() {
    float edge = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
    float fall = pow(vUv.y, 1.8);
    float flicker = 0.55 + 0.45 * sin(uTime * 0.55 + uSeed * 12.0 + vUv.y * 2.5);
    float a = edge * edge * fall * flicker * uIntensity * 0.16;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

const RAY_COUNT = 9;
const RAY_HEIGHT = 30;

export function LightRays() {
  const group = useRef<THREE.Group>(null);

  const rays = useMemo(() => {
    const rand = seeded(7);
    const geometry = new THREE.PlaneGeometry(1, 1);
    return Array.from({ length: RAY_COUNT }, (_, i) => {
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: palette.ray },
          uTime: { value: 0 },
          uIntensity: { value: 0 },
          uSeed: { value: rand() },
        },
      });
      const mesh = new THREE.Mesh(geometry, material);
      const width = 1.2 + rand() * 3.2;
      mesh.scale.set(width, RAY_HEIGHT, 1);
      mesh.position.set((i / (RAY_COUNT - 1) - 0.5) * 30 + (rand() - 0.5) * 3, -RAY_HEIGHT / 2 - 0.1, -6 - rand() * 22);
      mesh.rotation.z = (rand() - 0.5) * 0.35 + 0.12;
      return mesh;
    });
  }, []);

  useEffect(
    () => () => {
      rays[0]?.geometry.dispose();
      rays.forEach((r) => (r.material as THREE.ShaderMaterial).dispose());
    },
    [rays],
  );

  useFrame(() => {
    if (!group.current) return;
    group.current.visible = env.rays > 0.01;
    for (const ray of rays) {
      const u = (ray.material as THREE.ShaderMaterial).uniforms;
      u.uTime.value = env.time;
      u.uIntensity.value = env.rays;
    }
  });

  return (
    <group ref={group}>
      {rays.map((ray, i) => (
        <primitive key={i} object={ray} />
      ))}
    </group>
  );
}
