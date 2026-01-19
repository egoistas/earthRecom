import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function BaseMap() {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [23.7275, 37.9838],
      zoom: 6
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");
    mapRef.current = map;

    return () => map.remove();
  }, []);

  return <div ref={containerRef} style={{ height: "100vh", width: "100vw" }} />;
}
