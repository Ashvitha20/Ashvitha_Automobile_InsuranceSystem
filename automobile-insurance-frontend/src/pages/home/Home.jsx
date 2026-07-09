import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import PolicyService from "../../services/PolicyService";
import { useAuth } from "../../context/AuthContext";
import heroBg from "../../assets/images/hero-bg.png";
import "../../styles/Home.css";

function Home() {

    const { isAuthenticated } = useAuth();

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
            setError("Unable to load policies right now. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const activePolicies = policies.filter(
        (p) => (p.status || "").toUpperCase() === "ACTIVE"
    );

    return (
        <div>

            <Navbar />

            <section
                className="hero"
                style={{
                    backgroundImage: `linear-gradient(rgba(3,27,60,.70), rgba(3,27,60,.70)), url(${heroBg})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat"
                }}
            >

                <h1>FORTISURE INSURANCE</h1>

                <p>
                    Protect your Car, Bike, SUV and Commercial Vehicles with
                    trusted insurance plans. Get instant quotes, secure online
                    payments and hassle-free claim settlement from one platform.
                </p>

                {!isAuthenticated && (
                    <div className="hero-actions">
                        <Link to="/register" className="btn btn-primary">
                            Get Started
                        </Link>

                        <Link to="/login" className="btn btn-secondary">
                            Login
                        </Link>
                    </div>
                )}

            </section>

            <section className="stats-strip">

                <div className="stat-box">
                    <span className="stat-number">{policies.length}</span>
                    <span className="stat-label">Policies Offered</span>
                </div>

                <div className="stat-box">
                    <span className="stat-number">{activePolicies.length}</span>
                    <span className="stat-label">Active Policies</span>
                </div>

                <div className="stat-box">
                    <span className="stat-number">24/7</span>
                    <span className="stat-label">Claim Support</span>
                </div>

            </section>

            <section className="container">

                <h2 className="title">Available Policies</h2>

                <ErrorMessage message={error} />

                {loading ? (
                    <Loader label="Loading policies..." />
                ) : policies.length === 0 ? (
                    <p className="empty-state">
                        No policies are available right now.
                    </p>
                ) : (
                    <div className="policy-grid">

                        {policies.map((policy) => (

                            <div
                                className="policy-card"
                                key={policy.policyId}
                            >

                                <h3>{policy.policyName}</h3>

                                <p className="policy-type">
                                    {policy.vehicleType}
                                </p>

                                <p>
                                    {policy.coverageDetails}
                                </p>

                                <p className="policy-premium">
                                    From ₹{policy.basePremium} / year
                                </p>

                                <span
                                    className={`status-badge status-${(
                                        policy.status || ""
                                    ).toLowerCase()}`}
                                >
                                    {policy.status}
                                </span>

                            </div>

                        ))}

                    </div>
                )}

            </section>

            <section className="container reviews-section">

                <h2 className="title">
                    What Our Customers Say
                </h2>

                <div className="review-grid">

                    <div className="review-card">
                        <p>
                            "Claim settlement was quick and the portal made
                            tracking my proposal effortless."
                        </p>
                        <span>- Priya S.</span>
                    </div>

                    <div className="review-card">
                        <p>
                            "Straightforward quote generation and transparent
                            premium breakdown."
                        </p>
                        <span>- Arjun M.</span>
                    </div>

                    <div className="review-card">
                        <p>
                            "Renewal reminders saved me from a lapsed policy.
                            Highly recommend."
                        </p>
                        <span>- Fatima K.</span>
                    </div>

                </div>

            </section>

            <Footer />

        </div>
    );
}

export default Home;