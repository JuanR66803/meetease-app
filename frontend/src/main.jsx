import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/home/Home.jsx";
import Layout from "./layout/Layout.jsx";
import SignIn from "./pages/auth/sign-in/SignIn.jsx";
import SignUp from "./pages/auth/sign-up/SignUp.jsx";
import Event from "./pages/events/create_event/Event.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext";
import Dashboard_user from "./pages/users/dashboard/Dashboard_user.jsx";
import MisTickets from "./pages/users/mytickets/MisTickets.jsx";

import 'leaflet/dist/leaflet.css';
import Feed from "./pages/events/feed/feed.jsx";


createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Layout>
        <Routes>
          <Route index path="/" element={<Feed />} />
          {/* Rutas protegidas */}
          <Route path="event" element={<ProtectedRoute />}>
            <Route path="register" element={<Event />} />

          </Route>
          <Route path="user" element={<ProtectedRoute />}>
            <Route path="profile" element={<Dashboard_user />} />
            <Route path="settings" element={<h1>Configuración</h1>} />
            <Route path="mis-tickets" element={<MisTickets />} /> {/* ✅ Nueva ruta */}
          </Route>

          {/* Rutas públicas */}
          <Route path="auth">
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
          </Route>

          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Layout>
    </AuthProvider>
  </BrowserRouter>
);

