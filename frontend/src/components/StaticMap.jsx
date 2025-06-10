// src/components/StaticMap.jsx
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const StaticMap = ({ lat, lon, name }) => {
    return (
        <MapContainer
            center={[lat, lon]}
            zoom={18}
            style={{ height: "250px", width: "100%", borderRadius: "8px" }}
            scrollWheelZoom={true}
            dragging={true}
            doubleClickZoom={true}
            zoomControl={true}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
            />
            <Marker
                position={[lat, lon]}
                icon={L.icon({
                    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                })}
            >
                <Popup>{name}</Popup>
            </Marker>
        </MapContainer>
    );
};

export default StaticMap;
