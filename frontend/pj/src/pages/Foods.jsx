import React, { useState } from "react";
import { useGetAllFoodsQuery, useProfileQuery } from "../api/authApi";

const Foods = () => {
  const { data, isLoading } = useGetAllFoodsQuery();
  const foods = data?.data || [];

  // ⭐ Fetch logged-in user role
  const { data: profileData } = useProfileQuery();
  const userRole = profileData?.data?.role; // CUSTOMER | SELLER

  const [selectedSize, setSelectedSize] = useState({});
  const [quantity, setQuantity] = useState({});

  const handleSizeChange = (foodId, size) => {
    setSelectedSize((prev) => ({ ...prev, [foodId]: size }));
  };

  const handleQtyChange = (foodId, qty) => {
    setQuantity((prev) => ({ ...prev, [foodId]: qty }));
  };

  const handleBuyNow = (food) => {
    const size = selectedSize[food.id];
    const qty = quantity[food.id] || 1;

    if (!size) {
      alert("Please select size!");
      return;
    }

    alert(
      `BUY NOW:\nFood: ${food.name}\nSize: ${size}\nQty: ${qty}\nPrice: ₹${
        food.sizes.find((s) => s.size === size)?.price * qty
      }`
    );
  };

  if (isLoading) return <p className="text-center">Loading foods...</p>;

  return (
    <div className="max-w-6xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6">All Foods</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div key={food.id} className="border rounded-lg shadow p-4 bg-white">

            {/* Image */}
            <img
              src={food.imageUrl}
              className="w-full h-40 object-cover rounded"
              alt={food.name}
            />

            <h2 className="text-xl font-semibold mt-2">{food.name}</h2>

            {/* ⭐ Seller / Kitchen Name */}
            <p className="text-sm text-green-700 font-medium">
              {food.sellerName ? `By: ${food.sellerName}` : ""}
            </p>

            <p className="text-sm text-gray-600">
              {food.category} • {food.type}
            </p>

            {/* SIZE */}
            <div className="mt-3">
              <label className="font-semibold text-sm">Choose Size:</label>

              <select
                className="border p-2 w-full rounded mt-1"
                onChange={(e) => handleSizeChange(food.id, e.target.value)}
                disabled={userRole === "SELLER"}
              >
                <option value="">Select Size</option>
                {food.sizes.map((s) => (
                  <option key={s.size} value={s.size}>
                    {s.size} — ₹{s.price}
                  </option>
                ))}
              </select>
            </div>

            {/* QUANTITY */}
            <div className="mt-3">
              <label className="font-semibold text-sm">Quantity:</label>

              <input
                type="number"
                min="1"
                defaultValue={1}
                className="border p-2 w-full rounded mt-1"
                onChange={(e) => handleQtyChange(food.id, e.target.value)}
                disabled={userRole === "SELLER"}
              />
            </div>

            {/* BUY NOW BUTTON */}
            <button
              className={`w-full mt-4 py-2 rounded font-semibold ${
                userRole === "SELLER"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
              disabled={userRole === "SELLER"}
              onClick={() => handleBuyNow(food)}
            >
              {userRole === "SELLER" ? "Only Customers Can Buy" : "Buy Now"}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Foods;


