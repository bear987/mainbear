import { execFile } from "node:child_process";
import { mkdir, rename, rm, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);

/**
 * Pictures and video are re-encoded before they are saved, so an 8 megapixel
 * photograph straight off a phone does not end up in the repository at full
 * size. Git keeps every version of every file forever, so this is the
 * difference between a repository that stays usable and one that does not.
 *
 * ffmpeg does both jobs, which keeps this app free of native dependencies.
 * It is already installed on this machine and on PATH.
 */

export class ToolMissing extends Error {}

async function ffmpeg(args: string[]): Promise<void> {
  try {
    await run("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
      maxBuffer: 20 * 1024 * 1024,
      windowsHide: true,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    if (message.includes("ENOENT") && message.includes("spawn")) {
      throw new ToolMissing(
        "ffmpeg is not installed or not on PATH. Install it with: winget install Gyan.FFmpeg",
      );
    }

    // ffmpeg's own output names temporary paths and is written for engineers.
    // Translate the cases that actually happen and keep the rest short.
    if (/Invalid data found|does not contain any stream|Decoder .* not found/i.test(message)) {
      throw new Error(
        "That file is not a picture or a video, or it is damaged. Try exporting it again.",
      );
    }
    if (/No space left/i.test(message)) {
      throw new Error("The disk is full, so the file could not be saved.");
    }
    throw new Error("That file could not be processed. Try a different one, or a common format.");
  }
}

export type Probe = { width: number; height: number; duration: number };

export async function probe(file: string): Promise<Probe | null> {
  try {
    const { stdout } = await run(
      "ffprobe",
      [
        "-v", "error",
        "-select_streams", "v:0",
        "-show_entries", "stream=width,height:format=duration",
        "-of", "json",
        file,
      ],
      { windowsHide: true },
    );
    const parsed = JSON.parse(stdout) as {
      streams?: { width?: number; height?: number }[];
      format?: { duration?: string };
    };
    const stream = parsed.streams?.[0];
    if (!stream?.width || !stream.height) return null;
    return {
      width: stream.width,
      height: stream.height,
      duration: Number(parsed.format?.duration ?? 0),
    };
  } catch {
    return null;
  }
}

/**
 * Scale down to fit `maxWidth`, never up, and write a clean JPEG. `-1` on the
 * height keeps the aspect ratio, rounded to an even number so odd sizes cannot
 * produce a stripe down the edge.
 */
export async function processImage(
  input: string,
  output: string,
  maxWidth: number,
): Promise<void> {
  await mkdir(path.dirname(output), { recursive: true });
  const keepAlpha = output.toLowerCase().endsWith(".png");
  const scale = `scale='min(${maxWidth},iw)':-2:flags=lanczos`;

  await ffmpeg([
    "-i", input,
    "-vf", scale,
    "-frames:v", "1",
    ...(keepAlpha ? ["-c:v", "png"] : ["-q:v", "3", "-pix_fmt", "yuvj420p"]),
    output,
  ]);
}

/**
 * Re-encode to H.264 at a sane size and bitrate. Audio is dropped on purpose:
 * every video on these sites plays muted as a background layer, so the track
 * is weight with no benefit. faststart moves the index to the front so the
 * video starts playing before it has finished downloading.
 */
export async function processVideo(
  input: string,
  output: string,
  maxHeight: number,
): Promise<void> {
  await mkdir(path.dirname(output), { recursive: true });
  await ffmpeg([
    "-i", input,
    "-vf", `scale=-2:'min(${maxHeight},ih)':flags=lanczos`,
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", "26",
    "-profile:v", "high",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    "-an",
    output,
  ]);
}

/**
 * Process into a temporary file first and only move it into place once it has
 * worked, so a failed encode can never leave a half-written file where the
 * site expects a picture.
 */
export async function processInto(
  input: string,
  output: string,
  kind: "image" | "video",
  limit: number,
): Promise<{ bytes: number; probe: Probe | null }> {
  const temp = `${output}.uploading${kind === "video" ? ".mp4" : path.extname(output)}`;
  try {
    if (kind === "image") await processImage(input, temp, limit);
    else await processVideo(input, temp, limit);

    const info = await stat(temp);
    const dimensions = await probe(temp);
    await rename(temp, output);
    return { bytes: info.size, probe: dimensions };
  } catch (error) {
    await rm(temp, { force: true });
    throw error;
  }
}
