import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import UserService from "../../services/UserService";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import PasswordStrengthMeter from "../../components/common/PasswordStrengthMeter";
import "../../styles/Form.css";

const AADHAAR_REGEX = /^\d{12}$/;
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

function RegisterUser() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        dob: "",
        aadhaar: "",
        pan: "",
        address: "",
        role: "CUSTOMER",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: name === "pan" ? value.toUpperCase() : value });
    };

    const validate = () => {
        if (form.password.length < 6) {
            return "Password must be at least 6 characters long.";
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
            await UserService.registerUser(form);
            setSuccess("User added successfully! Redirecting...");
            setTimeout(() => navigate("/users"), 1000);
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to add user."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">Add User</h2>

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

                    <label className="field-label">Role</label>
                    <select name="role" value={form.role} onChange={handleChange} required>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    <button className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Saving..." : "Add User"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default RegisterUser;
