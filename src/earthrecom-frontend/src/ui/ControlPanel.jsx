import { Modes } from "../domain/state"

export default function ControlPanel({
  defaultAlt,
  featureAlt,
  onMode,
  onDefaultAlt,
  onFeatureAlt,
  onClearAB,
  onClearFeatures,
  onResetAll,
  onUndoFieldPoint,
  onClearField
}) {

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => onMode(Modes.PICK_AB)}>Pick A/B</button>
        <button onClick={() => onMode(Modes.ADD_RISK)}>Add Risk</button>
        <button onClick={() => onMode(Modes.ADD_NO_FLY)}>Add No-Fly</button>
        <button onClick={() => onMode(Modes.ADD_BONUS)}>Add Bonus</button>
        <button onClick={() => onMode(Modes.DRAW_FIELD)}>Draw Field</button>
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
        <button onClick={onUndoFieldPoint}>Undo Field Point</button>
        <button onClick={onClearField}>Clear Field</button>
        <button onClick={onClearFeatures}>Clear Elements</button>
        <button onClick={onResetAll}>Reset All</button>
      </div>
    </div>
  )
}
