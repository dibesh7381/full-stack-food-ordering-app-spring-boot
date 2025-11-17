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
import Foods from "./pages/Foods";
import Cart from "./pages/Cart";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* Public */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Private */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ⭐ Foods — Logged-in users only */}
        <Route
          path="/foods"
          element={
            <PrivateRoute>
              <Foods />
            </PrivateRoute>
          }
        />

        {/* ⭐ CUSTOMER ONLY → CART */}
        <Route
          path="/cart"
          element={
            <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
              <Cart />
            </RoleBasedRoute>
          }
        />

        {/* ⭐ CUSTOMER ONLY → Become Seller */}
        <Route
          path="/become-seller"
          element={
            <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
              <BecomeSeller />
            </RoleBasedRoute>
          }
        />

        {/* ⭐ SELLER ONLY → Dashboard */}
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




