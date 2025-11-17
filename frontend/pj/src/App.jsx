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
import MyOrders from "./pages/MyOrders"; // ⭐ NEW IMPORT
import SellerOrders from "./pages/SellerOrders";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* ⭐ PUBLIC ROUTES */}
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* ⭐ PRIVATE PROFILE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* ⭐ FOODS — LOGGED-IN USERS ONLY */}
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

        {/* ⭐ CUSTOMER ONLY → MY ORDERS */}
        <Route
          path="/my-orders"
          element={
            <RoleBasedRoute allowedRoles={["CUSTOMER"]}>
              <MyOrders />
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

        <Route
          path="/seller/orders"
          element={
            <RoleBasedRoute allowedRoles={["SELLER"]}>
              <SellerOrders />
            </RoleBasedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
