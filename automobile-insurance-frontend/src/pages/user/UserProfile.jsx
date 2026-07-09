import { useEffect, useState } from "react";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import UserService from "../../services/UserService";
import "../../styles/Form.css";

function UserProfile() {

    const [profile, setProfile] = useState(null);
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        setLoading(true);
        setError("");
        try {
            const response = await UserService.getMyProfile();
            setProfile(response.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load your profile.");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProfile({ ...profile, [name]: name === "pan" ? value.toUpperCase() : value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const payload = {
                name: profile.name,
                email: profile.email,
                dob: profile.dob,
                aadhaar: profile.aadhaar,
                pan: profile.pan,
                address: profile.address,
                role: profile.role,
            };

            // Only send a password if the user actually typed a new one -
            // the backend keeps the existing hash otherwise.
            if (newPassword.trim().length > 0) {
                payload.password = newPassword;
            }

            const response = await UserService.updateMyProfile(payload);
            setProfile(response.data);
            setNewPassword("");
            setSuccess("Profile updated successfully.");
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to update your profile."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Loader label="Loading your profile..." />
                <Footer />
            </>
        );
    }

    if (!profile) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <ErrorMessage message={error || "Profile not found."} />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">My Profile</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={profile.name || ""}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={profile.email || ""}
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
                        value={profile.dob || ""}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="aadhaar"
                        placeholder="Aadhaar Number (12 digits)"
                        value={profile.aadhaar || ""}
                        onChange={handleChange}
                        maxLength={12}
                        required
                    />

                    <input
                        type="text"
                        name="pan"
                        placeholder="PAN"
                        value={profile.pan || ""}
                        onChange={handleChange}
                        maxLength={10}
                        required
                    />

                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={profile.address || ""}
                        onChange={handleChange}
                        required
                    />

                    <label className="field-label">Role</label>
                    <input
                        type="text"
                        value={profile.role || ""}
                        disabled
                    />

                    <button className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default UserProfile;