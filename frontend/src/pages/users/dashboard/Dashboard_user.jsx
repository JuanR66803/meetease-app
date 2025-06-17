import { useState } from "react";
import { FaEdit, FaUser, FaCalendarAlt, FaHeart, FaCog } from "react-icons/fa";
import { TiTicket } from "react-icons/ti";
import { LuTickets } from "react-icons/lu";
import "./Dashboard_user.css";
import { useAuth } from "../../../context/AuthContext";
import Profile from "./menu-item/profile/profile"; // Asegúrate de tener este componente si lo usas
import Reservas from "./menu-item/reservas/reservas";
import Tickets from "./menu-item/mis-tickets/tickets";

const Dashboard_user = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "events":
        return <div>Eventos creados (próximamente)</div>;
      case "favorites":
        return <div>Favoritos (próximamente)</div>;
      case "config":
        return <div>Configuración (próximamente)</div>;
      case "reservas":
        return <Reservas />
      case "mis tickets":
        return <Tickets />
      default:
        return <div>Selecciona una opción del menú</div>;
    }
  };

  return (
    <div className="dashboard-user">
      <div className="dashboard-card">
        {/* Menú lateral */}
        <div className="menu-panel">
          <ul>
            <li
              className={`menu-item ${activeTab === "profile" ? "active" : ""}`}
              onClick={() => setActiveTab("profile")}
            >
              <FaUser className="menu-icon" />
              Perfil
            </li>
            <li
              className={`menu-item ${activeTab === "events" ? "active" : ""}`}
              onClick={() => setActiveTab("events")}
            >
              <FaCalendarAlt className="menu-icon" />
              Eventos Creados
            </li>
            <li
              className={`menu-item ${activeTab === "favorites" ? "active" : ""}`}
              onClick={() => setActiveTab("favorites")}
            >
              <FaHeart className="menu-icon" />
              Favoritos
            </li>
            <li
              className={`menu-item ${activeTab === "reservas" ? "active" : ""}`}
              onClick={() => setActiveTab("reservas")}
            >
              <TiTicket className="menu-icon" />
              Reservas
            </li>
            <li
              className={`menu-item ${activeTab === "mis tickets" ? "active" : ""}`}
              onClick={() => setActiveTab("mis tickets")}
            >
              <LuTickets className="menu-icon"/>
              Mis tickets
            </li>
            <li
              className={`menu-item ${activeTab === "config" ? "active" : ""}`}
              onClick={() => setActiveTab("config")}
            >
              <FaCog className="menu-icon" />
              Configuración
            </li>
          </ul>
        </div>

        {/* Panel de contenido principal */}
        <div className="user-panel">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard_user;
