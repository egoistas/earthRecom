import { useCallback, useMemo, useReducer, useState } from "react"
import CesiumGlobe from "../cesium/CesiumGlobe"
import { useCesiumEntities } from "../cesium/useCesiumEntities"
import ControlPanel from "../ui/ControlPanel"
import Status from "../ui/Status"
import FeatureList from "../ui/FeatureList"
import { initialState, reducer, routePositionsLLH } from "../domain/state"

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, initialState)
  const [viewer, setViewer] = useState(null)

  const onLeftClickLLH = useCallback((llh) => {
    dispatch({ type: "MAP_CLICK", llh })
  }, [])

  const onViewerReady = useCallback((v) => {
    setViewer(v)
  }, [])

  const routeLLH = useMemo(() => routePositionsLLH(state.A, state.B), [state.A, state.B])

  useCesiumEntities(viewer, {
    A: state.A,
    B: state.B,
    routeLLH,
    features: state.features,
    fieldLLH: state.fieldLLH
  })

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <div
  style={{
    position: "absolute",
    zIndex: 10,
    top: 12,
    left: 12,
    width: 420,
    padding: 12,
    background: "rgba(15,15,15,0.75)",
    color: "white",
    borderRadius: 10,
    fontFamily: "system-ui, sans-serif"
  }}
>
  <ControlPanel
    mode={state.mode}
    defaultAlt={state.defaultAlt}
    featureAlt={state.featureAlt}
    onMode={(mode) => dispatch({ type: "SET_MODE", mode })}
    onDefaultAlt={(value) => dispatch({ type: "SET_DEFAULT_ALT", value })}
    onFeatureAlt={(value) => dispatch({ type: "SET_FEATURE_ALT", value })}
    onClearAB={() => dispatch({ type: "CLEAR_AB" })}
    onClearFeatures={() => dispatch({ type: "CLEAR_FEATURES" })}
    onResetAll={() => dispatch({ type: "RESET_ALL" })}
    onUndoFieldPoint={() => dispatch({ type: "UNDO_FIELD_POINT" })}
    onClearField={() => dispatch({ type: "CLEAR_FIELD" })}
  />

  <Status mode={state.mode} A={state.A} B={state.B} featuresCount={state.features.length} />

  <FeatureList
    features={state.features}
    onDelete={(id) => dispatch({ type: "DELETE_FEATURE", id })}
  />
</div>


      <CesiumGlobe onLeftClickLLH={onLeftClickLLH} onViewerReady={onViewerReady} />
    </div>
  )
}
