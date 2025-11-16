import React, { useState } from "react";
import {
  useAddFoodMutation,
  useGetMyFoodsQuery,
  useDeleteFoodMutation,
  useUpdateFoodMutation,
} from "../api/authApi";

const AddFoodForm = () => {

  const sizeOptionsByCategory = {
    Curry: ["HALF", "REGULAR", "LARGE"],
    Pizza: ["SMALL", "MEDIUM", "LARGE"],
    Biryani: ["HALF", "FULL"],
    Drinks: ["250ML", "500ML", "1LTR"],
    Dosa: ["REGULAR"],
    Wada: ["REGULAR"],
  };

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    category: "",
    description: "",
    imageBase64: "",
  });

  const [sizes, setSizes] = useState([]);
  const [prices, setPrices] = useState({});

  const [editingId, setEditingId] = useState(null); // ⭐ EDIT MODE

  // HOOKS
  const [addFood] = useAddFoodMutation();
  const [updateFood] = useUpdateFoodMutation();
  const { data: foodsData } = useGetMyFoodsQuery();
  const [deleteFood] = useDeleteFoodMutation();

  // ⭐ IMAGE TO BASE64
  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, imageBase64: reader.result }));
    };

    reader.readAsDataURL(file);
  };

  const handleCategoryChange = (value) => {
    setFormData({ ...formData, category: value });
    setSizes(sizeOptionsByCategory[value] || []);
  };

  const handlePriceChange = (size, value) => {
    setPrices({ ...prices, [size]: value });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      category: "",
      description: "",
      imageBase64: "",
    });
    setSizes([]);
    setPrices({});
    setEditingId(null);
  };

  // ⭐ SUBMIT HANDLER (ADD + UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalSizes = sizes.map((size) => ({
      size,
      price: Number(prices[size] || 0),
    }));

    const payload = { ...formData, sizes: finalSizes };

    try {
      if (editingId) {
        // ⭐ UPDATE
        await updateFood({ id: editingId, body: payload }).unwrap();
        alert("Food Updated!");
      } else {
        // ⭐ ADD NEW
        await addFood(payload).unwrap();
        alert("Food Added!");
      }
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed!");
    }
  };

  // ⭐ DELETE FOOD
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this food?")) return;

    try {
      await deleteFood(id).unwrap();
      alert("Food Deleted!");
    } catch (err) {
      console.error(err);
      alert("Delete Failed!");
    }
  };

  // ⭐ EDIT FOOD — PREFILL FORM
  const handleEdit = (food) => {
    setEditingId(food.id);
    setFormData({
      name: food.name,
      type: food.type,
      category: food.category,
      description: food.description,
      imageBase64: food.imageUrl, // ⭐ optional: existing image
    });

    setSizes(food.sizes.map((s) => s.size));

    const priceMap = {};
    food.sizes.forEach((s) => (priceMap[s.size] = s.price));
    setPrices(priceMap);
  };

  return (
    <div className="p-5 max-w-5xl mx-auto space-y-10">

      {/* ================= FORM ================== */}
      <form
        onSubmit={handleSubmit}
        className="p-5 max-w-xl mx-auto space-y-4 border rounded shadow"
      >
        <h2 className="text-xl font-bold">
          {editingId ? "Edit Food" : "Add New Food"}
        </h2>

        <div>
          <label>Food Name</label>
          <input
            type="text"
            className="border p-2 w-full"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div>
          <label>Type</label>
          <select
            className="border p-2 w-full"
            value={formData.type}
            onChange={(e) =>
              setFormData({ ...formData, type: e.target.value })
            }
          >
            <option value="">Select</option>
            <option value="VEG">VEG</option>
            <option value="NONVEG">NON-VEG</option>
          </select>
        </div>

        <div>
          <label>Category</label>
          <select
            className="border p-2 w-full"
            value={formData.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">Choose Category</option>
            {Object.keys(sizeOptionsByCategory).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Description</label>
          <textarea
            className="border p-2 w-full"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </div>

        <div>
          <label>Food Image</label>
          <input
            type="file"
            className="border p-2 w-full"
            onChange={handleImage}
            accept="image/*"
          />
        </div>

        {sizes.length > 0 && (
          <>
            <h3 className="font-semibold">Sizes & Prices</h3>
            {sizes.map((size) => (
              <div key={size} className="flex gap-4 mb-2">
                <input className="border p-2 w-1/2" value={size} disabled />
                <input
                  type="number"
                  className="border p-2 w-1/2"
                  value={prices[size] || ""}
                  placeholder={`Price for ${size}`}
                  onChange={(e) => handlePriceChange(size, e.target.value)}
                />
              </div>
            ))}
          </>
        )}

        <button className="bg-green-600 text-white p-2 rounded w-full">
          {editingId ? "Update Food" : "Add Food"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-600 text-white p-2 rounded w-full mt-2"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* ================= FOOD LIST ================== */}
      <h2 className="text-2xl font-bold">My Foods</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {foodsData?.data?.map((food) => (
          <div
            key={food.id}
            className="border rounded shadow p-3 space-y-2 bg-white"
          >
            <img
              src={food.imageUrl}
              className="w-full h-40 object-cover rounded"
              alt="food"
            />

            <h3 className="font-bold text-lg">{food.name}</h3>
            <p className="text-sm text-gray-700">
              {food.category} • {food.type}
            </p>

            <div className="text-sm">
              {food.sizes.map((s) => (
                <div key={s.size} className="flex justify-between">
                  <span>{s.size}</span>
                  <span>₹{s.price}</span>
                </div>
              ))}
            </div>

            <button
              className="bg-blue-600 text-white w-full p-2 rounded"
              onClick={() => handleEdit(food)}
            >
              Edit
            </button>

            <button
              className="bg-red-600 text-white w-full p-2 rounded mt-2"
              onClick={() => handleDelete(food.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFoodForm;






