export default function FeatureList({ features, onDelete }) {
  return (
    <div
      style={{
        marginTop: 10,
        maxHeight: 220,
        overflow: "auto",
        borderTop: "1px solid rgba(255,255,255,0.15)",
        paddingTop: 10
      }}
    >
      {features.length === 0 ? (
        <div style={{ fontSize: 12, opacity: 0.7 }}>No elements yet. Choose a mode and click on the globe.</div>
      ) : (
        features.map((f, idx) => (
          <div
            key={f.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              padding: "6px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)"
            }}
          >
            <div style={{ fontSize: 12 }}>
              <b>{idx + 1}.</b> {f.kind} — {f.lon.toFixed(4)}, {f.lat.toFixed(4)} h={Math.round(f.h)}m
            </div>
            <button onClick={() => onDelete(f.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  )
}
