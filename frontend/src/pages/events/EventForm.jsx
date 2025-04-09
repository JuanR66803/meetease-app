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
        image_url: "",
        type_event: "", // 🔄 nombre correcto
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({});

    const uploadImageToCloudinary = async (imageFile) => {
        const data = new FormData();
        data.append("file", imageFile);
        data.append("upload_preset", "meetEase_upload");

        const res = await fetch("https://api.cloudinary.com/v1_1/dbxvkqv6w/image/upload", {
            method: "POST",
            body: data,
        });

        const result = await res.json();
        return result.secure_url;
    };

    const handleChange = async (e) => {
        const { name, value, type, files } = e.target;

        if (type === "file") {
            const file = files[0];
            const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
            const maxSize = 5 * 1024 * 1024;

            if (!validTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, image: "Solo se permiten imágenes PNG, JPEG, JPG o WEBP." }));
                setImagePreview(null);
                return;
            }

            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, image: "La imagen no debe superar los 5MB." }));
                setImagePreview(null);
                return;
            }

            try {
                const imageurl = await uploadImageToCloudinary(file);
                console.log("📸 Imagen subida a Cloudinary:", imageurl);
                setFormData(prev => ({ ...prev, image_url: imageurl }));
                setImagePreview(imageurl);
                setErrors(prev => ({ ...prev, image: null }));
            } catch (err) {
                setErrors(prev => ({ ...prev, image: "Error al subir la imagen." }));
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleLocationSelect = (location) => {
        setFormData(prev => ({
            ...prev,
            location: location.name,
            lat: location.lat,
            lng: location.lon,
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date();
        const selectedDate = new Date(formData.date);

        if (!formData.title.trim()) newErrors.title = "El título es obligatorio.";
        if (!formData.date) newErrors.date = "La fecha es obligatoria.";
        else if (selectedDate <= today) newErrors.date = "La fecha debe ser posterior a hoy.";

        if (!formData.type_event) newErrors.type_event = "Debe seleccionar un tipo de evento."; // ✅ corregido

        if (formData.price === "" || Number(formData.price) < 0) newErrors.price = "El precio debe ser mayor o igual a 0.";
        if (formData.capacity === "" || Number(formData.capacity) <= 0) newErrors.capacity = "La capacidad debe ser mayor a 0.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (!validateForm()) return;

        const payload = { ...formData };

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Events/registerEvent`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al crear el evento");
            }

            setMessage("Evento creado exitosamente 🎉");
            setFormData({
                title: "",
                date: "",
                location: "",
                lat: "",
                lng: "",
                price: "",
                capacity: "",
                image_url: "",
                type_event: "",
            });
            setImagePreview(null);
            setErrors({});
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="event-form">
            <input type="text" name="title" placeholder="Título del evento" value={formData.title} onChange={handleChange} required />
            {errors.title && <p className="error-text">{errors.title}</p>}

            <input
                type="date"
                name="date"
                className={errors.date ? "error" : ""}
                value={formData.date}
                onChange={handleChange}
                required
            />
            {errors.date && <p className="error-text">{errors.date}</p>}

            <LocationSelector onLocationSelect={handleLocationSelect} />

            <label style={{ marginTop: "12px" }}>Tipo de Evento</label>
            <select
                name="type_event"
                className={errors.type_event ? "error" : ""}
                value={formData.type_event}
                onChange={handleChange}
                required
            >
                <option value="">Selecciona un tipo</option>
                <option value="Concierto">Concierto</option>
                <option value="Conferencia">Conferencia</option>
                <option value="Cultural">Cultural</option>
                <option value="Fiesta">Fiesta</option>
                <option value="Corporativo">Corporativo</option>
            </select>
            {errors.type_event && <p className="error-text">{errors.type_event}</p>}

            <div className="input-pair">
                <label>Precio</label>
                <div className="input-group">
                    <span className="input-symbol">$</span>
                    <input
                        type="number"
                        name="price"
                        placeholder="Precio"
                        className={errors.price ? "error" : ""}
                        value={formData.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                {errors.price && <p className="error-text">{errors.price}</p>}

                <label style={{ marginTop: "12px" }}>Capacidad</label>
                <input
                    type="number"
                    name="capacity"
                    placeholder="Capacidad máxima"
                    className={errors.capacity ? "error" : ""}
                    value={formData.capacity}
                    onChange={handleChange}
                    required
                />
                {errors.capacity && <p className="error-text">{errors.capacity}</p>}
            </div>

            <label style={{ marginTop: "12px" }}>Imagen del evento (opcional)</label>
            <input type="file" name="image" accept=".png,.jpg,.jpeg,.webp" onChange={handleChange} />
            {errors.image && <p className="error-text">{errors.image}</p>}

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
