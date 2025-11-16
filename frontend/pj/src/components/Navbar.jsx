import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useProfileQuery, useLogoutMutation } from "../api/authApi";

export default function Navbar() {
  const { data, isSuccess } = useProfileQuery();
  const userRole = data?.data?.role;

  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <Link to="/">
          <h1 className="font-bold text-xl">FoodApp 🍔</h1>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/">Home</Link>

          {/* ⭐ Foods Page (Logged-In Users Only) */}
          {isSuccess && <Link to="/foods">Foods</Link>}

          {/* ⭐ CUSTOMER ONLY */}
          {isSuccess && userRole === "CUSTOMER" && (
            <Link to="/become-seller">Become Seller</Link>
          )}

          {/* ⭐ SELLER ONLY */}
          {isSuccess && userRole === "SELLER" && (
            <Link to="/seller/dashboard">Seller Dashboard</Link>
          )}

          <Link to="/profile">Profile</Link>

          {!isSuccess ? (
            <>
              <Link to="/signup">Signup</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>

        {/* MOBILE HAMBURGER */}
        <button className="md:hidden" onClick={() => setOpen(true)}>
          <Menu size={28} />
        </button>
      </nav>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-700 text-white shadow-xl transform transition-transform duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-blue-500">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X size={28} />
          </button>
        </div>

        {/* SIDEBAR LINKS */}
        <div className="flex flex-col mt-4 space-y-4 pl-6 text-lg">
          <Link to="/" onClick={() => setOpen(false)}>
            Home
          </Link>

          {/* ⭐ Foods Page */}
          {isSuccess && (
            <Link to="/foods" onClick={() => setOpen(false)}>
              Foods
            </Link>
          )}

          {/* ⭐ CUSTOMER ONLY */}
          {isSuccess && userRole === "CUSTOMER" && (
            <Link to="/become-seller" onClick={() => setOpen(false)}>
              Become Seller
            </Link>
          )}

          {/* ⭐ SELLER ONLY */}
          {isSuccess && userRole === "SELLER" && (
            <Link to="/seller/dashboard" onClick={() => setOpen(false)}>
              Seller Dashboard
            </Link>
          )}

          <Link to="/profile" onClick={() => setOpen(false)}>
            Profile
          </Link>

          {!isSuccess ? (
            <>
              <Link to="/signup" onClick={() => setOpen(false)}>
                Signup
              </Link>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 w-32 px-3 py-1 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}




