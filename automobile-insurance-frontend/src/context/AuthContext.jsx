import { createContext, useContext, useState, useCallback } from "react";
import authUtils from "../utils/authUtils";
import AuthService from "../services/AuthService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(authUtils.getUser());

    const login = useCallback(async (credentials) => {
        const response = await AuthService.login(credentials);
        authUtils.saveSession(response.data);
        setUser(authUtils.getUser());
        return response.data;
    }, []);

    const register = useCallback(async (userData) => {
        const response = await AuthService.register(userData);
        return response.data;
    }, []);

    const logout = useCallback(() => {
        authUtils.clearSession();
        setUser(null);
    }, []);

    const hasRole = useCallback(
        (...roles) => {
            if (!user || !user.role) return false;
            return roles
                .map((r) => r.toUpperCase())
                .includes(user.role.toUpperCase());
        },
        [user]
    );

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
