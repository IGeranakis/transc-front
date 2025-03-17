import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/" replace />; // Redirect to home if not logged in
    }

    if (user.role !== "admin" && user.role !== requiredRole) {
        return <Navigate to="/dashboard" replace />; // Redirect to dashboard if unauthorized
    }

    return children;
};

export default ProtectedRoute;
