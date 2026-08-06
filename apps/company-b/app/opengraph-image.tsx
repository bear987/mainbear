import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded OG card: charcoal base, flame accent. Solid colours + default font
// (satori-safe) so it always renders at build time.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#1a1714",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#d9622b",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff7ec",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            GG
          </div>
          <div
            style={{
              display: "flex",
              color: "#f7f0e4",
              fontSize: "34px",
              fontWeight: 700,
              letterSpacing: "-1px",
            }}
          >
            {site.name}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              color: "#f7f0e4",
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.08,
              maxWidth: "920px",
              letterSpacing: "-1px",
            }}
          >
            {site.motto}.
          </div>
          <div style={{ display: "flex", color: "#ea9a6b", fontSize: "26px" }}>
            Nigerian meals · Intercontinental dishes · Fresh smoothies · Okota, Lagos
          </div>
        </div>
      </div>
    ),
    size,
  );
}
