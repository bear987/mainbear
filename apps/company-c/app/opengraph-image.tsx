import { ImageResponse } from "next/og";
import { catalogueStats } from "../content/vehicles";
import { site } from "../content/site";

export const alt = "GG Autos, mini buses assembled and sold in Lagos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Kept to plain boxes and system-safe type so it renders in satori
   without shipping a font binary into the edge bundle. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#111110",
          color: "#f3f1ec",
          padding: 64,
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              border: "3px solid #d6231c",
              color: "#d6231c",
              padding: "6px 14px",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            GG
          </div>
          <div style={{ fontSize: 26, letterSpacing: 8, textTransform: "uppercase" }}>
            Autos
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 20,
              letterSpacing: 4,
              color: "#918d85",
              textTransform: "uppercase",
            }}
          >
            Okota, Lagos, NG
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 92,
              lineHeight: 0.95,
              fontWeight: 700,
              letterSpacing: -3,
              textTransform: "uppercase",
              maxWidth: 900,
            }}
          >
            Mini buses & mini trucks
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: "#cfcdc7", maxWidth: 820 }}>
            Suzuki and Daihatsu, coupled in our own workshop. Retail and wholesale.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            borderTop: "2px solid rgba(243,241,236,0.25)",
            paddingTop: 24,
            gap: 56,
            fontSize: 22,
            color: "#918d85",
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          <div style={{ display: "flex" }}>{catalogueStats.models} models</div>
          <div style={{ display: "flex" }}>
            {catalogueStats.minSeats} to {catalogueStats.maxSeats} seats ·{" "}
            {catalogueStats.maxPayload} kg
          </div>
          <div style={{ display: "flex", marginLeft: "auto", color: "#d6231c" }}>
            {site.url.replace("https://", "")}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
