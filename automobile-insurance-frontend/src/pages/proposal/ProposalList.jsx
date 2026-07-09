import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import ProposalService from "../../services/ProposalService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Table.css";

function ProposalList() {

    const { user, hasRole } = useAuth();
    const isAdmin = hasRole("ADMIN");
    const navigate = useNavigate();

    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionError, setActionError] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        loadProposals();
    }, []);

    async function loadProposals() {
        setLoading(true);
        setError("");
        try {
            const response = await ProposalService.getAllProposals();
            setProposals(response.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load proposals.");
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(proposalId) {
        setActionError("");
        setBusyId(proposalId);
        try {
            await ProposalService.approveProposal(proposalId);
            await loadProposals();
        } catch (err) {
            console.log(err);
            setActionError("Unable to approve this proposal.");
        } finally {
            setBusyId(null);
        }
    }

    async function handleReject(proposalId) {
        setActionError("");
        setBusyId(proposalId);
        try {
            await ProposalService.rejectProposal(proposalId);
            await loadProposals();
        } catch (err) {
            console.log(err);
            setActionError("Unable to reject this proposal.");
        } finally {
            setBusyId(null);
        }
    }
    async function handleDownload(proposalId) {
        setActionError("");
        setBusyId(proposalId);
        try {
            const response = await ProposalService.downloadPolicyDocument(proposalId);
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Policy-${proposalId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.log(err);
            setActionError("Unable to download policy document.");
        } finally {
            setBusyId(null);
        }
    }

    async function handleDelete(proposalId) {
        if (!window.confirm("Delete this proposal?")) return;
        try {
            await ProposalService.deleteProposal(proposalId);
            setProposals((prev) => prev.filter((p) => p.proposalId !== proposalId));
        } catch (err) {
            console.log(err);
            alert("Unable to delete proposal.");
        }
    }
    async function handleDownload(proposalId) {
        setActionError("");
        setBusyId(proposalId);
        try {
            const response = await ProposalService.downloadPolicyDocument(proposalId);
            const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `Policy-${proposalId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.log(err);
            setActionError("Unable to download policy document.");
        } finally {
            setBusyId(null);
        }
    }

    const visibleProposals = (isAdmin
        ? proposals
        : proposals.filter((p) => p.user?.userId === user?.userId)
    ).filter((p) =>
        statusFilter === "ALL"
            ? true
            : (p.proposalStatus || "").toUpperCase() === statusFilter
    );

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="list-header">
                    <h2 className="title">
                        {isAdmin ? "All Proposals" : "My Proposals"}
                    </h2>
                    {!isAdmin && (
                        <Link to="/register-proposal" className="btn btn-primary">
                            + New Proposal
                        </Link>
                    )}
                </div>

                <div className="filter-bar">
                    <label>Filter by status:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All</option>
                        <option value="PROPOSAL_SUBMITTED">Proposal Submitted</option>
                        <option value="QUOTE_GENERATED">Quote Generated</option>
                        <option value="ACTIVE">Active</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="EXPIRED">Expired</option>
                    </select>
                </div>

                <ErrorMessage message={error || actionError} />

                {loading ? (
                    <Loader label="Loading proposals..." />
                ) : visibleProposals.length === 0 ? (
                    <p className="empty-state">No proposals found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                {isAdmin && <th>Applicant</th>}
                                <th>Policy</th>
                                <th>Vehicle</th>
                                <th>Year</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {visibleProposals.map((proposal) => {
                                const status = (proposal.proposalStatus || "").toUpperCase();
                                const disabled = busyId === proposal.proposalId;

                                return (
                                    <tr key={proposal.proposalId}>
                                        <td>{proposal.proposalId}</td>
                                        {isAdmin && (
                                            <td>
                                                {proposal.user?.name}
                                                <br />
                                                <small>{proposal.user?.email}</small>
                                            </td>
                                        )}
                                        <td>{proposal.policy?.policyName}</td>
                                        <td>
                                            {proposal.vehicleModel}
                                            <br />
                                            <small>{proposal.vehicleNumber}</small>
                                        </td>
                                        <td>{proposal.vehicleYear}</td>
                                        <td>
                                            <span className={`status-badge status-${status.toLowerCase()}`}>
                                                {proposal.proposalStatus}
                                            </span>
                                        </td>
                                        <td>
                                            {isAdmin && status === "PROPOSAL_SUBMITTED" && (
                                                <>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        disabled={disabled}
                                                        onClick={() => handleApprove(proposal.proposalId)}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        disabled={disabled}
                                                        onClick={() => handleReject(proposal.proposalId)}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {isAdmin && status === "QUOTE_GENERATED" && (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => navigate(`/register-quote?proposalId=${proposal.proposalId}`)}
                                                >
                                                    Generate Quote
                                                </button>
                                            )}

                                            {!isAdmin && status === "PROPOSAL_SUBMITTED" && (
                                                <Link
                                                    to={`/update-proposal/${proposal.proposalId}`}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    Edit
                                                </Link>
                                            )}

                                            {(isAdmin || status === "PROPOSAL_SUBMITTED") && (
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(proposal.proposalId)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                            {status === "ACTIVE" && (
                                                <button
                                                    className="btn btn-secondary btn-sm"
                                                    disabled={disabled}
                                                    onClick={() => handleDownload(proposal.proposalId)}
                                                >
                                                    Download Policy
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            <Footer />
        </>
    );
}

export default ProposalList;
