import api from "../api/api";

const ClaimService = {

    getAllClaims() {

        return api.get("/claims");

    },

    getClaimById(id) {

        return api.get(`/claims/${id}`);

    },

    raiseClaim(claim) {

        return api.post("/claims", claim);

    },

    updateClaim(id, claim) {

        return api.put(`/claims/${id}`, claim);

    },

    approveClaim(id) {

        return api.put(`/claims/${id}/approve`);

    },

    rejectClaim(id) {

        return api.put(`/claims/${id}/reject`);

    }

};

export default ClaimService;