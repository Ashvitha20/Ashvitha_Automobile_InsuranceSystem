import api from "../api/api";

const QuoteService = {

    getAllQuotes() {

        return api.get("/quotes");

    },

    getQuoteById(id) {

        return api.get(`/quotes/${id}`);

    },

    generateQuote(quote) {

        return api.post("/quotes", quote);

    },

    calculatePremium(proposalId) {

        return api.get(`/quotes/calculate/${proposalId}`);

    }

};

export default QuoteService;