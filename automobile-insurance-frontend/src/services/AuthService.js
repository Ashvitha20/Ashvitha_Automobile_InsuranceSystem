import api from "../api/api";

const AuthService = {

    login(credentials) {
        // credentials = { email, password }
        return api.post("/auth/login", credentials);
    },

    register(user) {
        // user = { name, email, password, dob, aadhaar, pan, role }
        return api.post("/auth/register", user);
    },

    forgotPassword(email) {
        return api.post("/auth/forgot-password", { email });
    },

};

export default AuthService;
