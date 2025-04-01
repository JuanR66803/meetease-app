import "./Header.css";
import { NavLink } from "react-router-dom"; // Corregido 'react-router' a 'react-router-dom'
import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const { user, logout } = useAuth(); // Obtenemos el usuario y la función de cerrar sesión

    return (
        <header>
            <nav className="nav">
                <img src="/Logo.png" className="logo" alt="logo" />
                <NavLink className="enlace" to="/" end>
                    Inicio
                </NavLink>
                <NavLink className="enlace" to="/event/register" end>
                    Eventos
                </NavLink>

                <div className="box-buttom">
                    {user ? (
                        <>
                            <span className="user-name">Hola, {user.name}</span>
                            <button className="logout-button" onClick={logout}>
                                Cerrar sesión
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink className="sign-inButton" to="/auth/sign-in" end>
                                Iniciar sesión
                            </NavLink>
                            <NavLink className="sign-upButton" to="/auth/sign-up" end>
                                Registrarse
                            </NavLink>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;
