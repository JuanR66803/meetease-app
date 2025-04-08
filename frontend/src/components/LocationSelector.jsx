// src/components/LocationSelector.jsx
import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const LocationSelector = ({ onLocationSelect }) => {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState([4.5709, -74.2973]);
    const [locationName, setLocationName] = useState("");
    const mapRef = useRef(null);

    useEffect(() => {
        if (search.length < 3) {
            setSuggestions([]);
            return;
        }

        const delayDebounce = setTimeout(async () => {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}`);
            const data = await res.json();
            setSuggestions(data.slice(0, 5));
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [search]);

    const handleSelectSuggestion = (suggestion) => {
        const { display_name, lat, lon } = suggestion;
        const coords = [parseFloat(lat), parseFloat(lon)];
        setSelectedPosition(coords);
        setLocationName(display_name);
        setSuggestions([]);
        setSearch(display_name);

        // 🔹 Mover el mapa al punto seleccionado
        if (mapRef.current) {
            mapRef.current.setView(coords, 13);
        }

        onLocationSelect({
            name: display_name,
            lat: parseFloat(lat),
            lon: parseFloat(lon),
        });
    };

    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setSelectedPosition([lat, lng]);
                const name = `Marcado manualmente: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
                setLocationName(name);
                onLocationSelect({
                    name,
                    lat,
                    lon: lng,
                });
            },
        });

        return (
            <Marker
                position={selectedPosition}
                icon={L.icon({
                    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                })}
            >
                <Popup>{locationName || "Ubicación seleccionada"}</Popup>
            </Marker>
        );
    };

    return (
        <div className="location-selector">
            <input
                type="text"
                placeholder="Buscar ciudad, país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
            />

            {suggestions.length > 0 && (
                <ul className="suggestion-list">
                    {suggestions.map((item) => (
                        <li key={item.place_id} onClick={() => handleSelectSuggestion(item)}>
                            {item.display_name}
                        </li>
                    ))}
                </ul>
            )}

            <div style={{ height: "300px", marginTop: "10px" }}>
                <MapContainer
                    center={selectedPosition}
                    zoom={10}
                    style={{ height: "100%", width: "100%" }}
                    whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap'
                    />
                    <LocationMarker />
                </MapContainer>
            </div>
        </div>
    );
};

export default LocationSelector;
