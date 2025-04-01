import "./Home.css"
import { NavLink } from "react-router";


const Home = () =>{
        return (
            <>
                <div className="Card_container">
                    <div className="text-container"> {/* Nueva div para agrupar los elementos */}
                        <h1 className="titulo">Bienvenido a MeetEase, tu mejor compañero para crear historia</h1>
                        <img src="https://cdn-icons-png.flaticon.com/512/2693/2693507.png" alt="logo" className="logoHome"/>
                        <p className="presentacion">Gestiona tus eventos, nosotros te ayudamos, únete a una gran comunidad y reserva ahora...</p>
                    </div>
                    <div className="img-container"> {/* Nueva div para agrupar los elementos */}
                        <NavLink className="button-start"to="/auth/sign-up"end> ¡Comienza Ahora!</NavLink>
                    </div>
                </div>
            </>
        );
}
    
export default Home;