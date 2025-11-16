import { Navigate } from "react-router-dom";
import { useProfileQuery } from "../api/authApi";

export default function PrivateRoute({ children }) {
  const { isSuccess, isLoading } = useProfileQuery();

  if (isLoading) return <p className="p-4">Loading...</p>;

  return isSuccess ? children : <Navigate to="/login" />;
}
