import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Homepage from "./pages/Homepage";

import PrivateRoute from "./components/PrivateRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";
import BecomeSeller from "./pages/BecomeSeller";

import SellerDashboard from "./pages/SellerDashboard";

// ⭐ NEW IMPORT → Foods Page
import Foods from "./pages/Foods";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* ⭐ PUBLIC PAGE */}
        <Route path="/" element={<Homepage />} />

        {/* Public Pages */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ⭐ PRIVATE PAGE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ⭐ ⭐ ⭐ ALL FOODS (ONLY LOGGED-IN USERS) */}
        <Route
          path="/foods"
          element={
            <PrivateRoute>
              <Foods />
            </PrivateRoute>
          }
        />

        {/* ⭐ ONLY CUSTOMER → BECOME SELLER */}
        <Route
          path="/become-seller"
          element={
            <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
              <BecomeSeller />
            </RoleBasedRoute>
          }
        />

        {/* ⭐ ONLY SELLER → SELLER DASHBOARD */}
        <Route
          path="/seller/dashboard"
          element={
            <RoleBasedRoute allowedRoles={["SELLER"]}>
              <SellerDashboard />
            </RoleBasedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}



