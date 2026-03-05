import { useEffect, useRef } from "react"
import {
  Ion,
  Cartesian3,
  Ellipsoid,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  Viewer
} from "cesium"
import "cesium/Build/Cesium/Widgets/widgets.css"
import { cartesianToLLH } from "../domain/geo"

Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZTRjYWVlOS04MDI5LTRjZjktYWVhYy1mYjc0MjhmMTE0ZmMiLCJpZCI6Mzk4NzAyLCJpYXQiOjE3NzI3MjMyNDV9.6yxDNXEdz20McDTaPIGapsXHLGGlYsUuC4UcNqV8ltA"

export default function CesiumGlobe({ onLeftClickLLH, onViewerReady }) {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const handlerRef = useRef(null)

  useEffect(() => {
    const v = new Viewer(containerRef.current, {
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
    onViewerReady?.(v)

    const h = new ScreenSpaceEventHandler(v.scene.canvas)
    handlerRef.current = h

    h.setInputAction((movement) => {
      const viewer = viewerRef.current
      if (!viewer) return

      let cartesian = viewer.scene.pickPosition(movement.position)
      if (!cartesian) cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid)
      if (!cartesian) return

      const llh = cartesianToLLH(cartesian)
      onLeftClickLLH?.(llh)
    }, ScreenSpaceEventType.LEFT_CLICK)

    return () => {
      try { h.destroy() } catch {/* ignore */}
      try { v.destroy() } catch {/* ignore */}
      handlerRef.current = null
      viewerRef.current = null
    }
  }, [onLeftClickLLH, onViewerReady])

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
}
