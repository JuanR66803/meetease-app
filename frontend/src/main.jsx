import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/home/Home.jsx";
import Layout from "./layout/Layout.jsx";
import SignIn from "./pages/auth/sign-in/SignIn.jsx";
import SignUp from "./pages/auth/sign-up/SignUp.jsx";
import Event from "./pages/events/Event.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <Layout>
        <Routes>
          <Route index path="/" element={<Home />} />

          {/* Rutas protegidas */}
          <Route path="event" element={<ProtectedRoute />}>
            <Route path="register" element={<Event />} />
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

