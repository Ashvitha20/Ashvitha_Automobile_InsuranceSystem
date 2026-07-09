import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import PolicyService from "../../services/PolicyService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Table.css";

function PolicyList() {

    const { hasRole } = useAuth();
    const isAdmin = hasRole("ADMIN");
    const navigate = useNavigate();

    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadPolicies();
    }, []);

    async function loadPolicies() {
        setLoading(true);
        setError("");
        try {
            const response = await PolicyService.getAllPolicies();
            setPolicies(response.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load policies.");
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(policyId) {
        if (!window.confirm("Delete this policy? This cannot be undone.")) return;
        try {
            await PolicyService.deletePolicy(policyId);
            setPolicies((prev) => prev.filter((p) => p.policyId !== policyId));
        } catch (err) {
            console.log(err);
            alert("Unable to delete policy.");
        }
    }

    function handleApply(policyId) {
        navigate(`/register-proposal?policyId=${policyId}`);
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="list-header">
                    <h2 className="title">Policy List</h2>
                    {isAdmin && (
                        <Link to="/register-policy" className="btn btn-primary">
                            + Add Policy
                        </Link>
                    )}
                </div>

                <ErrorMessage message={error} />

                {loading ? (
                    <Loader label="Loading policies..." />
                ) : policies.length === 0 ? (
                    <p className="empty-state">No policies found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Policy Name</th>
                                <th>Vehicle Type</th>
                                <th>Coverage</th>
                                <th>Premium</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {policies.map((policy) => (
                                <tr key={policy.policyId}>
                                    <td>{policy.policyId}</td>
                                    <td>{policy.policyName}</td>
                                    <td>{policy.vehicleType}</td>
                                    <td>{policy.coverageDetails}</td>
                                    <td>₹{policy.basePremium}</td>
                                    <td>
                                        <span
                                            className={`status-badge status-${(policy.status || "").toLowerCase()}`}
                                        >
                                            {policy.status}
                                        </span>
                                    </td>
                                    <td>
                                        {isAdmin ? (
                                            <>
                                                <Link
                                                    to={`/update-policy/${policy.policyId}`}
                                                    className="btn btn-secondary btn-sm"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDelete(policy.policyId)}
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleApply(policy.policyId)}
                                            >
                                                Apply
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Footer />
        </>
    );
}

export default PolicyList;
