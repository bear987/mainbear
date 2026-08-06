"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Glowing wireframe globe with visible continent coastlines, land-mass dots,
 * pulsing trade-port hubs (Lagos emphasized) and glowing route arcs.
 *
 * Performance core: the draw loop PAUSES when the canvas is off-screen or the
 * tab is hidden, frames are capped at ~30fps, hub/halo glows are pre-rendered
 * once to offscreen sprites (no per-frame gradient allocation), and pixel
 * density is capped at 1.5x. Leans toward pointer/touch anywhere on screen.
 */

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stylized continent coastlines as [lat, lon] loops. */
const COASTS: [number, number][][] = [
  // Africa
  [[35, -6], [37, 3], [33, 11], [31, 20], [31, 32], [15, 39], [11, 44], [11, 51], [2, 46], [-6, 39], [-15, 40], [-26, 33], [-34, 26], [-35, 19], [-28, 15], [-17, 12], [-6, 12], [0, 9], [4, 7], [6, 3], [6, -2], [5, -8], [9, -14], [14, -17], [21, -17], [28, -12], [33, -7], [35, -6]],
  // Europe
  [[36, -9], [43, -9], [46, -2], [49, -5], [51, 2], [54, 9], [58, 11], [64, 11], [70, 22], [66, 38], [59, 24], [54, 14], [49, 2], [46, -2], [43, 3], [42, 10], [44, 14], [41, 19], [37, 22], [36, 15], [38, 10], [36, -6], [36, -9]],
  // Asia (with Arabia, India, SE Asia)
  [[36, 36], [41, 29], [45, 34], [47, 49], [45, 60], [52, 60], [60, 68], [68, 70], [73, 85], [77, 105], [73, 130], [70, 160], [64, 178], [60, 163], [54, 142], [46, 138], [40, 128], [35, 126], [31, 122], [24, 118], [22, 110], [16, 108], [9, 105], [1, 104], [6, 100], [10, 98], [16, 95], [22, 89], [16, 82], [8, 77], [15, 73], [21, 70], [24, 67], [25, 60], [27, 52], [24, 52], [22, 59], [16, 54], [13, 44], [16, 42], [26, 36], [31, 34], [36, 36]],
  // North America
  [[60, -165], [66, -162], [71, -156], [70, -140], [69, -125], [68, -110], [66, -85], [58, -92], [55, -82], [52, -79], [58, -64], [52, -56], [47, -53], [44, -66], [40, -74], [35, -76], [30, -81], [25, -80], [29, -90], [26, -97], [18, -95], [15, -92], [8, -77], [9, -84], [15, -97], [19, -105], [23, -110], [28, -115], [34, -120], [40, -124], [49, -125], [57, -135], [60, -150], [60, -165]],
  // South America
  [[11, -74], [9, -60], [5, -52], [-1, -48], [-8, -35], [-13, -38], [-23, -42], [-30, -50], [-35, -57], [-41, -63], [-47, -66], [-52, -69], [-54, -71], [-46, -74], [-37, -73], [-30, -71], [-18, -70], [-6, -81], [-1, -80], [4, -78], [8, -77], [11, -74]],
  // Australia
  [[-12, 131], [-12, 136], [-17, 140], [-11, 142], [-16, 146], [-25, 153], [-33, 152], [-38, 147], [-38, 141], [-35, 137], [-32, 133], [-34, 124], [-32, 116], [-26, 114], [-21, 114], [-18, 122], [-14, 127], [-12, 131]],
  // Greenland
  [[60, -45], [64, -40], [68, -25], [73, -22], [78, -20], [81, -30], [82, -45], [80, -60], [76, -68], [70, -55], [65, -53], [60, -45]],
];

const REGIONS = [
  { latC: 46, lonC: -100, latR: 20, lonR: 26, n: 110 },
  { latC: -18, lonC: -60, latR: 20, lonR: 11, n: 70 },
  { latC: 52, lonC: 15, latR: 9, lonR: 18, n: 50 },
  { latC: 3, lonC: 20, latR: 30, lonR: 18, n: 140 },
  { latC: 45, lonC: 95, latR: 22, lonR: 42, n: 180 },
  { latC: -25, lonC: 133, latR: 8, lonR: 13, n: 40 },
  { latC: 72, lonC: -42, latR: 5, lonR: 11, n: 16 },
];

