import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import QuoteService from "../../services/QuoteService";
import PaymentService from "../../services/PaymentService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Table.css";

function QuoteList() {

    const { user, hasRole } = useAuth();
    const isAdmin = hasRole("ADMIN");
    const navigate = useNavigate();

    const [quotes, setQuotes] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        setLoading(true);
        setError("");
        try {
            const [quoteRes, paymentRes] = await Promise.all([
                QuoteService.getAllQuotes(),
                PaymentService.getAllPayments(),
            ]);
            setQuotes(quoteRes.data);
            setPayments(paymentRes.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load quotes.");
        } finally {
            setLoading(false);
        }
    }

    const visibleQuotes = isAdmin
        ? quotes
        : quotes.filter((q) => q.proposal?.user?.userId === user?.userId);

    function hasPaymentAlready(quoteId) {
        return payments.some((p) => p.quote?.quoteId === quoteId);
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">{isAdmin ? "All Quotes" : "My Quotes"}</h2>

                <ErrorMessage message={error} />

                {loading ? (
                    <Loader label="Loading quotes..." />
                ) : visibleQuotes.length === 0 ? (
                    <p className="empty-state">No quotes found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Quote ID</th>
                                {isAdmin && <th>Applicant</th>}
                                <th>Proposal</th>
                                <th>Add-ons</th>
                                <th>Premium</th>
                                <th>Generated On</th>
                                {!isAdmin && <th>Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {visibleQuotes.map((quote) => (
                                <tr key={quote.quoteId}>
                                    <td>{quote.quoteId}</td>
                                    {isAdmin && <td>{quote.proposal?.user?.name}</td>}
                                    <td>
                                        {quote.proposal?.vehicleModel}
                                        <br />
                                        <small>{quote.proposal?.policy?.policyName}</small>
                                    </td>
                                    <td>{quote.addOns}</td>
                                    <td>₹{quote.premiumAmount}</td>
                                    <td>
                                        {quote.generatedDate
                                            ? new Date(quote.generatedDate).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    {!isAdmin && (
                                        <td>
                                            {hasPaymentAlready(quote.quoteId) ? (
                                                <span className="status-badge status-success">
                                                    Payment Submitted
                                                </span>
                                            ) : (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() =>
                                                        navigate(`/register-payment?quoteId=${quote.quoteId}`)
                                                    }
                                                >
                                                    Pay Now
                                                </button>
                                            )}
                                        </td>
                                    )}
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

export default QuoteList;
