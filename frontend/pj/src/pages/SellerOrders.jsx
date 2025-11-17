import React from "react";
import {
  useGetSellerOrdersQuery,
  useDeleteSellerOrderMutation,
} from "../api/authApi";

const SellerOrders = () => {
  const { data, isLoading, refetch } = useGetSellerOrdersQuery();
  const [deleteSellerOrder] = useDeleteSellerOrderMutation();

  const orders = data?.data || [];

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await deleteSellerOrder(id).unwrap();
      alert("Order deleted successfully!");
      refetch();
    } catch (err) {
      alert(err?.data?.message || "Failed to delete order");
    }
  };

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 text-center">Orders Received</h1>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.orderId}
              className="p-4 bg-white border rounded-xl shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">{o.foodName}</h2>

                {/* ⭐ DELETE BUTTON */}
                <button
                  onClick={() => handleDelete(o.orderId)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              <p className="text-sm text-gray-700">Size: {o.size}</p>
              <p className="text-sm text-gray-700">Quantity: {o.quantity}</p>

              <p className="text-green-700 font-medium text-lg mt-1">
                ₹{o.price}
              </p>

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

