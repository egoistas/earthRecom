import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function BaseMap() {
  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapContainer
        center={[37.9838, 23.7275]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          subdomains={["a", "b", "c"]}
          attribution='&copy; OpenStreetMap contributors'
        />
      </MapContainer>
    </div>
  );
}
