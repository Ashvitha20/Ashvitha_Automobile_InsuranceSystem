import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import PaymentService from "../../services/PaymentService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Table.css";

function PaymentList() {

    const { user, hasRole } = useAuth();
    const isAdmin = hasRole("ADMIN");

    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [busyId, setBusyId] = useState(null);

    useEffect(() => {
        loadPayments();
    }, []);

    async function loadPayments() {
        setLoading(true);
        setError("");
        try {
            const response = await PaymentService.getAllPayments();
            setPayments(response.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load payments.");
        } finally {
            setLoading(false);
        }
    }

    async function handleApprove(paymentId) {
        setBusyId(paymentId);
        try {
            await PaymentService.approvePayment(paymentId);
            await loadPayments();
        } catch (err) {
            console.log(err);
            setError("Unable to approve this payment.");
        } finally {
            setBusyId(null);
        }
    }

    const visiblePayments = isAdmin
        ? payments
        : payments.filter((p) => p.quote?.proposal?.user?.userId === user?.userId);

    return (
        <>
            <Navbar />

            <div className="container">
                <div className="list-header">
                    <h2 className="title">{isAdmin ? "All Payments" : "My Payments"}</h2>
                    {!isAdmin && (
                        <Link to="/register-payment" className="btn btn-primary">
                            + Make Payment
                        </Link>
                    )}
                </div>

                <ErrorMessage message={error} />

                {loading ? (
                    <Loader label="Loading payments..." />
                ) : visiblePayments.length === 0 ? (
                    <p className="empty-state">No payments found.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                {isAdmin && <th>Applicant</th>}
                                <th>Quote</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                                {isAdmin && <th>Actions</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {visiblePayments.map((payment) => {
                                const status = (payment.paymentStatus || "").toUpperCase();
                                return (
                                    <tr key={payment.paymentId}>
                                        <td>{payment.paymentId}</td>
                                        {isAdmin && <td>{payment.quote?.proposal?.user?.name}</td>}
                                        <td>#{payment.quote?.quoteId}</td>
                                        <td>₹{payment.amount}</td>
                                        <td>
                                            {payment.paymentDate
                                                ? new Date(payment.paymentDate).toLocaleDateString()
                                                : "-"}
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${status.toLowerCase()}`}>
                                                {payment.paymentStatus}
                                            </span>
                                        </td>
                                        {isAdmin && (
                                            <td>
                                                {status === "PENDING" && (
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        disabled={busyId === payment.paymentId}
                                                        onClick={() => handleApprove(payment.paymentId)}
                                                    >
                                                        Approve
                                                    </button>
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

export default PaymentList;
