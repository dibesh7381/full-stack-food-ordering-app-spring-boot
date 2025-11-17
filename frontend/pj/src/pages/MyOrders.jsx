import React from "react";
import { useGetMyOrdersQuery, useDeleteMyOrderMutation } from "../api/authApi";

const MyOrders = () => {
  const { data, isLoading, refetch } = useGetMyOrdersQuery();
  const [deleteMyOrder] = useDeleteMyOrderMutation();
  const orders = data?.data || [];

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await deleteMyOrder(id).unwrap();
      alert("Order canceled successfully!");
      refetch(); // refresh list
    } catch (err) {
      alert(err?.data?.message || "Failed to cancel order");
    }
  };

  if (isLoading) {
    return <p className="text-center mt-10 text-lg">Loading your orders...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 text-center">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.orderId}
              className="p-4 border rounded-xl shadow bg-white hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{o.foodName}</h2>

                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {o.size}
                </span>
              </div>

              <p className="text-gray-700 mt-2">
                Quantity:{" "}
                <span className="font-semibold text-black">{o.quantity}</span>
              </p>

              <p className="text-green-700 mt-1 font-medium">
                Total Price: ₹{o.price}
              </p>

              <p className="text-gray-500 text-sm mt-3">
                Ordered on:{" "}
                {new Date(o.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>

              {/* ⭐ CANCEL BUTTON */}
              <button
                onClick={() => handleCancel(o.orderId)}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
              >
                Cancel Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;

