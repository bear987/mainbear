/**
 * Shrink a picture in the browser before it is uploaded.
 *
 * Hosted there is no ffmpeg and the whole file has to travel through a
 * serverless function, so the resizing that normally happens on the server has
 * to happen here instead. A photograph straight off a phone goes from several
 * megabytes to a couple of hundred kilobytes, which is both small enough to
 * send and small enough to live in the repository forever.
 */

export type Shrunk = { file: File; width: number; height: number };

export async function shrinkImage(file: File, maxWidth: number): Promise<Shrunk> {
  const bitmap = await createImageBitmap(file);

  // Never scale up: a small picture stays exactly as it is.
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot resize pictures.");
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // A PNG keeps its transparency, which is the whole point of the logo slot.
  // Everything else becomes a JPEG, which is far smaller for a photograph.
  const keepAlpha = file.type === "image/png";
  const type = keepAlpha ? "image/png" : "image/jpeg";

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, keepAlpha ? undefined : 0.82),
  );
  if (!blob) throw new Error("The picture could not be prepared for upload.");

  const name = file.name.replace(/\.[^.]+$/, keepAlpha ? ".png" : ".jpg");
  return { file: new File([blob], name, { type }), width, height };
}
