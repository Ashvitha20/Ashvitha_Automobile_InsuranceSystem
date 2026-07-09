import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import { useAuth } from "../../context/AuthContext";
import PolicyService from "../../services/PolicyService";
import ProposalService from "../../services/ProposalService";
import ClaimService from "../../services/ClaimService";
import PaymentService from "../../services/PaymentService";
import "../../styles/Dashboard.css";

function Dashboard() {

    const { user, hasRole } = useAuth();
    const isAdmin = hasRole("ADMIN");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [policies, setPolicies] = useState([]);
    const [proposals, setProposals] = useState([]);
    const [claims, setClaims] = useState([]);
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        loadData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function loadData() {
        setLoading(true);
        setError("");
        try {
            const [policyRes, proposalRes, claimRes, paymentRes] = await Promise.all([
                PolicyService.getAllPolicies(),
                ProposalService.getAllProposals(),
                ClaimService.getAllClaims(),
                PaymentService.getAllPayments(),
            ]);

            setPolicies(policyRes.data);
            setProposals(proposalRes.data);
            setClaims(claimRes.data);
            setPayments(paymentRes.data);
        } catch (err) {
            console.log(err);
            setError("Some dashboard data could not be loaded.");
        } finally {
            setLoading(false);
        }
    }

    const myProposals = isAdmin
        ? proposals
        : proposals.filter((p) => p.user?.userId === user?.userId);

    const pendingProposals = proposals.filter(
        (p) => (p.proposalStatus || "").toUpperCase() === "PROPOSAL_SUBMITTED"
    );

    const pendingClaims = claims.filter(
        (c) => (c.claimStatus || "").toUpperCase() === "INITIATED"
    );

    const pendingPayments = payments.filter(
        (p) => (p.paymentStatus || "").toUpperCase() === "PENDING"
    );

    if (loading) {
        return (
            <>
                <Navbar />
                <Loader label="Loading dashboard..." />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="dashboard">
                <h1>Welcome, {user?.name}</h1>
                <p className="dashboard-subtitle">
                    {isAdmin ? "Administrator Dashboard" : "Your Insurance Overview"}
                </p>

                <ErrorMessage message={error} />

                <div className="card-container">

                    <Link to="/policies" className="card">
                        <h2>{policies.length}</h2>
                        <p>Available Policies</p>
                    </Link>

                    <Link to="/proposals" className="card">
                        <h2>{myProposals.length}</h2>
                        <p>{isAdmin ? "All Proposals" : "My Proposals"}</p>
                    </Link>

                    <Link to="/quotes" className="card">
                        <h2>-</h2>
                        <p>Quotes</p>
                    </Link>

                    <Link to="/payments" className="card">
                        <h2>{payments.length}</h2>
                        <p>Payments</p>
                    </Link>

                    <Link to="/claims" className="card">
                        <h2>{claims.length}</h2>
                        <p>Claims</p>
                    </Link>

                    <Link to="/documents" className="card">
                        <h2>-</h2>
                        <p>Documents</p>
                    </Link>

                    {isAdmin && (
                        <Link to="/users" className="card">
                            <h2>-</h2>
                            <p>Manage Users</p>
                        </Link>
                    )}

                </div>

                {isAdmin && (
                    <div className="admin-alerts">
                        <h3>Needs Your Attention</h3>
                        <ul>
                            <li>
                                <Link to="/proposals">
                                    {pendingProposals.length} proposal(s) awaiting review
                                </Link>
                            </li>
                            <li>
                                <Link to="/payments">
                                    {pendingPayments.length} payment(s) awaiting approval
                                </Link>
                            </li>
                            <li>
                                <Link to="/claims">
                                    {pendingClaims.length} claim(s) awaiting review
                                </Link>
                            </li>
                        </ul>
                    </div>
                )}

                {!isAdmin && (
                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <Link to="/register-proposal" className="btn btn-primary">
                            Submit New Proposal
                        </Link>
                        <Link to="/register-claim" className="btn btn-secondary">
                            Raise a Claim
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}

export default Dashboard;
