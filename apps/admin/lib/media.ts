import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { REPO_ROOT } from "./repo";
import { getSite, type SiteId } from "./sites";

/**
 * Every picture and video the three sites can show, and where each one has to
 * live for the site to find it.
 *
 * Some slots are fixed (a page header, a hero poster). Others are derived from
 * the content itself, because the sites look for a file named after a dish or
 * a vehicle. That means adding a vehicle in the editor immediately creates
 * somewhere to put its photographs.
 */

export type MediaKind = "image" | "video";

export type MediaSlot = {
  /** Path inside the app's public folder. Doubles as the slot id. */
  path: string;
  label: string;
  /** Section heading in the admin. */
  group: string;
  kind: MediaKind;
  /** Longest edge kept, in pixels. Bigger uploads are scaled down. */
  maxWidth?: number;
  /** Tallest the video may be. */
  maxHeight?: number;
  note?: string;
  /** True when the site renders a designed fallback if the file is absent. */
  optional?: boolean;
  /**
   * Keep a PNG as a PNG rather than flattening it to JPEG. Only for the logo,
   * where the transparent background is the whole point. When this is set the
   * saved file takes the uploaded file's extension, and `site.logoFile` in the
   * content is updated to match, so the site asks for the file that exists.
   */
  preserveFormat?: boolean;
};

export type MediaStatus = MediaSlot & {
  exists: boolean;
  bytes?: number;
};

const PAGE_IMAGE = { kind: "image" as const, maxWidth: 1920 };

async function readJson(siteId: SiteId, file: string): Promise<Record<string, unknown>> {
  const raw = await readFile(
    path.join(REPO_ROOT, "apps", siteId, "content", "data", `${file}.json`),
    "utf8",
  );
  return JSON.parse(raw) as Record<string, unknown>;
}

async function slotsForA(): Promise<MediaSlot[]> {
  // The logo's filename is whatever the content currently points at, so the
  // card shows the real file rather than a guess.
  const siteData = await readJson("company-a", "site");
  const current = (siteData.site as { logoFile?: string }).logoFile ?? "brand/logo.jpg";

  return [
    {
      path: current,
      label: "Company logo",
      group: "Brand",
      kind: "image",
      maxWidth: 512,
      optional: true,
      preserveFormat: true,
      note: "A PNG with a transparent background looks best on the dark header, and is kept as a PNG. A monogram shows if this is ever missing.",
    },
    { path: "images/home-port.jpg", label: "Home hero", group: "Home page", ...PAGE_IMAGE },
    { path: "images/home-sea.jpg", label: "Home closing band", group: "Home page", ...PAGE_IMAGE },
    { path: "images/about-story.jpg", label: "About, the story band", group: "About page", ...PAGE_IMAGE },
    { path: "images/header-about.jpg", label: "About header", group: "Page headers", ...PAGE_IMAGE },
    { path: "images/header-services.jpg", label: "Services header", group: "Page headers", ...PAGE_IMAGE },
    { path: "images/header-companies.jpg", label: "Our companies header", group: "Page headers", ...PAGE_IMAGE },
    { path: "images/header-careers.jpg", label: "Careers header", group: "Page headers", ...PAGE_IMAGE },
    { path: "images/header-contact.jpg", label: "Contact header", group: "Page headers", ...PAGE_IMAGE },
  ];
}

