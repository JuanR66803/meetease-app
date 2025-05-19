import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import "./Dashboard_user.css";
import { useAuth } from "../../../context/AuthContext";

const Dashboard_user = () => {
  const { user, updateUser } = useAuth();

  const defaultAvatar = "https://res.cloudinary.com/dbxvkqv6w/image/upload/v1712519462/default_avatar_meetease.png";

  const [isNameEditable, setIsNameEditable] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [isCelEditable, setIsCelEditable] = useState(false);
  const [isPreferencesEditable, setIsPreferencesEditable] = useState(false);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          cel,
          image_url: imageUrl,
          preferences,
        }),
      });

      const data = await res.json();
      console.log("✅ Usuario actualizado:", data);

      // 🔄 Actualizar contexto global del usuario
      updateUser({
        name,
        email,
        cel,
        image_url: imageUrl,
        preferences,
      });

      alert("Datos actualizados correctamente");
    } catch (error) {
      console.error("❌ Error actualizando usuario:", error);
    }
  };

  return (
    <div className="dashboard-user">
      <div className="dashboard-card">
        <div className="menu-panel">
          <ul>
            <li className="menu-item active">Profile</li>
            <li className="menu-item">Settings</li>
          </ul>
        </div>

        <div className="user-panel">
          <div className="user-photo-section">
            <div className="user-photo">
              <img src={profileImage} alt="Foto de perfil" className="profile-img" />
            </div>

            <label htmlFor="upload-photo" className="edit-photo-btn">
              <FaEdit /> editar Foto
            </label>
            <input
              id="upload-photo"
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            <p className="section-title">Datos del Usuario</p>
          </div>

          <form className="user-form" onSubmit={handleSubmit}>
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
                <FaEdit
                  className="edit-icon"
                  onClick={() => setIsNameEditable(!isNameEditable)}
                />
              </div>
            </label>

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
                <FaEdit
                  className="edit-icon"
                  onClick={() => setIsEmailEditable(!isEmailEditable)}
                />
              </div>
            </label>

            <label>
              Cel
              <div className="input-edit">
                <input
                  type="tel"
                  placeholder="1234567890"
                  value={cel}
                  onChange={(e) => setCel(e.target.value)}
                  disabled={!isCelEditable}
                />
                <FaEdit
                  className="edit-icon"
                  onClick={() => setIsCelEditable(!isCelEditable)}
                />
              </div>
            </label>
            <label>
              Preferencias
              <div className="input-edit">
                <select value={preferences} disabled={!isPreferencesEditable} onChange={(e)=>setPreferences(e.target.value)} name="preferences" id="preferences">
                  <option value="all">por defecto</option>
                  <option value="concierto">Concierto</option>
                  <option value="conferencia">Conferencia</option>
                  <option value="cultural">Cultural</option>
                  <option value="fiesta">Fiesta</option>
                  <option value="corporativo">Corporativo</option>
                </select>
                <FaEdit
                  className="edit-icon"
                  onClick={() => setIsPreferencesEditable(!isPreferencesEditable)}
                />
              </div>
            </label>
            <button type="submit" className="save-btn">
              Guardar Cambios
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard_user;
