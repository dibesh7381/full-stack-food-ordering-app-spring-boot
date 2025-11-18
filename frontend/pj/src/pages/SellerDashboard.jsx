import { useGetSellerQuery, useGetSellerOrdersQuery } from "../api/authApi";
import AddFoodForm from "../components/AddFoodForm";
import { useNavigate } from "react-router-dom";

export default function SellerDashboard() {
  const { data, isLoading, error } = useGetSellerQuery();
  const { data: ordersData } = useGetSellerOrdersQuery();

  const navigate = useNavigate();

  if (isLoading)
    return <p className="text-center p-6">Loading...</p>;

  if (error)
    return (
      <p className="text-center p-6 text-red-600">
        Error loading seller data
      </p>
    );

  const seller = data?.data;
  const orderCount = ordersData?.data?.length || 0;

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6 relative z-0">

      {/* GRID WRAPPER — full responsive */}
      <div className="w-full max-w-7xl mx-auto grid 
        grid-cols-1 md:grid-cols-2 xl:grid-cols-3 
        gap-6 md:gap-8">

        {/* ⭐ LEFT PANEL — Seller Profile */}
        <div className="col-span-1 bg-white rounded-3xl shadow-lg p-6 
          border border-gray-200 relative z-0">

          {/* Profile Header */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={seller.imageUrl}
              alt="Shop"
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl 
              shadow-md border object-cover"
            />
            <h1 className="text-xl md:text-2xl font-bold text-blue-700 mt-3">
              {seller.shopName}
            </h1>
            <p className="text-gray-500 text-sm">{seller.location}</p>
          </div>

          {/* Store Details */}
          <div className="bg-blue-50 rounded-2xl p-4 shadow-inner mb-6 w-full">
            <h2 className="text-lg font-semibold text-blue-700 mb-3">
              Store Details
            </h2>

            <div className="space-y-2 text-sm md:text-base">
              <p><span className="font-semibold">Owner:</span> {seller.ownerName}</p>
              <p><span className="font-semibold">Business:</span> {seller.businessType}</p>
              <p><span className="font-semibold">Established:</span> {seller.establishedYear}</p>
            </div>
          </div>

          {/* ⭐ View Orders Button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/seller/orders")}
              className="relative z-0 flex items-center gap-3 px-5 py-3 
                bg-blue-600 text-white text-sm md:text-base font-semibold 
                rounded-xl hover:bg-blue-700 shadow-md transition w-full"
            >
              View Orders

              {/* Badge */}
              {orderCount > 0 && (
                <span
                  className="absolute z-0 -top-2 -right-2 bg-red-600 text-white 
                    text-xs font-bold px-2 py-1 rounded-full shadow-md"
                >
                  {orderCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ⭐ RIGHT PANEL — Add Food Form */}
        <div className="col-span-1 md:col-span-1 xl:col-span-2 
          bg-white rounded-3xl shadow-lg p-6 border border-gray-200 relative z-0">

          <h2 className="text-xl md:text-2xl font-bold text-blue-700 mb-6">
            Add New Food Item
          </h2>

          <AddFoodForm />
        </div>

      </div>
    </div>
  );
}
