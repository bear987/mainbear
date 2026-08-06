/**
 * Fixed ambient mesh behind the whole site: two soft blue light pools on the
 * near-black base, so glass surfaces have something to refract. Fixed +
 * pointer-events-none, zero scroll repaint cost.
 */
export function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute -left-[20%] -top-[25%] h-[70vh] w-[70vh] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(59,91,219,0.16), rgba(59,91,219,0) 65%)",
        }}
      />
      <div
        className="absolute -bottom-[30%] -right-[15%] h-[80vh] w-[80vh] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, rgba(151,169,247,0.09), rgba(151,169,247,0) 62%)",
        }}
      />
    </div>
  );
}
