import { useEffect, useRef } from "react"
import { Color } from "cesium"
import { llhToCartesian } from "../domain/geo"
import { featureColor } from "../domain/feature"

export function useCesiumEntities(viewer, { A, B, routeLLH, features }) {
  const AEntityRef = useRef(null)
  const BEntityRef = useRef(null)
  const routeEntityRef = useRef(null)
  const featureEntitiesRef = useRef(new Map())

  useEffect(() => {
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

    const routePositions = routeLLH ? routeLLH.map(llhToCartesian) : null

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
  }, [viewer, A, B, routeLLH])

  useEffect(() => {
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
      const color = featureColor(f.kind, Color)
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
  }, [viewer, features])
}
