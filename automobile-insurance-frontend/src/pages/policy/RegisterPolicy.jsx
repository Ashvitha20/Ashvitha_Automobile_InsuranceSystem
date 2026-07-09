import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import PolicyService from "../../services/PolicyService";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import "../../styles/Form.css";

function RegisterPolicy() {

    const navigate = useNavigate();

    const [policy, setPolicy] = useState({
        policyName: "",
        vehicleType: "",
        coverageDetails: "",
        basePremium: "",
        status: "ACTIVE",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPolicy({ ...policy, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            await PolicyService.addPolicy({
                ...policy,
                basePremium: Number(policy.basePremium),
            });

            setSuccess("Policy added successfully. Redirecting...");
            setTimeout(() => navigate("/policies"), 1000);
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to add policy."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">Register Policy</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="policyName"
                        placeholder="Policy Name"
                        value={policy.policyName}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="vehicleType"
                        value={policy.vehicleType}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Vehicle Type</option>
                        <option value="CAR">CAR</option>
                        <option value="BIKE">MOTORCYCLE</option>
                        <option value="TRUCK">TRUCK</option>
                        <option value="CAMPER_VAN">CAMPER VAN</option>
                    </select>

                    <input
                        type="text"
                        name="coverageDetails"
                        placeholder="Coverage Details"
                        value={policy.coverageDetails}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="number"
                        name="basePremium"
                        placeholder="Base Premium (₹)"
                        value={policy.basePremium}
                        onChange={handleChange}
                        min="1000"
                        required
                    />

                    <select
                        name="status"
                        value={policy.status}
                        onChange={handleChange}
                        required
                    >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                    </select>

                    <button className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Saving..." : "Save Policy"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default RegisterPolicy;
