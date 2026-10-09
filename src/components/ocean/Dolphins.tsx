"use client";
"use no memo";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { creatureVertex, dolphinGeometry } from "./creatures";
import { env, palette, seeded } from "./env";

const PERIOD = 7;
const JUMP = 1.75;
const SPAN = 6.2;
const START_DEPTH = 0.5;
const SPLASH_LIFE = 1.2;
const RIPPLE_LIFE = 1.8;
const DROPS = 44;
const CAMERA_Z = 8;

type PodMember = { phase: number; dx: number; z: number; scale: number; height: number };

const POD: PodMember[] = [
  { phase: 0, dx: -1.6, z: -10, scale: 1.35, height: 1.9 },
  { phase: 0.5, dx: 0.4, z: -12.5, scale: 1.5, height: 2.1 },
  { phase: 1.05, dx: 2.1, z: -11, scale: 1.25, height: 1.75 },
];

const dolphinFragment = /* glsl */ `
  uniform vec3 uMoonDir;
  uniform vec3 uMoonColor;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  varying vec3 vN;
  varying vec3 vWorld;

  void main() {
    vec3 n = normalize(vN);
    if (!gl_FrontFacing) n = -n;
    vec3 toCam = cameraPosition - vWorld;
    float dist = length(toCam);
    vec3 v = toCam / dist;
    float ndv = abs(dot(n, v));

    vec3 base = mix(vec3(0.010, 0.026, 0.045), vec3(0.03, 0.07, 0.1), smoothstep(-0.3, 0.6, n.y));
    float rim = pow(1.0 - ndv, 3.0) * (0.35 + 0.65 * max(dot(n, uMoonDir), 0.0));
    vec3 r = reflect(-v, n);
    float spec = pow(max(dot(r, uMoonDir), 0.0), 48.0);
    vec3 col = base + uMoonColor * (rim * 0.6 + spec * 0.7);

    vec3 horizonDir = normalize(vec3(-v.x, 0.0, -v.z));
    float mh = max(dot(horizonDir, uMoonDir), 0.0);
    vec3 fogColor = uFogColor + uMoonColor * (pow(mh, 140.0) * 0.45 + pow(mh, 14.0) * 0.12);
    float fog = 1.0 - exp(-pow(uFogDensity * dist, 2.0));
    col = mix(col, fogColor, clamp(fog, 0.0, 1.0) * 0.85);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

const dropVertex = /* glsl */ `
  uniform vec2 uAge;
  uniform vec3 uExit;
  uniform vec3 uEntry;
  uniform float uPixelRatio;
  attribute vec3 aVel;
  attribute float aGroup;
  varying float vAlpha;

  void main() {
    float age = aGroup < 0.5 ? uAge.x : uAge.y;
    vec3 origin = aGroup < 0.5 ? uExit : uEntry;
    vec3 p = origin + aVel * age + vec3(0.0, -4.9, 0.0) * age * age;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float alive = step(0.0, age) * step(age, ${SPLASH_LIFE.toFixed(2)}) * step(-0.05, p.y);
    vAlpha = alive * (1.0 - age / ${SPLASH_LIFE.toFixed(2)});
    gl_PointSize = alive * (2.2 + aVel.y * 0.6) * uPixelRatio * (22.0 / max(-mv.z, 0.1));
  }
`;

const dropFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float a = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColor, a * vAlpha * 0.9);
    #include <colorspace_fragment>
  }
`;

function createDrops(seed: number) {
  const rand = seeded(seed);
  const vel = new Float32Array(DROPS * 2 * 3);
  const group = new Float32Array(DROPS * 2);
  for (let i = 0; i < DROPS * 2; i++) {
    const angle = rand() * Math.PI * 2;
    const spread = 0.25 + rand() * 0.9;
    vel[i * 3] = Math.cos(angle) * spread;
    vel[i * 3 + 1] = 1.4 + rand() * 2.2;
    vel[i * 3 + 2] = Math.sin(angle) * spread;
    group[i] = i < DROPS ? 0 : 1;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(DROPS * 2 * 3), 3));
  g.setAttribute("aVel", new THREE.BufferAttribute(vel, 3));
  g.setAttribute("aGroup", new THREE.BufferAttribute(group, 1));
  return g;
}

