import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Ajusta la importación

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth;



