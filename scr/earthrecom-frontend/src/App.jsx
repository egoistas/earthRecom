import { useEffect, useMemo, useRef, useState } from "react"
import {
  Cartesian3,
  Cartographic,
  Color,
  Ellipsoid,
  OpenStreetMapImageryProvider,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer
} from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"

function cartesianToLLH(cartesian) {
  const c = Cartographic.fromCartesian(cartesian, Ellipsoid.WGS84)
  return { lon: (c.longitude * 180) / Math.PI, lat: (c.latitude * 180) / Math.PI, h: c.height || 0 }
}

function llhToCartesian({ lon, lat, h }) {
  return Cartesian3.fromDegrees(lon, lat, h || 0)
}

function mkFeature(kind, llh, altitudeOverride) {
  return {
    id: crypto.randomUUID(),
    kind,
    lon: llh.lon,
    lat: llh.lat,
    h: altitudeOverride ?? llh.h ?? 0,
    severity: 1.0,
    radius_m: 300
  }
}

export default function App() {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const handlerRef = useRef(null)

  const AEntityRef = useRef(null)
  const BEntityRef = useRef(null)
  const routeEntityRef = useRef(null)
  const featureEntitiesRef = useRef(new Map())

  const [mode, setMode] = useState("pickAB")
  const [A, setA] = useState(null)
  const [B, setB] = useState(null)
  const [defaultAlt, setDefaultAlt] = useState(60)
  const [featureAlt, setFeatureAlt] = useState(60)
  const [features, setFeatures] = useState([])

  const routePositions = useMemo(() => {
    if (!A || !B) return null
    return [llhToCartesian(A), llhToCartesian(B)]
  }, [A, B])

  useEffect(() => {
    const v = new Viewer(containerRef.current, {
      // imageryProvider: new OpenStreetMapImageryProvider({ url: "https://a.tile.openstreetmap.org/" }),
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false
    })
    v.scene.globe.depthTestAgainstTerrain = true
    v.camera.flyTo({
    destination: Cartesian3.fromDegrees(23.7275, 37.9838, 1500000)
    })

    viewerRef.current = v
    const h = new ScreenSpaceEventHandler(v.scene.canvas)
    handlerRef.current = h

    h.setInputAction((movement) => {
      const viewer = viewerRef.current
      if (!viewer) return

      let cartesian = viewer.scene.pickPosition(movement.position)
      if (!cartesian) cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid)
      if (!cartesian) return

      const llh = cartesianToLLH(cartesian)

      if (mode === "pickAB") {
        if (!A) setA({ ...llh, h: defaultAlt })
        else if (!B) setB({ ...llh, h: defaultAlt })
        else {
          setA({ ...llh, h: defaultAlt })
          setB(null)
        }
        return
      }

      if (mode === "addRisk") {
        setFeatures((p) => [...p, mkFeature("risk", llh, featureAlt)])
        return
      }

      if (mode === "addNoFly") {
        setFeatures((p) => [...p, mkFeature("no_fly", llh, featureAlt)])
        return
      }

      if (mode === "addBonus") {
        setFeatures((p) => [...p, mkFeature("bonus", llh, featureAlt)])
      }
    }, ScreenSpaceEventType.LEFT_CLICK)

    return () => {
      try {
        h.destroy()
      } catch {}
      try {
        v.destroy()
      } catch {}
      handlerRef.current = null
      viewerRef.current = null
    }
  }, [])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    if (A) {
      if (!AEntityRef.current) {
        AEntityRef.current = viewer.entities.add({
          position: llhToCartesian(A),
          point: { pixelSize: 10, color: Color.CYAN }
        })
      } else {
        AEntityRef.current.position = llhToCartesian(A)
      }
    } else if (AEntityRef.current) {
      viewer.entities.remove(AEntityRef.current)
      AEntityRef.current = null
    }

    if (B) {
      if (!BEntityRef.current) {
        BEntityRef.current = viewer.entities.add({
          position: llhToCartesian(B),
          point: { pixelSize: 10, color: Color.DEEPSKYBLUE }
        })
      } else {
        BEntityRef.current.position = llhToCartesian(B)
      }
    } else if (BEntityRef.current) {
      viewer.entities.remove(BEntityRef.current)
      BEntityRef.current = null
    }

    if (routePositions) {
      if (!routeEntityRef.current) {
        routeEntityRef.current = viewer.entities.add({
          polyline: { positions: routePositions, width: 4, material: Color.YELLOW }
        })
      } else {
        routeEntityRef.current.polyline.positions = routePositions
      }
    } else if (routeEntityRef.current) {
      viewer.entities.remove(routeEntityRef.current)
      routeEntityRef.current = null
    }
  }, [A, B, routePositions])

  useEffect(() => {
    const viewer = viewerRef.current
    if (!viewer) return

    const byId = featureEntitiesRef.current
    const alive = new Set(features.map((f) => f.id))

    for (const [id, ent] of byId.entries()) {
      if (!alive.has(id)) {
        viewer.entities.remove(ent)
        byId.delete(id)
      }
    }

    for (const f of features) {
      const color = f.kind === "risk" ? Color.RED : f.kind === "no_fly" ? Color.ORANGE : Color.LIME
      const existing = byId.get(f.id)
      if (!existing) {
        const ent = viewer.entities.add({
          position: llhToCartesian(f),
          point: { pixelSize: 8, color }
        })
        byId.set(f.id, ent)
      } else {
        existing.position = llhToCartesian(f)
        existing.point.color = color
      }
    }
  }, [features])

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
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
          <button onClick={() => setMode("pickAB")}>Pick A/B</button>
          <button onClick={() => setMode("addRisk")}>Add Risk</button>
          <button onClick={() => setMode("addNoFly")}>Add No-Fly</button>
          <button onClick={() => setMode("addBonus")}>Add Bonus</button>
        </div>

        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>A/B altitude (m)</div>
            <input type="number" value={defaultAlt} onChange={(e) => setDefaultAlt(Number(e.target.value || 0))} style={{ width: "100%" }} />
          </div>
          <div>
            <div style={{ fontSize: 12, opacity: 0.85 }}>Feature altitude (m)</div>
            <input type="number" value={featureAlt} onChange={(e) => setFeatureAlt(Number(e.target.value || 0))} style={{ width: "100%" }} />
          </div>
        </div>

        <div style={{ marginTop: 10, fontSize: 12, opacity: 0.9 }}>
          <div>Mode: <b>{mode}</b></div>
          <div>A: {A ? `${A.lon.toFixed(5)}, ${A.lat.toFixed(5)}, h=${A.h.toFixed(0)}` : "-"}</div>
          <div>B: {B ? `${B.lon.toFixed(5)}, ${B.lat.toFixed(5)}, h=${B.h.toFixed(0)}` : "-"}</div>
          <div>Elements: {features.length}</div>
        </div>

        <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
          <button onClick={() => { setA(null); setB(null) }}>Clear A/B</button>
          <button onClick={() => setFeatures([])}>Clear Elements</button>
          <button onClick={() => { setA(null); setB(null); setFeatures([]) }}>Reset All</button>
        </div>

        <div style={{ marginTop: 10, maxHeight: 220, overflow: "auto", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 10 }}>
          {features.length === 0 ? (
            <div style={{ fontSize: 12, opacity: 0.7 }}>No elements yet. Choose a mode and click on the globe.</div>
          ) : (
            features.map((f, idx) => (
              <div key={f.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 12 }}>
                  <b>{idx + 1}.</b> {f.kind} — {f.lon.toFixed(4)}, {f.lat.toFixed(4)} h={Math.round(f.h)}m
                </div>
                <button onClick={() => setFeatures((p) => p.filter((x) => x.id !== f.id))}>Delete</button>
              </div>
            ))
          )}
        </div>
      </div>

      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}
