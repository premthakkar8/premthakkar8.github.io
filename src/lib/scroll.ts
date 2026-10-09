export type Zone = { name: string; from: number };

export const ZONES: Zone[] = [
  { name: "Surface", from: 0 },
  { name: "Sunlight zone", from: 1 },
  { name: "Twilight zone", from: 200 },
  { name: "Midnight zone", from: 1000 },
  { name: "The abyss", from: 4000 },
];

export const MAX_DEPTH = 5200;

export const scrollState = {
  y: 0,
  vh: 1,
  max: 1,
  depth: 0,
  px: 0,
  py: 0,
};

type Anchor = { top: number; depth: number };

export function zoneFor(depth: number) {
  let zone = ZONES[0].name;
  for (const z of ZONES) if (depth >= z.from) zone = z.name;
  return zone;
}

export function startTracking() {
  let anchors: Anchor[] = [];

  const measure = () => {
    scrollState.vh = window.innerHeight;
    scrollState.max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-depth]")).map((el) => ({
      top: Math.max(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.25),
      depth: Number(el.dataset.depth),
    }));
    anchors.push({ top: scrollState.max, depth: MAX_DEPTH });
  };

  const update = () => {
    scrollState.y = window.scrollY;
    const probe = window.scrollY;
    let depth = 0;
    for (let i = 0; i < anchors.length - 1; i++) {
      const a = anchors[i];
      const b = anchors[i + 1];
      if (probe >= a.top) {
        const t = Math.min(1, (probe - a.top) / Math.max(1, b.top - a.top));
        depth = a.depth + (b.depth - a.depth) * t;
      }
    }
    scrollState.depth = depth;
  };

  const onPointer = (e: PointerEvent) => {
    scrollState.px = (e.clientX / window.innerWidth) * 2 - 1;
    scrollState.py = -((e.clientY / window.innerHeight) * 2 - 1);
  };

  const onResize = () => {
    measure();
    update();
  };

  measure();
  update();
  const observer = new ResizeObserver(onResize);
  observer.observe(document.body);
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", onResize);
  window.addEventListener("pointermove", onPointer, { passive: true });

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", update);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("pointermove", onPointer);
  };
}