function hash(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

function Dolphin({ cfg, index, geometry }: { cfg: PodMember; index: number; geometry: THREE.BufferGeometry }) {
  const mesh = useRef<THREE.Mesh>(null);
  const drops = useRef<THREE.Points>(null);
  const exitRing = useRef<THREE.Mesh>(null);
  const entryRing = useRef<THREE.Mesh>(null);
  const dpr = useThree((s) => s.viewport.dpr);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: creatureVertex,
        fragmentShader: dolphinFragment,
        defines: { VERTICAL: "" },
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uSwim: { value: 9 },
          uAmp: { value: 0.07 },
          uMoonDir: { value: env.moonDir },
          uMoonColor: { value: palette.moon },
          uFogColor: { value: new THREE.Color() },
          uFogDensity: { value: 0.03 },
        },
      }),
    [],
  );

  const dropGeometry = useMemo(() => createDrops(101 + index * 17), [index]);
  const dropMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: dropVertex,
        fragmentShader: dropFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uAge: { value: new THREE.Vector2(-1, -1) },
          uExit: { value: new THREE.Vector3() },
          uEntry: { value: new THREE.Vector3() },
          uPixelRatio: { value: 1 },
          uColor: { value: new THREE.Color("#d6f1ff") },
        },
      }),
    [],
  );

  const ringGeometry = useMemo(() => new THREE.RingGeometry(0.86, 1, 48).rotateX(-Math.PI / 2), []);
  const ringMaterials = useMemo(
    () =>
      [0, 1].map(
        () =>
          new THREE.MeshBasicMaterial({
            color: "#bfe9f7",
            transparent: true,
            opacity: 0,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          }),
      ),
    [],
  );

  useEffect(
    () => () => {
      material.dispose();
      dropGeometry.dispose();
      dropMaterial.dispose();
      ringGeometry.dispose();
      ringMaterials.forEach((m) => m.dispose());
    },
    [material, dropGeometry, dropMaterial, ringGeometry, ringMaterials],
  );

  useFrame(() => {
    const body = mesh.current;
    if (!body || !drops.current || !exitRing.current || !entryRing.current) return;

    const aboveWater = env.camY > 0.05;
    const t = env.time + cfg.phase;
    const cycle = Math.floor(t / PERIOD);
    const tau = t - cycle * PERIOD;
    const variation = hash(cycle * 13.1 + index * 7.7);

    const height = cfg.height * (0.85 + variation * 0.3);
    const distance = CAMERA_Z - cfg.z;
    const moonX = (env.moonDir.x / -env.moonDir.z) * distance;
    const x0 = moonX + cfg.dx + (variation - 0.5) * 2.4 - SPAN / 2;

    const s = tau / JUMP;
    const airborne = s >= 0 && s <= 1;
    body.visible = aboveWater && airborne;
    if (body.visible) {
      const vx = SPAN / JUMP;
      const vy = (4 * height * (1 - 2 * s)) / JUMP;
      body.position.set(x0 + s * SPAN, 4 * height * s * (1 - s) - START_DEPTH, cfg.z);
      body.rotation.set(Math.sin(s * Math.PI) * 0.12, 0, Math.atan2(vy, vx));
      const u = material.uniforms;
      u.uTime.value = env.time;
      u.uFogColor.value.copy(env.fogColor);
      u.uFogDensity.value = env.fogDensity;
    }

    const s1 = (1 - Math.sqrt(1 - START_DEPTH / height)) / 2;
    const s2 = 1 - s1;
    const exitAge = tau - s1 * JUMP;
    const entryAge = tau - s2 * JUMP;

    const du = dropMaterial.uniforms;
    du.uAge.value.set(exitAge, entryAge);
    du.uExit.value.set(x0 + s1 * SPAN, 0, cfg.z);
    du.uEntry.value.set(x0 + s2 * SPAN, 0, cfg.z);
    du.uPixelRatio.value = dpr;
    drops.current.visible = aboveWater;

    const rings: [THREE.Mesh, number, number][] = [
      [exitRing.current, exitAge, x0 + s1 * SPAN],
      [entryRing.current, entryAge, x0 + s2 * SPAN],
    ];
    for (const [ring, age, x] of rings) {
      const alive = aboveWater && age >= 0 && age <= RIPPLE_LIFE;
      ring.visible = alive;
      if (!alive) continue;
      const k = age / RIPPLE_LIFE;
      ring.position.set(x, 0.05, cfg.z);
      ring.scale.setScalar(0.25 + k * 1.6);
      (ring.material as THREE.MeshBasicMaterial).opacity = (1 - k) * (1 - k) * 0.35;
    }
  });

  return (
    <>
      <mesh ref={mesh} geometry={geometry} material={material} scale={cfg.scale} frustumCulled={false} />
      <points ref={drops} geometry={dropGeometry} material={dropMaterial} frustumCulled={false} />
      <mesh ref={exitRing} geometry={ringGeometry} material={ringMaterials[0]} />
      <mesh ref={entryRing} geometry={ringGeometry} material={ringMaterials[1]} />
    </>
  );
}

export function Dolphins() {
  const geometry = useMemo(() => dolphinGeometry(), []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const pod = env.quality === "high" ? POD : POD.slice(0, 2);
  return (
    <>
      {pod.map((cfg, i) => (
        <Dolphin key={i} cfg={cfg} index={i} geometry={geometry} />
      ))}
    </>
  );
}
