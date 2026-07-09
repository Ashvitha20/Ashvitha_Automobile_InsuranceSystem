import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import ProposalService from "../../services/ProposalService";
import PolicyService from "../../services/PolicyService";
import "../../styles/Form.css";

function UpdateProposal() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [proposal, setProposal] = useState(null);
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    async function loadData() {
        setLoading(true);
        setError("");
        try {
            const [proposalRes, policyRes] = await Promise.all([
                ProposalService.getProposalById(id),
                PolicyService.getAllPolicies(),
            ]);
            setProposal(proposalRes.data);
            setPolicies(policyRes.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load this proposal.");
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProposal({ ...proposal, [name]: value });
    };

    const handlePolicyChange = (event) => {
        const policyId = Number(event.target.value);
        const selectedPolicy = policies.find((p) => p.policyId === policyId);
        setProposal({ ...proposal, policy: selectedPolicy });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            await ProposalService.updateProposal(id, {
                userId: proposal.user.userId,
                policyId: proposal.policy.policyId,
                vehicleNumber: proposal.vehicleNumber,
                vehicleModel: proposal.vehicleModel,
                vehicleYear: Number(proposal.vehicleYear),
                proposalStatus: proposal.proposalStatus,
            });

            setSuccess("Proposal updated successfully. Redirecting...");
            setTimeout(() => navigate("/proposals"), 1000);
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to update proposal."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Loader label="Loading proposal..." />
                <Footer />
            </>
        );
    }

    if (!proposal) {
        return (
            <>
                <Navbar />
                <div className="container">
                    <ErrorMessage message={error || "Proposal not found."} />
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">Update Proposal</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                <form onSubmit={handleSubmit}>

                    <label className="field-label">Policy</label>
                    <select
                        value={proposal.policy?.policyId || ""}
                        onChange={handlePolicyChange}
                        required
                    >
                        <option value="">Select a Policy</option>
                        {policies.map((policy) => (
                            <option key={policy.policyId} value={policy.policyId}>
                                {policy.policyName} - {policy.vehicleType} (₹{policy.basePremium}/yr)
                            </option>
                        ))}
                    </select>

                    <input
                        type="text"
                        name="vehicleNumber"
                        placeholder="Vehicle Number"
                        value={proposal.vehicleNumber || ""}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="vehicleModel"
                        placeholder="Vehicle Model"
                        value={proposal.vehicleModel || ""}
                        onChange={handleChange}
                        required
                    />

                    <label className="field-label">Vehicle Year</label>
                    <input
                        type="number"
                        name="vehicleYear"
                        placeholder="Vehicle Year"
                        value={proposal.vehicleYear || ""}
                        onChange={handleChange}
                        min="2000"
                        max={new Date().getFullYear()}
                        required
                    />

                    <button className="btn btn-primary" disabled={submitting}>
                        {submitting ? "Updating..." : "Update Proposal"}
                    </button>
                </form>
            </div>

            <Footer />
        </>
    );
}

export default UpdateProposal;
