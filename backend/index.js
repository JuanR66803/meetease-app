import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js"

dotenv.config(); // Cargar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// 🔹 Validar variable de entorno DATABASE_URI
if (!process.env.DATABASE_URI) {
    console.error("❌ ERROR: La variable de entorno DATABASE_URI no está definida.");
    process.exit(1);
}

// 🔹 Middlewares
app.use(express.json());

// 🔹 Configuración de CORS
app.use(cors({
    origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

// 🔹 Definir rutas
app.use("/api", authRoutes);
app.use("/api/events", eventRoutes); 
app.use("/api/users", userRoutes);
app.use("/api/ticket", ticketRoutes);

// 🔹 Ruta de prueba
app.get("/", (req, res) => {
    res.json({ message: "MeetEase Backend funcionando correctamente 🚀" });
});

// 🔹 Manejo de rutas no encontradas
app.use((req, res, next) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

// 🔹 Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Ocurrió un error en el servidor", 
        error: process.env.NODE_ENV === "development" ? err.message : {} 
    });
});

// 🔹 Iniciar servidor
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
        console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    });
}

export default app;
