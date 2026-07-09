import api from "../api/api";

const UserService = {

    getAllUsers() {
        return api.get("/users");
    },

    getUserById(userId) {
        return api.get(`/users/${userId}`);
    },

    registerUser(user) {
        return api.post("/users", user);
    },

    updateUser(userId, user) {
        return api.put(`/users/${userId}`, user);
    },

    deleteUser(userId) {
        return api.delete(`/users/${userId}`);
    },getMyProfile() {
        return api.get("/users/me");
    },

    updateMyProfile(user) {
        return api.put("/users/me", user);
    }

};

export default UserService;