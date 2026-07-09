import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import DocumentService from "../../services/DocumentService";
import ProposalService from "../../services/ProposalService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Form.css";

function RegisterDocument() {

    const { user, hasRole } = useAuth();
    const isAdmin = hasRole("ADMIN");
    const navigate = useNavigate();

    const [proposals, setProposals] = useState([]);
    const [loadingProposals, setLoadingProposals] = useState(true);

    const [form, setForm] = useState({
        proposalId: "",
        documentName: "",
        filePath: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadProposals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadProposals() {
        setLoadingProposals(true);
        try {
            const response = await ProposalService.getAllProposals();
            setProposals(
                isAdmin
                    ? response.data
                    : response.data.filter((p) => p.user?.userId === user?.userId)
            );
        } catch (err) {
            console.log(err);
            setError("Unable to load proposals.");
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
            await DocumentService.uploadDocument({
                proposalId: Number(form.proposalId),
                documentName: form.documentName,
                filePath: form.filePath,
            });

            setSuccess("Document added successfully! Redirecting...");
            setTimeout(() => navigate("/documents"), 1000);
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to add document."
            );
        } finally {
            setSubmitting(false);
        }
    };

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
                <h2 className="title">Add Document</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                {proposals.length === 0 ? (
                    <p className="empty-state">No proposals available to attach a document to.</p>
                ) : (
                    <form onSubmit={handleSubmit}>

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
                                    #{proposal.proposalId} - {proposal.vehicleModel}
                                    {isAdmin ? ` - ${proposal.user?.name}` : ""}
                                </option>
                            ))}
                        </select>

                        <input
                            type="text"
                            name="documentName"
                            placeholder="Document Name (e.g. Driving License)"
                            value={form.documentName}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="filePath"
                            placeholder="File URL / Path"
                            value={form.filePath}
                            onChange={handleChange}
                            required
                        />

                        <button className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Saving..." : "Add Document"}
                        </button>
                    </form>
                )}
            </div>

            <Footer />
        </>
    );
}

export default RegisterDocument;
