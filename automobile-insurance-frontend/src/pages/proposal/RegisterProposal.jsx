import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import ProposalService from "../../services/ProposalService";
import PolicyService from "../../services/PolicyService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Form.css";

function RegisterProposal() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedPolicyId = searchParams.get("policyId") || "";

    const [policies, setPolicies] = useState([]);
    const [loadingPolicies, setLoadingPolicies] = useState(true);

    const [form, setForm] = useState({
        policyId: preselectedPolicyId,
        vehicleNumber: "",
        vehicleModel: "",
        vehicleYear: new Date().getFullYear(),
    });

    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadPolicies();
    }, []);

    async function loadPolicies() {
        setLoadingPolicies(true);
        try {
            const response = await PolicyService.getAllPolicies();
            setPolicies(response.data.filter((p) => (p.status || "").toUpperCase() === "ACTIVE"));
        } catch (err) {
            console.log(err);
            setError("Unable to load available policies.");
        } finally {
            setLoadingPolicies(false);
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

        if (!agreedToTerms) {
            setError("Please accept the Terms and Conditions before submitting.");
            return;
        }

        setSubmitting(true);

        try {
            await ProposalService.createProposal({
                userId: user.userId,
                policyId: Number(form.policyId),
                vehicleNumber: form.vehicleNumber,
                vehicleModel: form.vehicleModel,
                vehicleYear: Number(form.vehicleYear),
                proposalStatus: "PROPOSAL_SUBMITTED",
            });

            setSuccess("Proposal submitted successfully! Redirecting...");
            setTimeout(() => navigate("/proposals"), 1000);
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to submit proposal."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingPolicies) {
        return (
            <>
                <Navbar />
                <Loader label="Loading policies..." />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">Submit Insurance Proposal</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                {policies.length === 0 ? (
                    <p className="empty-state">
                        No active policies are available to apply for right now.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit}>

                        <label className="field-label">Policy</label>
                        <select
                            name="policyId"
                            value={form.policyId}
                            onChange={handleChange}
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
                            placeholder="Vehicle Number (e.g. TN01AB1234)"
                            value={form.vehicleNumber}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="vehicleModel"
                            placeholder="Vehicle Model"
                            value={form.vehicleModel}
                            onChange={handleChange}
                            required
                        />

                        <label className="field-label">Vehicle Year</label>
                        <input
                            type="number"
                            name="vehicleYear"
                            placeholder="Vehicle Year"
                            value={form.vehicleYear}
                            onChange={handleChange}
                            min="2000"
                            max={new Date().getFullYear()}
                            required
                        />

                        <div className="terms-box">
                            <p className="terms-title">Terms &amp; Conditions</p>
                            <div className="terms-text">
                                <p>
                                    1. The information provided in this proposal is true and
                                    complete to the best of the applicant's knowledge.
                                </p>
                                <p>
                                    2. Coverage under this policy begins only after the quoted
                                    premium has been paid in full and the policy status is
                                    marked as Active.
                                </p>
                                <p>
                                    3. Any false or misleading information provided may result
                                    in rejection of the proposal or cancellation of an active
                                    policy without refund.
                                </p>
                                <p>
                                    4. Claims will only be considered for incidents that occur
                                    while the policy status is Active, and are subject to
                                    review and approval by the insurance team.
                                </p>
                                <p>
                                    5. The applicant agrees to promptly notify the insurer of
                                    any change in vehicle ownership, usage, or condition that
                                    may affect this policy.
                                </p>
                                <p>
                                    6. This policy is subject to renewal at the insurer's
                                    discretion and may be revised based on updated risk
                                    assessment at the time of renewal.
                                </p>
                            </div>

                            <label className="terms-checkbox-row">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    required
                                />
                                I have read and agree to the Terms and Conditions above.
                            </label>
                        </div>

                        <button className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Proposal"}
                        </button>
                    </form>
                )}
            </div>

            <Footer />
        </>
    );
}

export default RegisterProposal;