import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ErrorMessage from "../../components/common/ErrorMessage";
import "../../styles/Form.css";

function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [credentials, setCredentials] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        setCredentials({
            ...credentials,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSubmitting(true);

        try {
            await login(credentials);
            const redirectTo = location.state?.from?.pathname || "/dashboard";
            navigate(redirectTo, { replace: true });
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Invalid email or password.";
            setError(typeof message === "string" ? message : "Login failed.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="title">
    Welcome Back
</h2>
<p className="login-subtitle">
    Sign in to your FortiSure Insurance account
</p>

                <ErrorMessage message={error} />

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={credentials.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleChange}
                        required
                    />

                    <button className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-switch">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>

                <p className="auth-switch">
                    Don&apos;t have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
