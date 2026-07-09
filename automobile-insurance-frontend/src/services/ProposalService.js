import api from "../api/api";

const ProposalService = {

    getAllProposals() {

        return api.get("/proposals");

    },

    getProposalById(id) {

        return api.get(`/proposals/${id}`);

    },

    createProposal(proposal) {

        return api.post("/proposals", proposal);

    },

    updateProposal(id, proposal) {

        return api.put(`/proposals/${id}`, proposal);

    },

    deleteProposal(id) {

        return api.delete(`/proposals/${id}`);

    },

    approveProposal(id){

        return api.put(`/proposals/${id}/approve`);

    },

    rejectProposal(id){

        return api.put(`/proposals/${id}/reject`);

    },
    downloadPolicyDocument(id) {

        return api.get(`/proposals/${id}/policy-document`, {
            responseType: "blob",
        });

    }

};

export default ProposalService;