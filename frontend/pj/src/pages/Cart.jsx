import React from "react";
import {
  useGetMyCartQuery,
  useIncreaseQtyMutation,
  useDecreaseQtyMutation,
  useDeleteCartItemMutation
} from "../api/authApi";

import { Trash2, Plus, Minus } from "lucide-react";

export default function Cart() {
  const { data, isLoading } = useGetMyCartQuery();
  const cartItems = data?.data || [];

  const [increaseQty] = useIncreaseQtyMutation();
  const [decreaseQty] = useDecreaseQtyMutation();
  const [deleteItem] = useDeleteCartItemMutation();

  if (isLoading)
    return <p className="text-center mt-10 text-lg">Loading your cart...</p>;

  // ⭐ Calculate total amount
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="max-w-3xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">Your cart is empty 😢</p>
      ) : (
        <div className="space-y-5">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-white shadow rounded-lg border"
            >
              {/* IMAGE */}
              <img
                src={item.imageUrl}
                alt={item.foodName}
                className="w-20 h-20 rounded object-cover border"
              />

              {/* INFO */}
              <div className="flex-1">
                <h2 className="font-bold text-lg">{item.foodName}</h2>
                <p className="text-gray-600 text-sm">
                  Size: <b>{item.size}</b>
                </p>
                <p className="text-blue-600 font-semibold mt-1">
                  ₹ {item.price}
                </p>

                {/* QUANTITY BUTTONS */}
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={() => decreaseQty(item.id)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <Minus size={16} />
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

                  <button
                    onClick={() => increaseQty(item.id)}
                    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteItem(item.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={26} />
              </button>
            </div>
          ))}

          {/* TOTAL PRICE BOX */}
          <div className="bg-gray-100 p-4 rounded-lg border mt-6">
            <h2 className="text-xl font-bold">Total: ₹ {total}</h2>

            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700">
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
