import "./SignUp.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook} from "react-icons/fa";

const SignUp = () => {
    const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            return setError("Todos los campos son obligatorios.");
        }

        if (formData.password !== formData.confirmPassword) {
            return setError("Las contraseñas no coinciden.");
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al registrar usuario.");
            }

            setSuccess("Usuario registrado con éxito. Redirigiendo...");
            setTimeout(() => navigate("/auth/sign-in"), 2000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="sign-up-container">
            {/* Sección Izquierda */}
            <div className="left-section">
                <div className="text-center">
                    <h1>Regístrate</h1>
                    <p>Adquiere tu mejor experiencia</p>
                    
                    <div className="auth-buttons">
                        <button className="auth-button google-button">
                            <FcGoogle className="icon" />
                            Continuar con Google
                        </button>

                        <button className="auth-button facebook-button">
                            <FaFacebook className="icon" />
                            Continuar con Facebook
                        </button>
                    </div>
                </div>
            </div>

            {/* Sección Derecha */}
            <div className="right-section">
                <div className="form-container">
                    <h2 className="form-title">Registra todos los campos</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" placeholder="Nombre completo" className="input-field" onChange={handleChange} />
                        <input type="email" name="email" placeholder="Email" className="input-field" onChange={handleChange} />
                        <input type="password" name="password" placeholder="Contraseña" className="input-field" onChange={handleChange} />
                        <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" className="input-field" onChange={handleChange} />
                        <button type="submit" className="submit-button">Registrarse</button>
                    </form>
                    
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    
                    <div className="sign-in-link-container">
                        ¿Ya tienes cuenta?
                        <a href="/auth/sign-in" className="sign-in-link">Inicia sesión</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
