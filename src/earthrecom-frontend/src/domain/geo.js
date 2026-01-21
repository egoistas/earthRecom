import { Cartesian3, Cartographic, Ellipsoid } from "cesium"

export function cartesianToLLH(cartesian) {
  const c = Cartographic.fromCartesian(cartesian, Ellipsoid.WGS84)
  return {
    lon: (c.longitude * 180) / Math.PI,
    lat: (c.latitude * 180) / Math.PI,
    h: c.height || 0
  }
}

export function llhToCartesian({ lon, lat, h }) {
  return Cartesian3.fromDegrees(lon, lat, h || 0)
}
