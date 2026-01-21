export function mkFeature(kind, llh, altitudeOverride) {
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

export function featureColor(kind, Color) {
  if (kind === "risk") return Color.RED
  if (kind === "no_fly") return Color.ORANGE
  return Color.LIME
}
