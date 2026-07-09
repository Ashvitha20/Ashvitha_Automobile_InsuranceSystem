import api from "../api/api";

const PolicyService = {

    getAllPolicies() {
        return api.get("/policies");
    },

    getPolicyById(id) {
        return api.get(`/policies/${id}`);
    },

    addPolicy(policy) {
        return api.post("/policies", policy);
    },

    updatePolicy(id, policy) {
        return api.put(`/policies/${id}`, policy);
    },

    deletePolicy(id) {
        return api.delete(`/policies/${id}`);
    }

};

export default PolicyService;