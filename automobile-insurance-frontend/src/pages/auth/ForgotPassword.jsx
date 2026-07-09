import { useState } from "react";
import { Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import "../../styles/Form.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const response = await AuthService.forgotPassword(email);
            setSuccess(
                response.data?.message ||
                "If an account exists for that email, a temporary password has been sent to it."
            );
        } catch (err) {
            console.log(err);
            setError("Unable to process your request right now. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="title">Forgot Password</h2>
                <p className="auth-hint">
                    Enter the email address on your account and we'll send you a
                    temporary password you can log in with.
                </p>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Sending..." : "Send Temporary Password"}
                    </button>
                </form>

                <p className="auth-switch">
                    Remembered your password? <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;
