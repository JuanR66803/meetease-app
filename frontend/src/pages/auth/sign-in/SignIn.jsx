import { NavLink } from "react-router-dom";
import "./SignIn.css";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

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
        <div className="sign-in">
            <h2>Inicia Sesión</h2>
            {redirectMessage && <p className="warning">{redirectMessage}</p>}
            <form onSubmit={handleSubmit}>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                <input type="email" name="email" placeholder="Email" onChange={handleChange} value={formData.email} />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} value={formData.password} />
                <button className="button" type="submit">Iniciar sesión</button>
            </form>
            <p>¿No tienes una cuenta? <NavLink className="sign-up-enlace" to="/auth/sign-up">Regístrate</NavLink></p>
        </div>
    );
};

export default SignIn;


