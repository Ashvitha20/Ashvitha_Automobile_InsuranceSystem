import api from "../api/api";

const PaymentService = {

    getAllPayments() {

        return api.get("/payments");

    },

    getPaymentById(id) {

        return api.get(`/payments/${id}`);

    },

    makePayment(payment) {

        return api.post("/payments", payment);

    },

    approvePayment(id) {

        return api.put(`/payments/${id}/approve`);

    }

};

export default PaymentService;