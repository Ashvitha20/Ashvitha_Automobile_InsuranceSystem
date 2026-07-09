import { Link } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

function NotFound() {
    return (
        <>
            <Navbar />
            <div className="container" style={{ textAlign: "center", padding: "80px 20px" }}>
                <h1>404</h1>
                <p>The page you're looking for doesn't exist.</p>
                <Link to="/" className="btn btn-primary">Go Home</Link>
            </div>
            <Footer />
        </>
    );
}

export default NotFound;
