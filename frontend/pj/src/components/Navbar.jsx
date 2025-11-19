import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { 
  useProfileQuery, 
  useLogoutMutation,
  useGetMyCartQuery,
  useGetSellerOrdersQuery,
  useGetMyOrdersQuery   // ⭐ NEW (customer order count)
} from "../api/authApi";

export default function Navbar() {
  const { data, isSuccess } = useProfileQuery();
  const userRole = data?.data?.role;

  const navigate = useNavigate();

  // ⭐ CUSTOMER CART COUNT
  const { data: cartData } = useGetMyCartQuery(undefined, {
    skip: userRole !== "CUSTOMER"
  });
  const cartCount = cartData?.data?.length || 0;

  // ⭐ SELLER ORDER COUNT
  const { data: sellerOrders } = useGetSellerOrdersQuery(undefined, {
    skip: userRole !== "SELLER"
  });
  const sellerOrderCount = sellerOrders?.data?.length || 0;

  // ⭐ CUSTOMER ORDER COUNT
  const { data: customerOrders } = useGetMyOrdersQuery(undefined, {
    skip: userRole !== "CUSTOMER"
  });
  const customerOrderCount = customerOrders?.data?.length || 0;

  const [logout] = useLogoutMutation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center relative z-40">
        <Link to="/">
          <h1 className="font-bold text-xl">FoodApp 🍔</h1>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/">Home</Link>

          {isSuccess && <Link to="/foods">Foods</Link>}

          {/* SELLER ONLY */}
          {isSuccess && userRole === "SELLER" && (
            <>
              <Link to="/seller/dashboard">Seller Dashboard</Link>

              {/* SELLER ORDERS LINK WITH BADGE */}
              <Link to="/seller/orders" className="relative">
                View Orders
                {sellerOrderCount > 0 && (
                  <span className="
                    absolute -top-2 -right-3 
                    bg-red-500 text-white text-xs px-2 py-[2px] rounded-full
                  ">
                    {sellerOrderCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* CUSTOMER ONLY */}
          {isSuccess && userRole === "CUSTOMER" && (
            <>
              <Link to="/become-seller">Become Seller</Link>

              {/* ⭐ CUSTOMER MY ORDERS WITH BADGE */}
              <Link to="/my-orders" className="relative">
                My Orders
                {customerOrderCount > 0 && (
                  <span className="
                    absolute -top-2 -right-3 bg-green-600 text-white text-xs
                    px-2 py-[2px] rounded-full
                  ">
                    {customerOrderCount}
                  </span>
                )}
              </Link>

              {/* CART ICON */}
              <Link to="/cart" className="relative">
                <ShoppingCart size={26} className="hover:text-gray-200" />
                {cartCount > 0 && (
                  <span className="
                    absolute -top-2 -right-2 bg-red-500 text-white text-xs
                    px-2 py-[2px] rounded-full
                  ">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
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

      {/* MOBILE OVERLAY */}
      {open && (
        <div 
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
        ></div>
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-700 text-white shadow-xl 
          transform transition-transform duration-300 md:hidden z-50
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b border-blue-500">
          <h2 className="text-lg font-bold">Menu</h2>
          <button onClick={() => setOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <div className="flex flex-col mt-4 space-y-4 pl-6 text-lg">

          <Link to="/" onClick={() => setOpen(false)}>Home</Link>

          {isSuccess && (
            <Link to="/foods" onClick={() => setOpen(false)}>Foods</Link>
          )}

          {/* SELLER MOBILE */}
          {isSuccess && userRole === "SELLER" && (
            <>
              <Link to="/seller/dashboard" onClick={() => setOpen(false)}>
                Seller Dashboard
              </Link>

              <Link 
                to="/seller/orders"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                View Orders
                {sellerOrderCount > 0 && (
                  <span className="bg-red-500 px-2 py-[1px] rounded-full text-xs">
                    {sellerOrderCount}
                  </span>
                )}
              </Link>
            </>
          )}

          {/* CUSTOMER MOBILE */}
          {isSuccess && userRole === "CUSTOMER" && (
            <>
              <Link 
                to="/become-seller"  
                onClick={() => setOpen(false)}>
                Become Seller
              </Link>

              {/* CUSTOMER MY ORDERS */}
              <Link 
                to="/my-orders"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                My Orders
                {customerOrderCount > 0 && (
                  <span className="bg-green-600 px-2 py-[1px] rounded-full text-xs">
                    {customerOrderCount}
                  </span>
                )}
              </Link>

              {/* CART */}
              <Link 
                to="/cart"
                className="flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <ShoppingCart size={22} />
                Cart
                {cartCount > 0 && (
                  <span className="bg-red-500 px-2 py-[1px] rounded-full text-xs">
                    {cartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          <Link to="/profile" onClick={() => setOpen(false)}>Profile</Link>

          {!isSuccess ? (
            <>
              <Link to="/signup" onClick={() => setOpen(false)}>Signup</Link>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
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








