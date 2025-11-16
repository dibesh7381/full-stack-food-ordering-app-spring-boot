import { useState, useEffect } from "react";
import { useBecomeSellerMutation } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function BecomeSeller() {
  const [step, setStep] = useState(1);
  const [becomeSeller] = useBecomeSellerMutation();
  const navigate = useNavigate();

  // ------------------------------------
  // LOCAL STORAGE STATE
  // ------------------------------------
  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("sellerForm");
    return saved
      ? JSON.parse(saved)
      : {
          shopName: "",
          location: "",
          establishedYear: "",
          businessType: "",
          ownerName: "",
        };
  });

  const [imageFile, setImageFile] = useState(null);

  // Save to localStorage on every form change
  useEffect(() => {
    localStorage.setItem("sellerForm", JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // ------------------------------------
  // FINAL SUBMIT HANDLER
  // ------------------------------------
  const handleSubmit = async () => {
    if (!imageFile) return alert("Please upload a shop image.");

    const fd = new FormData();
    fd.append(
      "data",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );
    fd.append("image", imageFile);

    await becomeSeller(fd).unwrap();

    alert("🎉 Your Seller Account Is Successfully Created!");
    localStorage.removeItem("sellerForm");

    navigate("/profile"); // ⭐ redirect after seller creation
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 shadow-lg rounded-xl">

        <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">
          Become a Seller 🛒
        </h2>

        {/* ⭐ STEP 1 – SHOP DETAILS */}
        {step === 1 && (
          <div className="space-y-4">

            <input
              name="shopName"
              value={form.shopName}
              onChange={handleChange}
              placeholder="Shop Name"
              className="w-full p-3 border rounded-lg"
            />

            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-3 border rounded-lg"
            />

            <input
              name="establishedYear"
              value={form.establishedYear}
              onChange={handleChange}
              placeholder="Established Year (e.g., 2018)"
              className="w-full p-3 border rounded-lg"
            />

            <button
              onClick={nextStep}
              className="w-full bg-blue-600 text-white py-3 rounded-lg mt-4"
            >
              Next →
            </button>
          </div>
        )}

        {/* ⭐ STEP 2 – BUSINESS DETAILS */}
        {step === 2 && (
          <div className="space-y-4">

            <select
              name="businessType"
              value={form.businessType}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select Business Type</option>
              <option>Restaurant</option>
              <option>Hotel</option>
              <option>Dhaba</option>
              <option>Cloud Kitchen</option>
            </select>

            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Owner Name"
              className="w-full p-3 border rounded-lg"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                ← Back
              </button>

              <button
                onClick={nextStep}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Next →
              </button>
            </div>
          </div>
        )}

        {/* ⭐ STEP 3 – IMAGE UPLOAD + SUBMIT */}
        {step === 3 && (
          <div className="space-y-4">

            <label className="font-medium">Upload Shop Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full p-3 border rounded-lg"
            />

            <div className="flex justify-between mt-4">
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
              >
                ← Back
              </button>

              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Become Seller ✔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
