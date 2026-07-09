const TOKEN_KEY = "aims_token";
const USER_KEY = "aims_user";

/**
 * Small helper module around localStorage for the JWT + logged-in user info.
 * Kept in one place so the rest of the app never touches localStorage directly.
 */
const authUtils = {

    saveSession(loginResponse) {
        // loginResponse = { token, tokenType, userId, name, email, role, expiresInMs }
        localStorage.setItem(TOKEN_KEY, loginResponse.token);
        localStorage.setItem(
            USER_KEY,
            JSON.stringify({
                userId: loginResponse.userId,
                name: loginResponse.name,
                email: loginResponse.email,
                role: loginResponse.role,
            })
        );
    },

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    getUser() {
        const raw = localStorage.getItem(USER_KEY);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },

    isAuthenticated() {
        return !!authUtils.getToken();
    },

    hasRole(...roles) {
        const user = authUtils.getUser();
        if (!user || !user.role) return false;
        return roles
            .map((r) => r.toUpperCase())
            .includes(user.role.toUpperCase());
    },

    clearSession() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },
};

export default authUtils;
