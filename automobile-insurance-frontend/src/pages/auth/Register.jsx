import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthService from "../../services/AuthService";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import PasswordStrengthMeter from "../../components/common/PasswordStrengthMeter";
import "../../styles/Form.css";

const AADHAAR_REGEX = /^\d{12}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function Register() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        dob: "",
        aadhaar: "",
        pan: "",
        address: "",
        
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm({
            ...form,
            [name]: name === "pan" ? value.toUpperCase() : value,
        });
    };

    const validate = () => {
        if (form.password.length < 6) {
            return "Password must be at least 6 characters long.";
        }
        if (form.password !== form.confirmPassword) {
            return "Passwords do not match.";
        }
        if (!AADHAAR_REGEX.test(form.aadhaar)) {
            return "Aadhaar must be exactly 12 digits.";
        }
        if (!PAN_REGEX.test(form.pan)) {
            return "PAN must be in the format ABCDE1234F.";
        }
        return "";
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        const validationError = validate();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);

        try {
            await AuthService.register({
                name: form.name,
                email: form.email,
                password: form.password,
                dob: form.dob,
                aadhaar: form.aadhaar,
                pan: form.pan,
                address: form.address,
                // Public self-registration always creates a CUSTOMER account.
                // Officer/Admin accounts are provisioned separately by an
                // existing admin via the Users module.
                role: "CUSTOMER",
            });

            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            const data = err.response?.data;
            if (data && typeof data === "object" && !data.message) {
                // Field validation error map from the backend, e.g. { email: "..." }
                const firstError = Object.values(data)[0];
                setError(firstError || "Registration failed.");
            } else {
                setError(data?.message || data || "Registration failed.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h2 className="title">Create an Account</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password (min 6 characters)"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <PasswordStrengthMeter password={form.password} />

                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm Password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                    />

                    <label className="field-label">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="aadhaar"
                        placeholder="Aadhaar Number (12 digits)"
                        value={form.aadhaar}
                        onChange={handleChange}
                        maxLength={12}
                        required
                    />

                    <input
                        type="text"
                        name="pan"
                        placeholder="PAN (e.g. ABCDE1234F)"
                        value={form.pan}
                        onChange={handleChange}
                        maxLength={10}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />

                    <button className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Registering..." : "Register"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
