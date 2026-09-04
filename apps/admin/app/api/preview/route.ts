import { spawn } from "node:child_process";
import { NextResponse } from "next/server";
import { REPO_ROOT } from "@/lib/repo";
import { SITES, getSite } from "@/lib/sites";

/**
 * Start and check the three site dev servers, so a change can be seen before
 * it is published. Servers are started detached and keep running until the
 * machine is restarted or they are stopped from the terminal.
 */

const started = new Set<string>();

async function isUp(port: number): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(`http://localhost:${port}/`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET() {
  const status = await Promise.all(
    SITES.map(async (s) => ({
      id: s.id,
      port: s.port,
      running: await isUp(s.port),
      starting: started.has(s.id),
    })),
  );
  return NextResponse.json({ status });
}

export async function POST(request: Request) {
  const { site } = (await request.json()) as { site?: string };
  const definition = site ? getSite(site) : undefined;
  if (!definition) {
    return NextResponse.json({ error: "Unknown site." }, { status: 400 });
  }

  if (await isUp(definition.port)) {
    return NextResponse.json({ ok: true, alreadyRunning: true });
  }

  const child = spawn("pnpm", ["--filter", definition.id, "dev"], {
    cwd: REPO_ROOT,
    detached: true,
    stdio: "ignore",
    shell: process.platform === "win32",
    windowsHide: true,
  });
  child.unref();

  started.add(definition.id);
  // Next compiles on first request, so the port answers before the page is
  // ready. The UI polls until it responds.
  setTimeout(() => started.delete(definition.id), 60_000);

  return NextResponse.json({ ok: true, starting: true });
}
