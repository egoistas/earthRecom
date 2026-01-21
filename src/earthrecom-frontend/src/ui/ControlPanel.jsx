import { Modes } from "../domain/state"

export default function ControlPanel({
  mode,
  defaultAlt,
  featureAlt,
  onMode,
  onDefaultAlt,
  onFeatureAlt,
  onClearAB,
  onClearFeatures,
  onResetAll
}) {
  return (
    <div
      style={{
        position: "absolute",
        zIndex: 10,
        top: 12,
        left: 12,
        padding: 12,
        background: "rgba(15,15,15,0.75)",
        color: "white",
        borderRadius: 10,
        width: 420,
        fontFamily: "system-ui, sans-serif"
      }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => onMode(Modes.PICK_AB)}>Pick A/B</button>
        <button onClick={() => onMode(Modes.ADD_RISK)}>Add Risk</button>
        <button onClick={() => onMode(Modes.ADD_NO_FLY)}>Add No-Fly</button>
        <button onClick={() => onMode(Modes.ADD_BONUS)}>Add Bonus</button>
      </div>

      <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>A/B altitude (m)</div>
          <input
            type="number"
            value={defaultAlt}
            onChange={(e) => onDefaultAlt(Number(e.target.value || 0))}
            style={{ width: "100%" }}
          />
        </div>
        <div>
          <div style={{ fontSize: 12, opacity: 0.85 }}>Feature altitude (m)</div>
          <input
            type="number"
            value={featureAlt}
            onChange={(e) => onFeatureAlt(Number(e.target.value || 0))}
            style={{ width: "100%" }}
          />
        </div>
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
        <button onClick={onClearAB}>Clear A/B</button>
        <button onClick={onClearFeatures}>Clear Elements</button>
        <button onClick={onResetAll}>Reset All</button>
      </div>
    </div>
  )
}
