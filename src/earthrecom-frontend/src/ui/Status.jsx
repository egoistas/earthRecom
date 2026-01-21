export default function Status({ mode, A, B, featuresCount }) {
  return (
    <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>
      <div>Mode: <b>{mode}</b></div>
      <div>A: {A ? `${A.lon.toFixed(5)}, ${A.lat.toFixed(5)}, h=${A.h.toFixed(0)}` : "-"}</div>
      <div>B: {B ? `${B.lon.toFixed(5)}, ${B.lat.toFixed(5)}, h=${B.h.toFixed(0)}` : "-"}</div>
      <div>Elements: {featuresCount}</div>
    </div>
  )
}
