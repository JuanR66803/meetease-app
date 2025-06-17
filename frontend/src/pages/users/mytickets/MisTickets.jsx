import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const MisTickets = () => {
    const [params] = useSearchParams();
    const paymentStatus = params.get("payment");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (paymentStatus === "success") {
            setMessage("✅ Pago exitoso. Tus tickets están disponibles.");
            // Aquí puedes hacer una petición para actualizar el estado del pedido o mostrar los tickets.
        } else if (paymentStatus === "cancel") {
            setMessage("❌ El pago fue cancelado. No se generaron tickets.");
        } else {
            setMessage("ℹ️ Aquí verás el estado de tus tickets.");
        }
    }, [paymentStatus]);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Mis Tickets</h2>
            <div
                style={{
                    marginTop: "1rem",
                    padding: "1rem",
                    backgroundColor:
                        paymentStatus === "success"
                            ? "#d4edda"
                            : paymentStatus === "cancel"
                                ? "#f8d7da"
                                : "#e2e3e5",
                    color:
                        paymentStatus === "success"
                            ? "#155724"
                            : paymentStatus === "cancel"
                                ? "#721c24"
                                : "#383d41",
                    borderRadius: "8px",
                }}
            >
                {message}
            </div>
        </div>
    );
};

export default MisTickets;
