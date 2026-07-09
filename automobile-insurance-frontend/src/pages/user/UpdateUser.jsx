import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import UserService from "../../services/UserService";
import "../../styles/Form.css";

function UpdateUser() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function loadUser() {
        setLoading(true);
        setError("");
        try {
            const response = await UserService.getUserById(id);
            setUser(response.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load this user.");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setUser({ ...user, [name]: name === "pan" ? value.toUpperCase() : value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const payload = {
                name: user.name,
                email: user.email,
                dob: user.dob,
                aadhaar: user.aadhaar,
                pan: user.pan,
                role: user.role,
            };

            // Only send a password if the admin actually typed a new one -
            // the backend keeps the existing hash otherwise.
            if (newPassword.trim().length > 0) {
                payload.password = newPassword;
            }

            await UserService.updateUser(id, payload);

            setSuccess("User updated successfully. Redirecting...");
            setTimeout(() => navigate("/users"), 1000);
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to update user."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Loader label="Loading user..." />
                <Footer />
            </>
        );
    }

    if (!user) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <ErrorMessage message={error || "User not found."} />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">Update User</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={user.name || ""}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={user.email || ""}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="password"
                        placeholder="New Password (leave blank to keep current)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <label className="field-label">Date of Birth</label>
                    <input
                        type="date"
                        name="dob"
                        value={user.dob || ""}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="aadhaar"
                        placeholder="Aadhaar Number (12 digits)"
                        value={user.aadhaar || ""}
                        onChange={handleChange}
                        maxLength={12}
                        required
                    />

                    <input
                        type="text"
                        name="pan"
                        placeholder="PAN"
                        value={user.pan || ""}
                        onChange={handleChange}
                        maxLength={10}
                        required
                    />

                    <label className="field-label">Role</label>
                    <select name="role" value={user.role || "CUSTOMER"} onChange={handleChange} required>
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>

                    <button className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Updating..." : "Update User"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default UpdateUser;
