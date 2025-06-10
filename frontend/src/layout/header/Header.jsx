import "./Header.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import useAuthStore from "../../stores/useAuthStore";
import { color } from "@cloudinary/url-gen/qualifiers/background";

const Header = () => {
    // Ambos sistemas de autenticación
    const { userLogged, logoutAuth } = useAuthStore();
    const { user, logout } = useAuth();
    
    // Estado para manejar el menú móvil
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);
    
    // Determinar si hay un usuario autenticado por cualquiera de los métodos
    const isAuthenticated = user || userLogged;
    
    // Función que maneja el cierre de sesión de cualquier tipo
    const handleLogout = () => {
        if (user) {
            logout();
        }
        if (userLogged) {
            logoutAuth();
        }
        setMenuOpen(false);
    };
    
    // Cierra el menú si se hace clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-menu") && !event.target.closest(".hamburger-menu")) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [menuOpen]);
    
    return (
        <header>
            <nav className="nav">
                <img src="/Logo.png" className="logo" alt="logo" />
                <NavLink className="enlace" to={"/feed"}>Explorar eventos</NavLink>
                <NavLink className="enlace" to="/event/register" end>Crear Eventos</NavLink>
                <div className="box-buttom">
                    {isAuthenticated ? (
                        <>
                            {/* Botón de menú hamburguesa con ícono */}
                            <button className={`hamburger-menu ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
                                {menuOpen ? <FaTimes style={{fontSize:'20px',color:'#fff'}} /> : <FaBars style={{fontSize:'20px',color:'#fff'}}/>}
                            </button>
                            {/* Menú desplegable con animación */}
                            <div className={`dropdown-menu ${menuOpen ? "show" : ""}`}>
                                <NavLink className="dropdown-item" to="user/profile" onClick={() => setMenuOpen(false)}>
                                    Perfil
                                </NavLink>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Cerrar sesión
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <NavLink className="sign-inButton" to="/auth/sign-in" end>Iniciar sesión</NavLink>
                            <NavLink className="sign-upButton" to="/auth/sign-up" end>Registrarse</NavLink>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;