const LAND: { lat: number; lon: number }[] = (() => {
  const rand = mulberry32(20240607);
  const pts: { lat: number; lon: number }[] = [];
  for (const r of REGIONS) {
    for (let i = 0; i < r.n; i++) {
      const rr = Math.sqrt(rand());
      const th = rand() * Math.PI * 2;
      pts.push({
        lat: r.latC + rr * Math.sin(th) * r.latR,
        lon: r.lonC + rr * Math.cos(th) * r.lonR,
      });
    }
  }
  return pts;
})();

// Major trade ports. Index 0 = Lagos (home port, drawn emphasized).
const HUBS: [number, number][] = [
  [6.5, 3.4], [51.9, 4.5], [31.2, 121.5], [1.3, 103.8], [40.7, -74], [25.2, 55.3],
  [-23.9, -46.3], [-29.9, 31.0], [33.7, -118.2], [19.0, 72.8], [53.5, 10.0], [-33.9, 151.2],
];
const ARCS: [number, number][] = [
  [0, 1], [0, 2], [2, 8], [3, 5], [4, 1], [5, 9], [6, 0], [7, 3], [10, 4], [11, 3], [0, 5],
];

export function GlobeBackdrop({
  className,
  opacity = 1,
}: {
  className?: string;
  opacity?: number;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let halo: HTMLCanvasElement | null = null;

    // Pre-rendered hub glow sprite (no per-frame gradient allocation).
    const sprite = document.createElement("canvas");
    sprite.width = 128;
    sprite.height = 128;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, "rgba(200,214,255,0.9)");
      g.addColorStop(0.35, "rgba(150,175,255,0.35)");
      g.addColorStop(1, "rgba(150,175,255,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, 128, 128);
    }

    const buildHalo = () => {
      const r = Math.min(w, h) * 0.44;
      halo = document.createElement("canvas");
      halo.width = Math.max(1, Math.round(w * dpr));
      halo.height = Math.max(1, Math.round(h * dpr));
      const hctx = halo.getContext("2d");
      if (!hctx) return;
      hctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = hctx.createRadialGradient(w / 2, h / 2, r * 0.6, w / 2, h / 2, r * 1.18);
      g.addColorStop(0, `rgba(59,91,219,${0.16 * opacity})`);
      g.addColorStop(0.72, `rgba(59,91,219,${0.1 * opacity})`);
      g.addColorStop(1, "rgba(59,91,219,0)");
      hctx.fillStyle = g;
      hctx.beginPath();
      hctx.arc(w / 2, h / 2, r * 1.18, 0, Math.PI * 2);
      hctx.fill();
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildHalo();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pause the loop entirely while off-screen (the scroll-perf fix).
    let visible = true;
    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? true;
    });
    io.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let angle = 0;
    let offX = 0;
    let offXTarget = 0;
    let tilt = -0.35;
    let tiltTarget = -0.35;
    let t = 0;

    const parallels = [-60, -40, -20, 0, 20, 40, 60];
    const lonCount = 18;
    const seg = 64;

    const react = (cxp: number, cyp: number) => {
      offXTarget = ((cxp / window.innerWidth) * 2 - 1) * 0.6;
      tiltTarget = -0.35 + ((cyp / window.innerHeight) * 2 - 1) * 0.4;
    };
    const onPointer = (e: PointerEvent) => react(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const p = e.touches[0];
      if (p) react(p.clientX, p.clientY);
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    const rot = (lat: number, lon: number) => {
      const la = (lat * Math.PI) / 180;
      const lo = (lon * Math.PI) / 180 + angle + offX;
      const x = Math.cos(la) * Math.sin(lo);
      const y0 = Math.sin(la);
      const z0 = Math.cos(la) * Math.cos(lo);
      const y = y0 * Math.cos(tilt) - z0 * Math.sin(tilt);
      const z = y0 * Math.sin(tilt) + z0 * Math.cos(tilt);
      return { x, y, z };
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.44;

      // cached atmosphere halo
      if (halo) {
        ctx.globalCompositeOperation = "lighter";
        ctx.drawImage(halo, 0, 0, w, h);
        ctx.globalCompositeOperation = "source-over";
      }

      // graticule (faint, so land reads)
      ctx.lineWidth = 1;
      for (const lat of parallels) {
        ctx.beginPath();
        for (let i = 0; i <= seg; i++) {
          const p = rot(lat, (i / seg) * 360);
          const sx = cx + p.x * r;
          const sy = cy - p.y * r;
          if (i) ctx.lineTo(sx, sy);
          else ctx.moveTo(sx, sy);
        }
        ctx.strokeStyle = `rgba(151,169,247,${0.075 * opacity})`;
        ctx.stroke();
      }
      for (let m = 0; m < lonCount; m++) {
        const lon = (m / lonCount) * 360;
        ctx.beginPath();
        for (let i = 0; i <= seg; i++) {
          const p = rot(-90 + (i / seg) * 180, lon);
          const sx = cx + p.x * r;
          const sy = cy - p.y * r;
          if (i) ctx.lineTo(sx, sy);
          else ctx.moveTo(sx, sy);
        }
        ctx.strokeStyle = `rgba(151,169,247,${0.055 * opacity})`;
        ctx.stroke();
      }

      ctx.globalCompositeOperation = "lighter";

      // continent coastlines (front hemisphere segments only)
      ctx.lineWidth = 1.1;
      ctx.strokeStyle = `rgba(170,190,255,${0.72 * opacity})`;
      for (const loop of COASTS) {
        ctx.beginPath();
        let pen = false;
        for (let i = 0; i < loop.length - 1; i++) {
          const A = rot(loop[i]![0], loop[i]![1]);
          const B = rot(loop[i + 1]![0], loop[i + 1]![1]);
          if (A.z > 0.03 && B.z > 0.03) {
            if (!pen) {
              ctx.moveTo(cx + A.x * r, cy - A.y * r);
              pen = true;
            }
            ctx.lineTo(cx + B.x * r, cy - B.y * r);
          } else {
            pen = false;
          }
        }
        ctx.stroke();
      }

      // land-mass fill dots
      for (const pt of LAND) {
        const p = rot(pt.lat, pt.lon);
        if (p.z <= 0.02) continue;
        const sx = cx + p.x * r;
        const sy = cy - p.y * r;
        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140,166,255,${(0.26 + p.z * 0.6) * opacity})`;
        ctx.fill();
      }

      // shipping-route arcs
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = `rgba(150,175,255,${0.5 * opacity})`;
      for (const [ia, ib] of ARCS) {
        const A = rot(HUBS[ia]![0], HUBS[ia]![1]);
        const B = rot(HUBS[ib]![0], HUBS[ib]![1]);
        if (A.z <= 0.05 || B.z <= 0.05) continue;
        const ax = cx + A.x * r;
        const ay = cy - A.y * r;
        const bx = cx + B.x * r;
        const by = cy - B.y * r;
        const mx = (ax + bx) / 2;
        const my = (ay + by) / 2;
        const dx = mx - cx;
        const dy = my - cy;
        const dl = Math.hypot(dx, dy) || 1;
        const lift = Math.hypot(bx - ax, by - ay) * 0.28;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.quadraticCurveTo(mx + (dx / dl) * lift, my + (dy / dl) * lift, bx, by);
        ctx.stroke();
      }

      // hubs via pre-rendered sprite (Lagos = index 0, drawn larger)
      for (let i = 0; i < HUBS.length; i++) {
        const p = rot(HUBS[i]![0], HUBS[i]![1]);
        if (p.z <= 0.02) continue;
        const sx = cx + p.x * r;
        const sy = cy - p.y * r;
        const pulse = 0.6 + 0.4 * Math.sin(t * 0.1 + i);
        const size = (i === 0 ? 30 : 20) * (0.7 + 0.3 * pulse);
        ctx.globalAlpha = (0.35 + 0.65 * pulse) * opacity;
        ctx.drawImage(sprite, sx - size / 2, sy - size / 2, size, size);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = "rgba(235,241,255,0.95)";
        ctx.beginPath();
        ctx.arc(sx, sy, i === 0 ? 2.2 : 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    // ~30fps, paused off-screen / hidden tab. Ambient motion needs no more.
    let raf = 0;
    let last = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || document.hidden) return;
      if (now - last < 22) return;
      last = now;
      t += 1;
      if (!reduce) angle += 0.003;
      offX += (offXTarget - offX) * 0.12;
      tilt += (tiltTarget - tilt) * 0.12;
      draw();
    };
    draw();
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [opacity]);

  return <canvas ref={ref} aria-hidden className={cn("block h-full w-full", className)} />;
}
