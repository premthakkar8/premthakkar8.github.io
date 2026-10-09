import * as THREE from "three";

export type Quality = "high" | "low";

export function smoothstep(e0: number, e1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const palette = {
  zenith: new THREE.Color("#01040f"),
  horizon: new THREE.Color("#0a2242"),
  moon: new THREE.Color("#d6f1ff"),
  waterDeep: new THREE.Color("#010a1c"),
  waterShallow: new THREE.Color("#0a2c5a"),
  underside: new THREE.Color("#6aa8dc"),
  ray: new THREE.Color("#8fc8f0"),
};

const depthStops: [number, THREE.Color][] = [
  [0, new THREE.Color("#0b3a6b")],
  [-8, new THREE.Color("#082c57")],
  [-20, new THREE.Color("#051f42")],
  [-36, new THREE.Color("#03132b")],
  [-62, new THREE.Color("#010711")],
];

function underwaterColor(y: number, out: THREE.Color) {
  if (y >= depthStops[0][0]) return out.copy(depthStops[0][1]);
  for (let i = 0; i < depthStops.length - 1; i++) {
    const [y0, c0] = depthStops[i];
    const [y1, c1] = depthStops[i + 1];
    if (y <= y0 && y >= y1) return out.copy(c0).lerp(c1, (y0 - y) / (y0 - y1));
  }
  return out.copy(depthStops[depthStops.length - 1][1]);
}

function detectQuality(): Quality {
  if (typeof window === "undefined") return "high";
  const small = window.matchMedia("(max-width: 768px)").matches;
  const weak = (navigator.hardwareConcurrency ?? 8) <= 4;
  return small || weak ? "low" : "high";
}

function detectReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export const env = {
  quality: detectQuality(),
  reducedMotion: detectReducedMotion(),
  time: 0,
  camY: 3.2,
  under: 0,
  deep: 0,
  rays: 0,
  fogColor: palette.horizon.clone(),
  fogDensity: 0.028,
  moonDir: new THREE.Vector3(0.4, 0.15, -1).normalize(),
  aspect: 1,
};

const tmp = new THREE.Color();

export function cameraHeight(scrollY: number, vh: number, max: number) {
  const dive = vh * 0.9;
  if (scrollY < dive) {
    const t = smoothstep(0, 1, scrollY / dive);
    return lerp(3.2, -3.6, t);
  }
  const t = Math.min(1, (scrollY - dive) / Math.max(1, max - dive));
  return -3.6 - t * 58;
}

export function cameraPitch(camY: number) {
  if (camY >= 0) return -0.05;
  return -0.05 + smoothstep(0, -2.5, camY) * 0.3 - smoothstep(-6, -24, camY) * 0.22;
}

export function updateEnvironment(camY: number, aspect: number) {
  env.camY = camY;
  env.aspect = aspect;
  env.under = smoothstep(0.25, -0.25, camY);
  env.deep = smoothstep(-14, -32, camY);
  env.rays = env.under * (1 - smoothstep(-5, -24, camY));

  underwaterColor(camY, tmp);
  env.fogColor.copy(palette.horizon).lerp(tmp, env.under);
  env.fogDensity = lerp(0.028, lerp(0.05, 0.078, smoothstep(0, -40, camY)), env.under);

  const halfH = Math.atan(Math.tan(THREE.MathUtils.degToRad(27.5)) * aspect);
  const azimuth = Math.min(0.42, halfH * 0.55);
  env.moonDir.set(Math.sin(azimuth), 0.15, -Math.cos(azimuth)).normalize();
}
