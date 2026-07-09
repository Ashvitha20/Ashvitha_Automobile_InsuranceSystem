import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Wrap protected routes with this. If `roles` is provided, the user must
 * also have one of those roles (case-insensitive), otherwise they're
 * redirected to the dashboard with an "access denied" style fallback.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>...</Route>                 // any logged-in user
 *   <Route element={<ProtectedRoute roles={["ADMIN"]} />}>...</Route> // admin only
 */
function ProtectedRoute({ roles }) {

    const { isAuthenticated, hasRole } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (roles && roles.length > 0 && !hasRole(...roles)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
