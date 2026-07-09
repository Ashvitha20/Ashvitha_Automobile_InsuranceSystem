import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import ClaimService from "../../services/ClaimService";
import ProposalService from "../../services/ProposalService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Form.css";

function RegisterClaim() {

    const { user } = useAuth();
    const navigate = useNavigate();

    const [proposals, setProposals] = useState([]);
    const [loadingProposals, setLoadingProposals] = useState(true);

    const [form, setForm] = useState({
        proposalId: "",
        claimDescription: "",
        claimAmount: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProposals();
    }, []);

    async function loadProposals() {
        setLoadingProposals(true);
        try {
            const response = await ProposalService.getAllProposals();
            // Only the logged-in user's ACTIVE policies are claimable.
            setProposals(
                response.data.filter(
                    (p) =>
                        p.user?.userId === user?.userId &&
                        (p.proposalStatus || "").toUpperCase() === "ACTIVE"
                )
            );
        } catch (err) {
            console.log(err);
            setError("Unable to load your active policies.");
        } finally {
            setLoadingProposals(false);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            await ClaimService.raiseClaim({
                proposalId: Number(form.proposalId),
                claimDescription: form.claimDescription,
                claimAmount: Number(form.claimAmount),
            });

            setSuccess("Claim submitted successfully! Redirecting...");
            setTimeout(() => navigate("/claims"), 1000);
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to submit claim."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingProposals) {
        return (
            <>
                <Navbar />
                <Loader label="Loading your policies..." />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">Raise a Claim</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                {proposals.length === 0 ? (
                    <p className="empty-state">
                        You don't have any active policies to raise a claim against.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit}>

                        <label className="field-label">Policy / Vehicle</label>
                        <select
                            name="proposalId"
                            value={form.proposalId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a Policy</option>
                            {proposals.map((proposal) => (
                                <option key={proposal.proposalId} value={proposal.proposalId}>
                                    {proposal.vehicleModel} ({proposal.vehicleNumber}) - {proposal.policy?.policyName}
                                </option>
                            ))}
                        </select>

                        <textarea
                            name="claimDescription"
                            placeholder="Describe what happened..."
                            value={form.claimDescription}
                            onChange={handleChange}
                            rows="4"
                            required
                        />

                        <input
                            type="number"
                            name="claimAmount"
                            placeholder="Claim Amount (₹)"
                            value={form.claimAmount}
                            onChange={handleChange}
                            min="1000"
                            required
                        />

                        <button className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Claim"}
                        </button>
                    </form>
                )}
            </div>

            <Footer />
        </>
    );
}

export default RegisterClaim;
