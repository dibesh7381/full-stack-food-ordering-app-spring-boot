import React, { useState } from "react";
import {
  useGetAllFoodsQuery,
  useProfileQuery,
  useAddToCartMutation,
  usePlaceOrderMutation,   // ⭐ NEW
} from "../api/authApi";
import { useNavigate } from "react-router-dom";
import { Plus, Minus } from "lucide-react";

const Foods = () => {
  const { data, isLoading } = useGetAllFoodsQuery();
  const foods = data?.data || [];

  const { data: profileData } = useProfileQuery();
  const userRole = profileData?.data?.role;

  const [addToCart] = useAddToCartMutation();
  const [placeOrder] = usePlaceOrderMutation(); // ⭐ NEW

  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState({});
  const [quantity, setQuantity] = useState({});

  const handleSizeChange = (foodId, size) => {
    setSelectedSize((prev) => ({ ...prev, [foodId]: size }));
  };

  const increaseQty = (id) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: (prev[id] || 1) + 1,
    }));
  };

  const decreaseQty = (id) => {
    setQuantity((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) - 1),
    }));
  };

  // ⭐ ADD TO CART
  const handleAddToCart = async (food) => {
    const size = selectedSize[food.id];
    const qty = quantity[food.id] || 1;

    if (!size) return alert("Please select size!");

    try {
      await addToCart({ foodId: food.id, size, quantity: qty }).unwrap();
      alert("Added to Cart!");
    } catch (err) {
      alert(err?.data?.message || "Failed to add to cart");
    }
  };

  // ⭐ BUY NOW → DIRECT PLACE ORDER
  const handleBuyNow = async (food) => {
    const size = selectedSize[food.id];
    const qty = quantity[food.id] || 1;

    if (!size) return alert("Please select size!");

    try {
      await placeOrder({
        foodId: food.id,
        size,
        quantity: qty,
      }).unwrap();

      alert("Order placed successfully!");

      navigate("/my-orders"); // ⭐ redirect to orders page
    } catch (err) {
      alert(err?.data?.message || "Failed to place order");
    }
  };

  if (isLoading) return <p className="text-center">Loading foods...</p>;

  return (
    <div className="max-w-6xl mx-auto p-5">

      {/* ⭐ TOP BAR */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Foods</h1>
      </div>

      {/* ⭐ FOOD GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {foods.map((food) => (
          <div
            key={food.id}
            className="border rounded-xl shadow-md p-4 bg-white hover:shadow-lg transition"
          >
            {/* ⭐ IMAGE */}
            <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h2 className="text-xl font-semibold mt-3">{food.name}</h2>

            <p className="text-sm text-green-700 font-medium">
              {food.sellerName ? `By: ${food.sellerName}` : ""}
            </p>

            <p className="text-sm text-gray-600">
              {food.category} • {food.type}
            </p>

            {/* ⭐ SIZE SELECT */}
            <div className="mt-3">
              <label className="font-semibold text-sm">Choose Size:</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {food.sizes.map((s) => {
                  const isSelected = selectedSize[food.id] === s.size;

                  return (
                    <button
                      key={s.size}
                      onClick={() => handleSizeChange(food.id, s.size)}
                      disabled={userRole === "SELLER"}
                      className={`px-3 py-1 rounded-full text-sm border transition 
                        ${
                          isSelected
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 border-gray-300 text-gray-700"
                        }
                        ${userRole === "SELLER" ? "opacity-50" : "hover:bg-blue-100"}
                      `}
                    >
                      {s.size} — ₹{s.price}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ⭐ QUANTITY */}
            <div className="mt-3">
              <label className="font-semibold text-sm">Quantity:</label>

              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => decreaseQty(food.id)}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                  disabled={userRole === "SELLER"}
                >
                  <Minus size={16} />
                </button>

                <span className="font-semibold text-lg">
                  {quantity[food.id] || 1}
                </span>

                <button
                  onClick={() => increaseQty(food.id)}
                  className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                  disabled={userRole === "SELLER"}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* ⭐ BUTTONS */}
            <div className="mt-4 flex gap-3">
              <button
                className={`flex-1 py-2 rounded font-semibold ${
                  userRole === "SELLER"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-yellow-500 text-white hover:bg-yellow-600"
                }`}
                disabled={userRole === "SELLER"}
                onClick={() => handleAddToCart(food)}
              >
                Add to Cart
              </button>

              <button
                className={`flex-1 py-2 rounded font-semibold ${
                  userRole === "SELLER"
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
                disabled={userRole === "SELLER"}
                onClick={() => handleBuyNow(food)}
              >
                Buy Now
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Foods;








