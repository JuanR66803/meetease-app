import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useAuthStore from "../stores/useAuthStore";

const ProtectedRoute = () => {
    const { userLogged } = useAuthStore();
    const { user } = useAuth();
    const location = useLocation();

    if (!user && userLogged==null)
    {
        return <Navigate to="/auth/sign-in" state={{ from: location, message: "Debes iniciar sesión para acceder a esta página." }} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