async function slotsForB(): Promise<MediaSlot[]> {
  const slots: MediaSlot[] = [
    { path: "images/menu/hero.jpg", label: "Home hero, still picture", group: "Home page", ...PAGE_IMAGE },
    {
      path: "videos/hero.mp4",
      label: "Home hero, moving picture",
      group: "Home page",
      kind: "video",
      maxHeight: 1080,
      optional: true,
      note: "Plays on top of the still above, which shows first and covers anyone who has motion turned off.",
    },
  ];

  const backdrops: [string, string][] = [
    ["menu-header", "Menu page header"],
    ["order", "Order band"],
    ["order-hero", "Order page header"],
    ["interior", "Visit, the dining room"],
    ["about", "About, the story band"],
    ["kitchen", "About, the kitchen"],
  ];
  for (const [file, label] of backdrops) {
    slots.push({
      path: `images/backdrops/${file}.jpg`,
      label,
      group: "Backdrops",
      ...PAGE_IMAGE,
    });
  }

  const videos: [string, string][] = [
    ["order", "Order band"],
    ["interior", "Visit, the dining room"],
    ["about", "About, the story band"],
    ["kitchen", "About, the kitchen"],
  ];
  for (const [file, label] of videos) {
    slots.push({
      path: `videos/${file}.mp4`,
      label: `${label}, moving`,
      group: "Backdrop videos",
      kind: "video",
      maxHeight: 720,
      optional: true,
    });
  }

  // One photograph per dish. The site looks for the file by the dish slug.
  const menu = await readJson("company-b", "menu");
  const dishes = (menu.menu as { slug: string; name: string }[]) ?? [];
  for (const dish of dishes) {
    slots.push({
      path: `images/menu/${dish.slug}.jpg`,
      label: dish.name,
      group: "Dish photographs",
      kind: "image",
      maxWidth: 1200,
      optional: true,
      note: "Until this is added the dish shows a designed panel instead.",
    });
  }

  return slots;
}

async function slotsForC(): Promise<MediaSlot[]> {
  const slots: MediaSlot[] = [
    { path: "images/hero-poster.jpg", label: "Home hero, still picture", group: "Home page", ...PAGE_IMAGE },
    {
      path: "video/hero.mp4",
      label: "Home hero, moving picture",
      group: "Home page",
      kind: "video",
      maxHeight: 1080,
      optional: true,
    },
    { path: "images/assembly-poster.jpg", label: "Assembly, still picture", group: "Services", ...PAGE_IMAGE },
    {
      path: "video/assembly.mp4",
      label: "Assembly, moving picture",
      group: "Services",
      kind: "video",
      maxHeight: 720,
      optional: true,
      note: "Never plays on its own. Visitors press play.",
    },
  ];

  // Each model looks for its own photographs, numbered. Adding a model in the
  // editor creates its slots here automatically.
  const data = await readJson("company-c", "vehicles");
  const vehicles = (data.vehicles as { slug: string; name: string; imageCount: number }[]) ?? [];
  for (const vehicle of vehicles) {
    const count = Math.max(1, vehicle.imageCount || 1);
    for (let i = 0; i < count; i += 1) {
      slots.push({
        path: `images/inventory/${vehicle.slug}${i === 0 ? "" : `-${i}`}.jpg`,
        label: `${vehicle.name}, photograph ${i + 1}`,
        group: vehicle.name,
        kind: "image",
        maxWidth: 1600,
        optional: true,
        note: i === 0 ? "The first photograph, shown in listings." : undefined,
      });
    }
    slots.push({
      path: `video/inventory/${vehicle.slug}.mp4`,
      label: `${vehicle.name}, walkaround`,
      group: vehicle.name,
      kind: "video",
      maxHeight: 720,
      optional: true,
      note: "Optional. The section only appears once this exists.",
    });
  }

  return slots;
}

export async function slotsFor(siteId: SiteId): Promise<MediaSlot[]> {
  if (siteId === "company-a") return slotsForA();
  if (siteId === "company-b") return slotsForB();
  return slotsForC();
}

/** Absolute path for a slot, refusing anything that escapes the public folder. */
export function mediaPath(siteId: string, slotPath: string): string {
  if (!getSite(siteId)) throw new Error(`Unknown site: ${siteId}`);
  const root = path.join(REPO_ROOT, "apps", siteId, "public");
  const resolved = path.resolve(root, slotPath);
  const rootWithSep = root.endsWith(path.sep) ? root : root + path.sep;
  if (!resolved.startsWith(rootWithSep)) {
    throw new Error("That path is outside the site's public folder.");
  }
  return resolved;
}

export function relativeMediaPath(siteId: string, slotPath: string): string {
  return `apps/${siteId}/public/${slotPath}`;
}

export async function statusFor(siteId: SiteId): Promise<MediaStatus[]> {
  const slots = await slotsFor(siteId);
  return Promise.all(
    slots.map(async (slot) => {
      try {
        const info = await stat(mediaPath(siteId, slot.path));
        return { ...slot, exists: true, bytes: info.size };
      } catch {
        return { ...slot, exists: false };
      }
    }),
  );
}
