import { NavLink } from "react-router-dom";
import "./SignIn.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const SignIn = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Mensaje si el usuario es redirigido desde una ruta protegida
    const redirectMessage = location.state?.message || "";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!formData.email || !formData.password) {
            return setError("Todos los campos son obligatorios.");
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al iniciar sesión.");
            }

            login(data.user); // Guardar usuario en el contexto de autenticación
            setSuccess("Iniciando sesión. Redirigiendo...");
            setTimeout(() => navigate("/"), 1500);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="sign-in-container">
            <div className="right-section-in">
                <h2>Inicia Sesión</h2>
                {redirectMessage && <p className="warning-message-in">{redirectMessage}</p>}
                <form onSubmit={handleSubmit} className="form-container-in">
                    {error && <p className="error-message-in">{error}</p>}
                    {success && <p className="success-message-in">{success}</p>}
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} className="input-field-in" />
                    <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} value={formData.password} className="input-field-in" />
                    <button className="submit-button-in" type="submit">Iniciar sesión</button>
                </form>
                <p className="sign-up-link-container-in">
                    ¿No tienes una cuenta? <NavLink className="sign-up-link-in" to="/auth/sign-up">Regístrate</NavLink>
                </p>
            </div>
            <div className="left-section-in">
                <div className="text-center-in">
                    <h1>Inicia sesión</h1>
                    <p>Bienvenido, es hora de explorar que tenemos de nuevo para ti</p>
                    <p>Inicia sesión con una de las siguientes opciones</p>               
                    <div className="auth-buttons-in">
                        <button className="auth-button google-button-in">
                            <FcGoogle className="icon-in" />
                            Continuar con Google
                        </button>
                        <button className="auth-button facebook-button-in">
                            <FaFacebook className="icon-in" />
                            Continuar con Facebook
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;


