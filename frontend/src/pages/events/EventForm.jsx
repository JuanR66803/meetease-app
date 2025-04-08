import { useState } from "react";
import LocationSelector from "../../components/LocationSelector.jsx";
import "./Event.css";

const EventForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        location: "",
        lat: "",
        lng: "",
        price: "",
        capacity: "",
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
            setImagePreview(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleLocationSelect = (location) => {
        setFormData({
            ...formData,
            location: location.name,
            lat: location.lat,
            lng: location.lon, // Se guarda como "lng" para coincidir con tu backend
        });
        console.log("Ubicación seleccionada:", location);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (value) formDataToSend.append(key, value);
        });

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Events/registerEvent`, {
                method: "POST",
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el evento");
            }

            setMessage("Evento creado exitosamente 🎉");
            setFormData({ title: "", date: "", location: "", lat: "", lng: "", price: "", capacity: "", image: null });
            setImagePreview(null);
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="event-form">
            <input type="text" name="title" placeholder="Título del evento" value={formData.title} onChange={handleChange} required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />

            {/* Selector de ciudad con mapa */}
            <LocationSelector onLocationSelect={handleLocationSelect} />

            <div className="input-pair">
                <label>Precio</label>
                <div className="input-group">
                    <span className="input-symbol">$</span>
                    <input
                        type="number"
                        name="price"
                        placeholder="Precio"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <label style={{ marginTop: "12px" }}>Capacidad</label>
                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacidad máxima"
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                />
            </div>

            <label style={{ marginTop: "12px" }}>Imagen del evento (opcional)</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} />

            {imagePreview && (
                <img
                    src={imagePreview}
                    alt="Previsualización"
                    style={{ maxHeight: "200px", marginTop: "10px", borderRadius: "8px" }}
                />
            )}

            <button type="submit" className="register-btn">Crear Evento</button>
            {message && <p className="message">{message}</p>}
        </form>
    );
};

export default EventForm;
