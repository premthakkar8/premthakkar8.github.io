import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";

type Profile = [along: number, radius: number][];

function body(profile: Profile, height: number, width: number, segments = 18) {
  const g = new THREE.LatheGeometry(
    profile.map(([along, radius]) => new THREE.Vector2(radius, along)),
    segments,
  );
  g.rotateZ(-Math.PI / 2);
  g.scale(1, height, width);
  return g;
}

function fin(draw: (s: THREE.Shape) => void) {
  const shape = new THREE.Shape();
  draw(shape);
  return new THREE.ShapeGeometry(shape, 6);
}

function pair(geometry: THREE.BufferGeometry, x: number, y: number, z: number) {
  const right = geometry.clone().translate(x, y, z);
  const left = geometry.clone().scale(1, 1, -1).translate(x, y, -z);
  geometry.dispose();
  return [right, left];
}

export function dolphinGeometry() {
  const parts = [
    body(
      [
        [-1.2, 0],
        [-1.12, 0.025],
        [-1.0, 0.04],
        [-0.75, 0.07],
        [-0.45, 0.13],
        [-0.15, 0.19],
        [0.15, 0.23],
        [0.45, 0.24],
        [0.7, 0.2],
        [0.85, 0.15],
        [0.95, 0.07],
        [1.02, 0.05],
        [1.12, 0.035],
        [1.2, 0],
      ],
      1,
      0.85,
    ),
    fin((s) => {
      s.moveTo(0.12, 0);
      s.quadraticCurveTo(0.02, 0.26, -0.36, 0.34);
      s.quadraticCurveTo(-0.2, 0.14, -0.3, 0);
      s.lineTo(0.12, 0);
    }).translate(0, 0.2, 0),
    fin((s) => {
      s.moveTo(0.02, 0);
      s.quadraticCurveTo(-0.1, 0.2, -0.3, 0.38);
      s.quadraticCurveTo(-0.2, 0.12, -0.25, 0);
      s.quadraticCurveTo(-0.2, -0.12, -0.3, -0.38);
      s.quadraticCurveTo(-0.1, -0.2, 0.02, 0);
    })
      .rotateX(Math.PI / 2)
      .translate(-1.1, 0, 0),
    ...pair(
      fin((s) => {
        s.moveTo(0, 0);
        s.quadraticCurveTo(-0.06, 0.08, -0.24, 0.22);
        s.quadraticCurveTo(-0.14, 0.06, -0.14, 0);
        s.lineTo(0, 0);
      })
        .rotateX(Math.PI / 2)
        .rotateX(0.55),
      0.55,
      -0.13,
      0.15,
    ),
  ];
  const merged = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return merged;
}

export function sharkGeometry() {
  const parts = [
    body(
      [
        [-1.0, 0],
        [-0.92, 0.03],
        [-0.75, 0.055],
        [-0.45, 0.12],
        [-0.1, 0.175],
        [0.2, 0.185],
        [0.5, 0.155],
        [0.75, 0.105],
        [0.9, 0.06],
        [0.98, 0.02],
        [1.0, 0],
      ],
      1,
      0.85,
    ),
    fin((s) => {
      s.moveTo(0.22, 0);
      s.lineTo(-0.06, 0.42);
      s.quadraticCurveTo(-0.08, 0.2, -0.2, 0);
      s.lineTo(0.22, 0);
    }).translate(0, 0.15, 0),
    fin((s) => {
      s.moveTo(-0.55, 0);
      s.lineTo(-0.66, 0.1);
      s.lineTo(-0.72, 0);
      s.lineTo(-0.55, 0);
    }).translate(0, 0.06, 0),
    fin((s) => {
      s.moveTo(0, 0.02);
      s.lineTo(-0.34, 0.46);
      s.quadraticCurveTo(-0.3, 0.16, -0.2, 0);
      s.quadraticCurveTo(-0.27, -0.12, -0.24, -0.3);
      s.lineTo(0, -0.02);
      s.lineTo(0, 0.02);
    }).translate(-0.9, 0, 0),
    ...pair(
      fin((s) => {
        s.moveTo(0, 0);
        s.lineTo(-0.34, 0.36);
        s.lineTo(-0.16, 0);
        s.lineTo(0, 0);
      })
        .rotateX(Math.PI / 2)
        .rotateX(0.4),
      0.3,
      -0.09,
      0.13,
    ),
  ];
  const merged = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return merged;
}

export const creatureVertex = /* glsl */ `
  uniform float uTime;
  uniform float uSwim;
  uniform float uAmp;
  varying vec3 vN;
  varying vec3 vWorld;

  void main() {
    vec3 p = position;
    float tail = smoothstep(0.35, -1.15, p.x);
    float bend = sin(uTime * uSwim - p.x * 3.2) * uAmp * tail * tail;
    #ifdef VERTICAL
      p.y += bend;
    #else
      p.z += bend;
      p.z -= sin(uTime * uSwim) * uAmp * 0.12 * (1.0 - tail);
    #endif
    vec4 wp = modelMatrix * vec4(p, 1.0);
    vWorld = wp.xyz;
    vN = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
