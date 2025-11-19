import React from "react";
import { useGetMyOrdersQuery, useCancelMyOrderMutation } from "../api/authApi";

const MyOrders = () => {
  const { data, isLoading } = useGetMyOrdersQuery();
  const [cancelMyOrder] = useCancelMyOrderMutation();

  const orders = data?.data || [];

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await cancelMyOrder(id).unwrap();
      alert("Order cancelled successfully!");
    } catch (err) {
      alert(err?.data?.message || "Failed to cancel order");
    }
  };

  if (isLoading)
    return <p className="text-center mt-10 text-lg">Loading your orders...</p>;

  // ⭐ Color mapping
  const statusColor = (status) => {
    if (status === "CANCELLED BY SELLER") return "text-orange-600";
    if (status === "CANCELLED") return "text-red-600";
    return "text-green-600"; // PLACED or future statuses
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="p-4 border rounded-xl shadow bg-white hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{o.foodName}</h2>

                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {o.size}
                </span>
              </div>

              {/* Backend Status */}
              <p className={`mt-2 font-bold ${statusColor(o.status)}`}>
                {o.status}
              </p>

              <p className="text-gray-700">
                Quantity: <span className="font-semibold">{o.quantity}</span>
              </p>

              <p className="text-green-700 font-semibold text-lg">
                ₹{o.price}
              </p>

              <p className="text-gray-500 text-sm mt-2">
                Ordered on:{" "}
                {new Date(o.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              {/* Show cancel only when ACTIVE (PLACED) */}
              {o.status === "PLACED" && (
                <button
                  onClick={() => handleCancel(o.id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600"
                >
                  Cancel Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;





