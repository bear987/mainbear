import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name}, operating group in global trade`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded default OG card for shared links. Uses solid colours + the default
// font (satori-safe) so it always renders at build time.
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
          background: "#0e1526",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              background: "#fafaf8",
              alignItems: "center",
              justifyContent: "center",
              color: "#0e1526",
              fontSize: "24px",
              fontWeight: 700,
            }}
          >
            GG
          </div>
          <div
            style={{
              display: "flex",
              color: "#fafaf8",
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
              color: "#ffffff",
              fontSize: "60px",
              fontWeight: 700,
              lineHeight: 1.1,
              maxWidth: "920px",
              letterSpacing: "-2px",
            }}
          >
            An operating group built on trade, and on integrity.
          </div>
          <div style={{ display: "flex", color: "#97a9f7", fontSize: "26px" }}>
            Partnerships · Investments · Corporate services · GG FOODS · GG AUTOS
          </div>
        </div>
      </div>
    ),
    size,
  );
}
