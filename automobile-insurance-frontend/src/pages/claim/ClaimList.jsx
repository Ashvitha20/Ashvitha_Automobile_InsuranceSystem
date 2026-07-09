import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import ClaimService from "../../services/ClaimService";
import DocumentService from "../../services/DocumentService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Table.css";

function ClaimList() {

    const { user, hasRole } = useAuth();
    const isAdmin = hasRole("ADMIN");

    const [claims, setClaims] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        setError("");
        try {
            const [claimRes, documentRes] = await Promise.all([
                ClaimService.getAllClaims(),
                DocumentService.getAllDocuments(),
            ]);
            setClaims(claimRes.data);
            setDocuments(documentRes.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load claims.");
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(claimId) {
        setBusyId(claimId);
        try {
            await ClaimService.approveClaim(claimId);
            await loadData();
        } catch (err) {
            console.log(err);
            setError("Unable to approve this claim.");
        } finally {
            setBusyId(null);
        }
    }

    async function handleReject(claimId) {
        setBusyId(claimId);
        try {
            await ClaimService.rejectClaim(claimId);
            await loadData();
        } catch (err) {
            console.log(err);
            setError("Unable to reject this claim.");
        } finally {
            setBusyId(null);
        }
    }

    // A claim doesn't store its own documents - it shares the same
    // Proposal as the Documents module, so we cross-reference by
    // proposalId to show whatever was uploaded for that policy.
    function getDocumentsForClaim(claim) {
        const proposalId = claim.proposal?.proposalId;
        if (!proposalId) return [];
        return documents.filter((doc) => doc.proposal?.proposalId === proposalId);
    }

    const visibleClaims = isAdmin
        ? claims
        : claims.filter((c) => c.proposal?.user?.userId === user?.userId);

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="list-header">
                    <h2 className="title">{isAdmin ? "All Claims" : "My Claims"}</h2>
                    {!isAdmin && (
                        <Link to="/register-claim" className="btn btn-primary">
                            + Raise Claim
                        </Link>
                    )}
                </div>

                <ErrorMessage message={error} />

                {loading ? (
                    <Loader label="Loading claims..." />
                ) : visibleClaims.length === 0 ? (
                    <p className="empty-state">No claims found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                {isAdmin && <th>Applicant</th>}
                                <th>Vehicle</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                {isAdmin && <th>Documents</th>}
                                {isAdmin && <th>Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {visibleClaims.map((claim) => {
                                const status = (claim.claimStatus || "").toUpperCase();
                                const claimDocuments = isAdmin ? getDocumentsForClaim(claim) : [];
                                return (
                                    <tr key={claim.claimId}>
                                        <td>{claim.claimId}</td>
                                        {isAdmin && <td>{claim.proposal?.user?.name}</td>}
                                        <td>{claim.proposal?.vehicleModel}</td>
                                        <td>{claim.claimDescription}</td>
                                        <td>₹{claim.claimAmount}</td>
                                        <td>
                                            {claim.claimDate
                                                ? new Date(claim.claimDate).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${status.toLowerCase()}`}>
                                                {claim.claimStatus}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                {claimDocuments.length === 0 ? (
                                                    <span className="empty-state" style={{ padding: 0 }}>
                                                        None
                                                    </span>
                                                ) : (
                                                    claimDocuments.map((doc) => (
                                                        <div key={doc.documentId}>
                                                            <a href={doc.filePath} target="_blank" rel="noreferrer">
                                                                {doc.documentName}
                                                            </a>
                                                        </div>
                                                    ))
                                                )}
                                            </td>
                                        )}
                                        {isAdmin && (
                                            <td>
                                                {status === "INITIATED" && (
                                                    <>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            disabled={busyId === claim.claimId}
                                                            onClick={() => handleApprove(claim.claimId)}
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            disabled={busyId === claim.claimId}
                                                            onClick={() => handleReject(claim.claimId)}
                                                        >
                                                            Reject
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        )}
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

export default ClaimList;