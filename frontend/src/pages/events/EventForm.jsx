import { useState } from "react";


const EventForm = () => {
    const [formData, setFormData] = useState({
        title: "",
        date: "",
        location: "",
        price: "",
        capacity: "",
        image: null,
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === "file" ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const formDataToSend = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key !== "image" || formData[key]) {  // 🔹 No incluir imagen si no hay archivo
                formDataToSend.append(key, formData[key]);
            }
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
            setFormData({ title: "", date: "", location: "", price: "", capacity: "", image: null });
        } catch (error) {
            console.error("Error en la solicitud:", error);
            setMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="event-form">
            <input type="text" name="title" placeholder="Título del evento" value={formData.title} onChange={handleChange} required />
            <input type="date" name="date" value={formData.date} onChange={handleChange} required />
            <input type="text" name="location" placeholder="Ubicación" value={formData.location} onChange={handleChange} required />
            <input type="number" name="price" placeholder="Precio" value={formData.price} onChange={handleChange} required />
            <input type="number" name="capacity" placeholder="Capacidad máxima" value={formData.capacity} onChange={handleChange} required />
            <input type="file" name="image" accept="image/*" onChange={handleChange} /> {/* 🔹 Quitamos `required` */}
            <button type="submit" className="register-btn">Crear Evento</button>
            {message && <p className="message">{message}</p>}
        </form>
    );
};

export default EventForm;
