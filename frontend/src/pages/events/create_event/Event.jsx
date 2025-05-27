import "./Event.css";
import { useState } from "react";
import { Calendar, Clock, MapPin, Users, DollarSign, ImageIcon } from "lucide-react";
import LocationSelector from "../../../components/LocationSelector.jsx";
import { useAuth } from "../../../context/AuthContext.jsx";

const Event = () => {
    const [step, setStep] = useState(1);
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        location: "",
        price: "",
        capacity: "",
        image_url: "",
        lat: "",
        lng: "",
        type_event: "",
        id_organizer: user.id,
        location_name: "",
        address: "",
        time: "",
        description: "",
        is_private: false,
        requires_registration: false
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
        const { name, value, type, files, checked } = e.target;

        if (type === "file") {
            const file = files[0];
            if (!file) return;

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
        } else if (type === "checkbox") {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
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
        if (!formData.description) newErrors.description = "La descripción es obligatoria.";
        if (!formData.location) newErrors.location = "La ubicación es obligatoria.";

        if (!formData.type_event) newErrors.type_event = "Debe seleccionar un tipo de evento.";

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
                price: "",
                capacity: "",
                image_url: "",
                lat: "",
                lng: "",
                type_event: "",
                id_organizer: user.id,
                location_name: "",
                address: "",
                time: "",
                description: "",
                is_private: false,
                requires_registration: false
            });
            setImagePreview(null);
            setErrors({});
            setStep(1);
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMessage(error.message);
        }
    };

    const nextStep = () => {
        setStep(prev => Math.min(prev + 1, 3));
    };

    const prevStep = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    return (
        <div className="event-container">
            <div className="event-wrapper">
                <div className="event-header">
                    <h1 className="event-title">Crear un Evento</h1>
                    <p className="event-subtitle">Comparte tu evento con el mundo en unos simples pasos</p>
                </div>

                {/* Progress Steps */}
                <div className="progress-track">
                    <div className="progress-line"></div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="progress-step">
                            <div className={`step-circle ${step >= i ? "active" : ""}`}>{i}</div>
                            <span className={`step-text ${step >= i ? "active" : ""}`}>
                                {i === 1 ? "Información" : i === 2 ? "Ubicación" : "Detalles"}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="form-card">
                    <div className="form-container">
                        <form onSubmit={handleSubmit}>
                            {/* Paso 1: Información básica */}
                            {step === 1 && (
                                <div className="form-section fade-in">
                                    <div className="form-group">
                                        <label htmlFor="title" className="form-label">
                                            Título del evento
                                        </label>
                                        <input
                                            id="title"
                                            name="title"
                                            type="text"
                                            placeholder="Ej: Concierto de música clásica"
                                            className={`form-input ${errors.title ? "error" : ""}`}
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                        {errors.title && <p className="form-error">{errors.title}</p>}
                                    </div>

                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="date" className="form-label">
                                                Fecha
                                            </label>
                                            <div className="input-icon">
                                                <input
                                                    id="date"
                                                    name="date"
                                                    type="date"
                                                    className={`form-input ${errors.date ? "error" : ""}`}
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                />
                                                <Calendar className="icon" />
                                                {errors.date && <p className="form-error">{errors.date}</p>}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="time" className="form-label">
                                                Hora
                                            </label>
                                            <div className="input-icon">
                                                <input
                                                    id="time"
                                                    name="time"
                                                    type="time"
                                                    className="form-input"
                                                    value={formData.time}
                                                    onChange={handleChange}
                                                />
                                                <Clock className="icon" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description" className="form-label">
                                            Descripción
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            placeholder="Describe tu evento..."
                                            className={`form-input form-textarea ${errors.description ? "error" : ""}`}
                                            value={formData.description}
                                            onChange={handleChange}
                                        />
                                        {errors.description && <p className="form-error">{errors.description}</p>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">
                                            Imagen de portada
                                        </label>
                                        <div
                                            className="image-drop"
                                            onClick={() => document.getElementById('image-upload').click()}
                                        >
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Previsualización"
                                                    className="image-preview"
                                                />
                                            ) : (
                                                <>
                                                    <ImageIcon className="image-icon" />
                                                    <p className="image-text">
                                                        Arrastra una imagen o haz clic para seleccionar
                                                    </p>
                                                </>
                                            )}
                                            <input
                                                id="image-upload"
                                                name="image"
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.webp"
                                                className="hidden"
                                                onChange={handleChange}
                                            />
                                        </div>
                                        {errors.image && <p className="form-error">{errors.image}</p>}
                                    </div>

                                    <div className="btn-container">
                                        <div></div>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="btn btn-primary"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Paso 2: Ubicación */}
                            {step === 2 && (
                                <div className="form-section fade-in">
                                    <div className="form-group">
                                        <label htmlFor="location" className="form-label">
                                            Ubicación
                                        </label>
                                        <div className="location-selector">
                                            <LocationSelector onLocationSelect={handleLocationSelect} />
                                            {errors.location && <p className="form-error">{errors.location}</p>}
                                        </div>
                                    </div>

                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="venue" className="form-label">
                                                Nombre del lugar
                                            </label>
                                            <input
                                                id="location_name"
                                                name="location_name"
                                                type="text"
                                                placeholder="Ej: Teatro Municipal"
                                                className="form-input"
                                                value={formData.location_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="address" className="form-label">
                                                Dirección
                                            </label>
                                            <input
                                                id="address"
                                                name="address"
                                                type="text"
                                                placeholder="Ej: Calle Principal 123"
                                                className="form-input"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="btn-container">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="btn btn-secondary"
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="btn btn-primary"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Paso 3: Detalles */}
                            {step === 3 && (
                                <div className="form-section fade-in">
                                    <div className="form-group">
                                        <label htmlFor="type_event" className="form-label">
                                            Tipo de Evento
                                        </label>
                                        <div className="select-wrapper">
                                            <select
                                                id="type_event"
                                                name="type_event"
                                                className={`form-select ${errors.type_event ? "error" : ""}`}
                                                value={formData.type_event}
                                                onChange={handleChange}
                                            >
                                                <option value="">Selecciona un tipo</option>
                                                <option value="Concierto">Concierto</option>
                                                <option value="Conferencia">Conferencia</option>
                                                <option value="Cultural">Cultural</option>
                                                <option value="Fiesta">Fiesta</option>
                                                <option value="Corporativo">Corporativo</option>
                                            </select>
                                        </div>
                                        {errors.type_event && <p className="form-error">{errors.type_event}</p>}
                                    </div>

                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label htmlFor="price" className="form-label">
                                                Precio
                                            </label>
                                            <div className="input-icon">
                                                <input
                                                    id="price"
                                                    name="price"
                                                    type="number"
                                                    placeholder="0.00"
                                                    className={`form-input ${errors.price ? "error" : ""}`}
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                />
                                                <DollarSign className="icon" />
                                                {errors.price && <p className="form-error">{errors.price}</p>}
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="capacity" className="form-label">
                                                Capacidad
                                            </label>
                                            <div className="input-icon">
                                                <input
                                                    id="capacity"
                                                    name="capacity"
                                                    type="number"
                                                    placeholder="Capacidad máxima"
                                                    className={`form-input ${errors.capacity ? "error" : ""}`}
                                                    value={formData.capacity}
                                                    onChange={handleChange}
                                                />
                                                <Users className="icon" />
                                                {errors.capacity && <p className="form-error">{errors.capacity}</p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="divider"></div>

                                    <div className="options-section">
                                        <h3 className="options-heading">Opciones adicionales</h3>

                                        <div className="option-item">
                                            <div>
                                                <label htmlFor="is_private" className="option-label">Evento privado</label>
                                                <p className="option-description">Solo visible para invitados</p>
                                            </div>
                                            <div className="checkbox-wrapper">
                                                <input
                                                    id="is_private"
                                                    name="is_private"
                                                    type="checkbox"
                                                    className="custom-checkbox"
                                                    checked={formData.is_private}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="option-item">
                                            <div>
                                                <label htmlFor="requires_registration" className="option-label">Requiere registro</label>
                                                <p className="option-description">Los asistentes deben registrarse</p>
                                            </div>
                                            <div className="checkbox-wrapper">
                                                <input
                                                    id="requires_registration"
                                                    name="requires_registration"
                                                    type="checkbox"
                                                    className="custom-checkbox"
                                                    checked={formData.requires_registration}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {message && (
                                        <div className={`status-message ${message.includes("exitosamente") ? "success-message" : "error-message"}`}>
                                            {message}
                                        </div>
                                    )}

                                    <div className="btn-container">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="btn btn-secondary"
                                        >
                                            Anterior
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                        >
                                            Crear Evento
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;