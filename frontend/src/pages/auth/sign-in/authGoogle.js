// authGoogle.js
export const authGoogle = async (firebaseUser) => {
    try {
        // Obtiene el token de autenticación de Firebase
        const token = await firebaseUser.getIdToken();

        // Crea los datos que se enviarán al backend
        const userData = {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            password: crypto.randomUUID(), 
            image_url: firebaseUser.photoURL,
        };

        // Envío de solicitud al backend para registrar o actualizar el usuario con Google
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/google`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        // Manejo de respuesta
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Error al registrar con Google");
        }

        // Retorna el usuario recibido del backend
        return { success: true, user: data.user };

    } catch (error) {
        console.error("❌ Error en authGoogle:", error);
        return { success: false, error: error.message };
    }
};
export default authGoogle;