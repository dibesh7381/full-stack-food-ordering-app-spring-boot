import { Navigate } from "react-router-dom";
import { useProfileQuery } from "../api/authApi";

export default function RoleBasedRoute({ children, allowedRoles }) {
  const { data, isLoading } = useProfileQuery();

  if (isLoading) return <p className="p-4 text-center">Loading...</p>;

  const userRole = data?.data?.role;

  // ❌ Not logged in
  if (!userRole) return <Navigate to="/login" />;

  // ❌ Role not allowed
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/profile" />;
  }

  return children;
}
