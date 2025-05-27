import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../../../../../context/AuthContext";
import "./profile.css";

const Profile = () => {
    const { user, updateUser } = useAuth();

    const defaultAvatar = "https://res.cloudinary.com/dbxvkqv6w/image/upload/v1712519462/default_avatar_meetease.png";

    // Estado de edición
    const [isNameEditable, setIsNameEditable] = useState(false);
    const [isEmailEditable, setIsEmailEditable] = useState(false);
    const [isCelEditable, setIsCelEditable] = useState(false);
    const [isPreferencesEditable, setIsPreferencesEditable] = useState(false);

    // Estado de los campos de usuario
    const [name, setName] = useState(user.name || "");
    const [email, setEmail] = useState(user.email || "");
    const [cel, setCel] = useState(user.cel || "");
    const [preferences, setPreferences] = useState(user.preferences || "");
    const [profileImage, setProfileImage] = useState(user.image_url || defaultAvatar);
    const [imageFile, setImageFile] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Por favor selecciona una imagen válida (JPG o PNG)");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("La imagen no debe pesar más de 5MB");
            return;
        }

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfileImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let imageUrl = user.image_url || defaultAvatar;

        if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("upload_preset", "meetEase_upload");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dbxvkqv6w/image/upload", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                imageUrl = data.secure_url;
            } catch (error) {
                console.error("❌ Error subiendo imagen a Cloudinary:", error);
            }
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/update/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, cel, image_url: imageUrl, preferences }),
            });

            const data = await res.json();
            console.log("✅ Usuario actualizado:", data);

            updateUser({ name, email, cel, image_url: imageUrl, preferences });
            alert("Datos actualizados correctamente");
        } catch (error) {
            console.error("❌ Error actualizando usuario:", error);
        }
    };

    return (
        <div className="profile-container">
            {/* Columna izquierda: Foto y datos básicos */}
            <div className="user-photo-section">
                <h2>Foto de Perfil</h2>
                <div className="user-photo">
                    <img src={profileImage} alt="Foto de perfil" className="profile-img" />
                </div>
                <label htmlFor="upload-photo" className="edit-photo-btn">
                    <FaEdit /> Cambiar Foto
                </label>
                <input
                    id="upload-photo"
                    type="file"
                    accept="image/jpeg, image/png"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                />
                <span className="verified-badge">Verificado</span>
                <p className="member-since">Miembro desde 2024</p>
            </div>

            {/* Columna derecha: Info personal y formulario */}
            <div className="user-info-section">
                <h2 className="title-panel">Mi Perfil</h2>
                <p className="info-panel">Gestiona tu información personal y preferencias</p>

                <form className="user-form" onSubmit={handleSubmit}>
                    {/* Nombre */}
                    <label>
                        Nombre completo:
                        <div className="input-edit">
                            <input
                                type="text"
                                placeholder="Tu nombre completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                disabled={!isNameEditable}
                            />
                            <FaEdit onClick={() => setIsNameEditable(!isNameEditable)} className="edit-icon" />
                        </div>
                    </label>

                    {/* Email */}
                    <label>
                        Email
                        <div className="input-edit">
                            <input
                                type="email"
                                placeholder="correo@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={!isEmailEditable}
                            />
                            <FaEdit onClick={() => setIsEmailEditable(!isEmailEditable)} className="edit-icon" />
                        </div>
                    </label>

                    {/* Teléfono */}
                    <label>
                        Teléfono
                        <div className="input-edit">
                            <input
                                type="tel"
                                placeholder="1234567890"
                                value={cel}
                                onChange={(e) => setCel(e.target.value)}
                                disabled={!isCelEditable}
                            />
                            <FaEdit onClick={() => setIsCelEditable(!isCelEditable)} className="edit-icon" />
                        </div>
                    </label>

                    {/* Preferencias */}
                    <label>
                        Preferencias
                        <div className="input-edit">
                            <select
                                value={preferences}
                                disabled={!isPreferencesEditable}
                                onChange={(e) => setPreferences(e.target.value)}
                            >
                                <option value="all">Por defecto</option>
                                <option value="concierto">Concierto</option>
                                <option value="conferencia">Conferencia</option>
                                <option value="cultural">Cultural</option>
                                <option value="fiesta">Fiesta</option>
                                <option value="corporativo">Corporativo</option>
                            </select>
                            <FaEdit onClick={() => setIsPreferencesEditable(!isPreferencesEditable)} className="edit-icon" />
                        </div>
                    </label>

                    <button type="submit" className="save-btn">Guardar Cambios</button>
                </form>

                {/* Estadísticas */}
                <div className="stats-grid">
                    <div className="stat-card blue">
                        <div className="stat-number">12</div>
                        <div className="stat-label">Eventos Creados</div>
                    </div>
                    <div className="stat-card green">
                        <div className="stat-number">48</div>
                        <div className="stat-label">Eventos Asistidos</div>
                    </div>
                    <div className="stat-card purple">
                        <div className="stat-number">156</div>
                        <div className="stat-label">Conexiones</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
