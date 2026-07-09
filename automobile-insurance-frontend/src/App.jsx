import { Routes, Route } from "react-router-dom";
import UserProfile from "./pages/user/UserProfile";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import Home from "./pages/home/Home";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/NotFound";

/* Auth */
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";

/* User (Admin only) */
import UserList from "./pages/user/UserList";
import UpdateUser from "./pages/user/UpdateUser";
import RegisterUser from "./pages/user/RegisterUser";

/* Policy */
import RegisterPolicy from "./pages/policy/RegisterPolicy";
import PolicyList from "./pages/policy/PolicyList";
import UpdatePolicy from "./pages/policy/UpdatePolicy";

/* Proposal */
import RegisterProposal from "./pages/proposal/RegisterProposal";
import ProposalList from "./pages/proposal/ProposalList";
import UpdateProposal from "./pages/proposal/UpdateProposal";

/* Quote */
import RegisterQuote from "./pages/quote/RegisterQuote";
import QuoteList from "./pages/quote/QuoteList";

/* Payment */
import RegisterPayment from "./pages/payment/RegisterPayment";
import PaymentList from "./pages/payment/PaymentList";

/* Claim */
import RegisterClaim from "./pages/claim/RegisterClaim";
import ClaimList from "./pages/claim/ClaimList";

/* Document */
import RegisterDocument from "./pages/document/RegisterDocument";
import DocumentList from "./pages/document/DocumentList";


function App() {

    return (

        <Routes>

            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Any authenticated user */}
            <Route element={<ProtectedRoute />}>

                <Route path="/dashboard" element={<Dashboard />} />

                <Route path="/profile" element={<UserProfile />} />

                <Route path="/policies" element={<PolicyList />} />

                <Route path="/proposals" element={<ProposalList />} />
                <Route path="/register-proposal" element={<RegisterProposal />} />
                <Route path="/update-proposal/:id" element={<UpdateProposal />} />

                <Route path="/quotes" element={<QuoteList />} />

                <Route path="/payments" element={<PaymentList />} />
                <Route path="/register-payment" element={<RegisterPayment />} />

                <Route path="/claims" element={<ClaimList />} />
                <Route path="/register-claim" element={<RegisterClaim />} />

                <Route path="/documents" element={<DocumentList />} />
                <Route path="/register-document" element={<RegisterDocument />} />
                

            </Route>

            {/* Admin only */}
            <Route element={<ProtectedRoute roles={["ADMIN"]} />}>

                <Route path="/users" element={<UserList />} />
                <Route path="/register-user" element={<RegisterUser />} />
                <Route path="/update-user/:id" element={<UpdateUser />} />

                <Route path="/register-policy" element={<RegisterPolicy />} />
                <Route path="/update-policy/:id" element={<UpdatePolicy />} />

                <Route path="/register-quote" element={<RegisterQuote />} />

            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>

    );

}

export default App;