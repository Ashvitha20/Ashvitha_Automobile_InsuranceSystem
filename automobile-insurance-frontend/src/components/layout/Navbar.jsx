import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/images/logo.png";
import "../../styles/Navbar.css";

function Navbar() {

    const { isAuthenticated, user, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav>

            {/* Logo & Company Name */}
            <div className="nav-brand">
                <img
                    src={logo}
                    alt="FortiSure Insurance"
                    className="nav-logo"
                />

                <div className="nav-company">
                    <h2>FORTISURE</h2>
                    <span>INSURANCE</span>
                </div>
            </div>

            {/* Existing Links - UNCHANGED */}
            <Link to="/">Home</Link>

            {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}

            {isAuthenticated && <Link to="/policies">Policies</Link>}

            {isAuthenticated && <Link to="/proposals">Proposals</Link>}

            {isAuthenticated && <Link to="/quotes">Quotes</Link>}

            {isAuthenticated && <Link to="/payments">Payments</Link>}

            {isAuthenticated && <Link to="/claims">Claims</Link>}

            {isAuthenticated && <Link to="/documents">Documents</Link>}
            
            {isAuthenticated && <Link to="/profile">My Profile</Link>}

            {isAuthenticated && hasRole("ADMIN") && (
                <Link to="/users">Users</Link>
            )}

            <span className="nav-spacer" />

            {isAuthenticated ? (
                <span className="nav-user">
                    <span className="nav-user-name">
                        {user?.name} ({user?.role})
                    </span>

                    <button
                        className="nav-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </span>
            ) : (
                <span className="nav-user">
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </span>
            )}

        </nav>
    );
}

export default Navbar;