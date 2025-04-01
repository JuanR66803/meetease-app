import EventForm from "./EventForm";
import "./Event.css"; 

const Event = () => {
    return (
        <div className="event-container">
            <div className="left-section">
                <h2>Crear un Evento</h2>
                <p>Registra tu evento con los detalles necesarios</p>
            </div>

            <div className="right-section">
                <h2>Completa todos los campos</h2>
                <EventForm />
            </div>
        </div>
    );
};

export default Event;
