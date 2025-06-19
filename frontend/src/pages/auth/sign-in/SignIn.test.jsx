import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import SignIn from "./SignIn";
import { AuthProvider } from "../../../context/AuthContext";

const renderComponent = (routeState = {}) =>
  render(
    <BrowserRouter>
      <AuthProvider>
        <SignIn location={{ state: routeState }} />
      </AuthProvider>
    </BrowserRouter>
  );

  
describe("SignIn", () => {
  test("email y contraseña", () => {
    renderComponent();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/contraseña/i)).toBeInTheDocument();
  });
  test("iniciar sesión", () => {
    renderComponent();
    expect(screen.getByRole("button", { name: /iniciar sesión/i })).toBeInTheDocument();
  });
  test("Google y Facebook", () => {
    renderComponent();
    expect(screen.getByText(/continuar con google/i)).toBeInTheDocument();
    expect(screen.getByText(/continuar con facebook/i)).toBeInTheDocument();
  });
  test("enlace de registro", () => {
    renderComponent();
    expect(screen.getByText(/¿no tienes una cuenta/i)).toBeInTheDocument();
    expect(screen.getByText(/regístrate/i)).toBeInTheDocument();
  });

  test("Inicia Sesión", () => {
    renderComponent();
    expect(screen.getAllByText(/inicia sesión/i).length).toBeGreaterThan(0);
  });
  test("muestra mensaje de error si se envía formulario vacío", () => {           
    renderComponent();
    fireEvent.click(screen.getByRole("button", { name: /iniciar sesión/i }));
    expect(screen.getByText(/todos los campos son obligatorios/i)).toBeInTheDocument();
  });

  test("muestra textos informativos del lado izquierdo", () => {
    renderComponent();
    expect(screen.getByText(/es hora de explorar/i)).toBeInTheDocument();
    expect(screen.getByText(/una de las siguientes opciones/i)).toBeInTheDocument();
  });
});
