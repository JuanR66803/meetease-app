import { NavLink } from "react-router-dom";
import "./SignIn.css";
import { useCallback, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import useAuthStore from "../../../stores/useAuthStore";
import authGoogle from "./authGoogle";

const SignIn = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { loginGoogleWithPopUp, loginFacebookWithPopUp } = useAuthStore();
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
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Error al iniciar sesión.");
            }

            login(data.user); // Guardar usuario en el contexto de autenticación
            setSuccess("Iniciando sesión. Redirigiendo...");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogle = useCallback(async () => {
        try {
            const userCredential = await loginGoogleWithPopUp();
            // Pasamos directamente el usuario de Firebase Auth a nuestra función authGoogle
            if (userCredential && userCredential.user) {
                const result = await authGoogle(userCredential.user);

                if (result.success) {
                    console.log('Usuario registrado/autenticado con éxito:', result.user);
                    login(result.user);
                    navigate("/");
                } else {
                    console.error('Error en el registro con Google:', result.error);
                    setError("Error al procesar el inicio de sesión con Google: " + result.error);
                }
            } else {
                throw new Error("No se pudo obtener la información del usuario de Google");
            }
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
            setError(`Error al iniciar sesión con Google: ${error.message}`);
        }
    }, [loginGoogleWithPopUp, navigate, login]);

    const handleFacebook = useCallback(async () => {
        try {
            const userCredential = await loginFacebookWithPopUp();
            // Asegurémonos de tener un usuario y actualizamos el contexto
            if (userCredential && userCredential.user) {
                // Si necesitas procesar el usuario, similar a Google
                login(userCredential.user);
                navigate("/");
            } else {
                throw new Error("No se pudo obtener la información del usuario de Facebook");
            }
        } catch (error) {
            console.error('Error al iniciar sesión con Facebook:', error);
            setError(`No se pudo iniciar sesión con Facebook: ${error.message}`);
        }
    }, [loginFacebookWithPopUp, navigate, login]);

    return (
        <div className="sign-in-container">
            <div className="right-section-in">
                <h2>Inicia Sesión</h2>
                {redirectMessage && (
                    <p className="warning-message-in">{redirectMessage}</p>
                )}
                <form onSubmit={handleSubmit} className="form-container-in">
                    {error && <p className="error-message-in">{error}</p>}
                    {success && <p className="success-message-in">{success}</p>}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        value={formData.email}
                        className="input-field-in"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                        value={formData.password}
                        className="input-field-in"
                    />
                    <button className="submit-button-in" type="submit">
                        Iniciar sesión
                    </button>
                </form>
                <p className="sign-up-link-container-in">
                    ¿No tienes una cuenta?{' '}
                    <NavLink className="sign-up-link-in" to="/auth/sign-up">
                        Regístrate
                    </NavLink>
                </p>
            </div>

            <div className="left-section-in">
                <div className="text-center-in">
                    <h1>Inicia sesión</h1>
                    <p>Bienvenido, es hora de explorar qué tenemos de nuevo para ti</p>
                    <p>Inicia sesión con una de las siguientes opciones</p>
                    <div className="auth-buttons-in">
                        <button
                            onClick={handleGoogle}
                            className="auth-button google-button-in"
                        >
                            <FcGoogle className="icon-in" />
                            Continuar con Google
                        </button>
                        <button
                            onClick={handleFacebook}
                            className="auth-button facebook-button-in"
                        >
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