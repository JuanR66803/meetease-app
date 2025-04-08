import "./Header.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa"; // Íconos de React Icons

const Header = () => {
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen(!menuOpen);

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
                <NavLink className="enlace" to="/" end>Inicio</NavLink>
                <NavLink className="enlace" to="/event/register" end>Eventos</NavLink>

                <div className="box-buttom">
                    {user ? (
                        <>
                            {/* Botón de menú hamburguesa con ícono */}
                            <button className={`hamburger-menu ${menuOpen ? "active" : ""}`} onClick={toggleMenu}>
                                {menuOpen ? <FaTimes /> : <FaBars />}
                            </button>

                            {/* Menú desplegable con animación */}
                            <div className={`dropdown-menu ${menuOpen ? "show" : ""}`}>
                                <NavLink className="dropdown-item" to="user/profile" onClick={() => setMenuOpen(false)}>
                                    Perfil
                                </NavLink>
                                <button className="dropdown-item" onClick={logout}>
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
