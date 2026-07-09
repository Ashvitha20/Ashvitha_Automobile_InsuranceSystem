import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import SuccessMessage from "../../components/common/SuccessMessage";
import PaymentService from "../../services/PaymentService";
import QuoteService from "../../services/QuoteService";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Form.css";

function RegisterPayment() {

    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const preselectedQuoteId = searchParams.get("quoteId") || "";

    const [quotes, setQuotes] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loadingQuotes, setLoadingQuotes] = useState(true);

    const [form, setForm] = useState({
        quoteId: preselectedQuoteId,
        amount: "",
        paymentMethod: "UPI",
        bankName: "",
        bankBranch: "",
        cardNumber: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        // Auto-fill the amount when a quote is selected (or preselected via URL).
        if (form.quoteId && quotes.length > 0) {
            const selected = quotes.find((q) => q.quoteId === Number(form.quoteId));
            if (selected) {
                setForm((prev) => ({ ...prev, amount: selected.premiumAmount }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form.quoteId, quotes]);

    async function loadData() {
        setLoadingQuotes(true);
        setError("");
        try {
            const [quoteRes, paymentRes] = await Promise.all([
                QuoteService.getAllQuotes(),
                PaymentService.getAllPayments(),
            ]);
            setQuotes(
                quoteRes.data.filter((q) => q.proposal?.user?.userId === user?.userId)
            );
            setPayments(paymentRes.data);
        } catch (err) {
            console.log(err);
            setError("Unable to load your quotes.");
        } finally {
            setLoadingQuotes(false);
        }
    }

    const paidQuoteIds = new Set(payments.map((p) => p.quote?.quoteId));
    const payableQuotes = quotes.filter((q) => !paidQuoteIds.has(q.quoteId));

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");

        if (form.paymentMethod === "CREDIT_CARD") {
            if (!form.bankName || !form.bankBranch || !/^\d{16}$/.test(form.cardNumber)) {
                setError("Please enter bank name, branch, and a valid 16-digit card number.");
                return;
            }
        }

        setSubmitting(true);

        try {
            await PaymentService.makePayment({
                quoteId: Number(form.quoteId),
                amount: Number(form.amount),
                paymentMethod: form.paymentMethod,
                bankName: form.paymentMethod === "CREDIT_CARD" ? form.bankName : "",
                bankBranch: form.paymentMethod === "CREDIT_CARD" ? form.bankBranch : "",
                cardNumber: form.paymentMethod === "CREDIT_CARD" ? form.cardNumber : "",
                paymentStatus: "PENDING",
            });

            setSuccess("Payment submitted successfully! Awaiting confirmation. Redirecting...");
            setTimeout(() => navigate("/payments"), 1000);
        } catch (err) {
            console.log(err);
            const data = err.response?.data;
            setError(
                (data && (data.message || Object.values(data)[0])) ||
                "Unable to submit payment."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingQuotes) {
        return (
            <>
                <Navbar />
                <Loader label="Loading your quotes..." />
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="container">
                <h2 className="title">Make a Payment</h2>

                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                {payableQuotes.length === 0 ? (
                    <p className="empty-state">
                        You have no outstanding quotes to pay for right now.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit}>

                        <label className="field-label">Quote</label>
                        <select
                            name="quoteId"
                            value={form.quoteId}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select a Quote</option>
                            {payableQuotes.map((quote) => (
                                <option key={quote.quoteId} value={quote.quoteId}>
                                    #{quote.quoteId} - {quote.proposal?.vehicleModel} - ₹{quote.premiumAmount}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            name="amount"
                            placeholder="Amount (₹)"
                            value={form.amount}
                            onChange={handleChange}
                            min="100"
                            required
                        />

                        <label className="field-label">Payment Method</label>
                        <div className="payment-method-options">
                            <label className="payment-method-row">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="UPI"
                                    checked={form.paymentMethod === "UPI"}
                                    onChange={handleChange}
                                />
                                UPI
                            </label>

                            <label className="payment-method-row">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="NET_BANKING"
                                    checked={form.paymentMethod === "NET_BANKING"}
                                    onChange={handleChange}
                                />
                                Net Banking / Wallet
                            </label>

                            <label className="payment-method-row">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="CREDIT_CARD"
                                    checked={form.paymentMethod === "CREDIT_CARD"}
                                    onChange={handleChange}
                                />
                                Credit / Debit Card
                            </label>
                        </div>

                        {form.paymentMethod === "UPI" && (
                            <p className="empty-state" style={{ padding: "8px 0" }}>
                                You'll be redirected to your UPI app to complete this payment.
                            </p>
                        )}

                        {form.paymentMethod === "NET_BANKING" && (
                            <p className="empty-state" style={{ padding: "8px 0" }}>
                                You'll be redirected to your bank/wallet's secure payment page.
                            </p>
                        )}

                        {form.paymentMethod === "CREDIT_CARD" && (
                            <>
                                <input
                                    type="text"
                                    name="bankName"
                                    placeholder="Bank Name"
                                    value={form.bankName}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="text"
                                    name="bankBranch"
                                    placeholder="Bank Branch"
                                    value={form.bankBranch}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="text"
                                    name="cardNumber"
                                    placeholder="Card Number (16 digits)"
                                    value={form.cardNumber}
                                    onChange={handleChange}
                                    maxLength={16}
                                    required
                                />
                            </>
                        )}

                        <button className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Processing..." : "Pay Now"}
                        </button>
                    </form>
                )}
            </div>

            <Footer />
        </>
    );
}

export default RegisterPayment;