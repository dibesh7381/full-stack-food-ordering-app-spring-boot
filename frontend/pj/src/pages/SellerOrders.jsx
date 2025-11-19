import React from "react";
import {
  useGetSellerOrdersQuery,
  useCancelSellerOrderMutation,
} from "../api/authApi";

const SellerOrders = () => {
  const { data, isLoading } = useGetSellerOrdersQuery();
  const [cancelSellerOrder] = useCancelSellerOrderMutation();

  const orders = data?.data || [];

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await cancelSellerOrder(id).unwrap();
      alert("Order cancelled successfully!");
    } catch (err) {
      alert(err?.data?.message || "Failed to cancel");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading orders...</p>;

  // ⭐ Color mapping
  const statusColor = (status) => {
    if (status === "CANCELLED BY CUSTOMER") return "text-orange-600";
    if (status === "CANCELLED") return "text-red-600";
    return "text-green-600"; // PLACED
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 text-center">Orders Received</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id}
              className="p-4 bg-white border rounded-xl shadow hover:shadow-lg transition"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{o.foodName}</h2>

                {/* Show cancel only when status = PLACED */}
                {o.status === "PLACED" && (
                  <button
                    onClick={() => handleCancel(o.id)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Buyer Info */}
              <p className="text-sm text-blue-700 font-medium mt-1">
                Ordered by: <span className="font-semibold">{o.buyerName}</span>
              </p>

              {/* Status */}
              <p className={`mt-1 font-bold ${statusColor(o.status)}`}>
                {o.status}
              </p>

              {/* Details */}
              <p className="text-sm text-gray-700">Size: {o.size}</p>
              <p className="text-sm text-gray-700">Quantity: {o.quantity}</p>

              <p className="text-green-700 font-semibold text-lg mt-1">
                ₹{o.price}
              </p>

              {/* Date */}
              <p className="text-gray-500 text-sm mt-2">
                Ordered on:{" "}
                {new Date(o.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;





