import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import QuoteService from "../../services/QuoteService";
import ProposalService from "../../services/ProposalService";
import "../../styles/Form.css";

function RegisterQuote() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedProposalId = searchParams.get("proposalId") || "";

    const [proposals, setProposals] = useState([]);
    const [loadingProposals, setLoadingProposals] = useState(true);

    const [form, setForm] = useState({
        proposalId: preselectedProposalId,
        premiumAmount: "",
        addOns: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [calculating, setCalculating] = useState(false);

    useEffect(() => {
        loadProposals();
    }, []);

    async function loadProposals() {
        setLoadingProposals(true);
        try {
            const response = await ProposalService.getAllProposals();
            // Only proposals approved and awaiting a quote are eligible.
            setProposals(
                response.data.filter(
                    (p) => (p.proposalStatus || "").toUpperCase() === "QUOTE_GENERATED"
                )
            );
        } catch (err) {
            console.log(err);
            setError("Unable to load proposals awaiting a quote.");
        } finally {
            setLoadingProposals(false);
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    async function handleAutoGenerate() {
        setError("");
        setSuccess("");

        if (!form.proposalId) {
            setError("Please select a proposal first.");
            return;
        }

        setCalculating(true);
        try {
            await QuoteService.calculatePremium(form.proposalId);
            setSuccess("Quote auto-calculated and saved successfully! Redirecting...");
            setTimeout(() => navigate("/quotes"), 1000);
        } catch (err) {
            console.log(err);
            setError("Unable to auto-calculate a quote for this proposal.");
        } finally {
            setCalculating(false);
        }
    }

    async function handleManualSubmit(event) {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (!form.premiumAmount || !form.addOns) {
            setError("Please provide both a premium amount and add-ons for a custom quote.");
            return;
        }

        setSubmitting(true);
        try {
            await QuoteService.generateQuote({
                proposalId: Number(form.proposalId),
                premiumAmount: Number(form.premiumAmount),
                addOns: form.addOns,
            });

            setSuccess("Custom quote generated successfully! Redirecting...");
            setTimeout(() => navigate("/quotes"), 1000);
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to generate quote."
            );
        } finally {
            setSubmitting(false);
        }
    }

    if (loadingProposals) {
        return (
            <>
                <Navbar />
                <Loader label="Loading proposals..." />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">Generate Quote</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                {proposals.length === 0 ? (
                    <p className="empty-state">
                        No approved proposals are currently awaiting a quote.
                    </p>
                ) : (
                    <form onSubmit={handleManualSubmit}>

                        <label className="field-label">Proposal</label>
                        <select
                            name="proposalId"
                            value={form.proposalId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a Proposal</option>
                            {proposals.map((proposal) => (
                                <option key={proposal.proposalId} value={proposal.proposalId}>
                                    #{proposal.proposalId} - {proposal.user?.name} - {proposal.vehicleModel} ({proposal.policy?.policyName})
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleAutoGenerate}
                            disabled={calculating || !form.proposalId}
                        >
                            {calculating ? "Calculating..." : "Auto-Calculate & Generate Quote"}
                        </button>

                        <p className="field-label" style={{ marginTop: "20px" }}>
                            Or enter a custom quote manually:
                        </p>

                        <input
                            type="number"
                            name="premiumAmount"
                            placeholder="Premium Amount (₹)"
                            value={form.premiumAmount}
                            onChange={handleChange}
                            min="1000"
                        />

                        <input
                            type="text"
                            name="addOns"
                            placeholder="Add-ons (e.g. Zero Depreciation, Roadside Assistance)"
                            value={form.addOns}
                            onChange={handleChange}
                        />

                        <button className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Saving..." : "Generate Custom Quote"}
                        </button>
                    </form>
                )}
            </div>

            <Footer />
        </>
    );
}

export default RegisterQuote;
