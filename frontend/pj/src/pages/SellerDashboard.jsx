import { useGetSellerQuery } from "../api/authApi";
import AddFoodForm from "../components/AddFoodForm";

export default function SellerDashboard() {
  const { data, isLoading, error } = useGetSellerQuery();

  if (isLoading) return <p className="text-center p-6">Loading...</p>;
  if (error) return <p className="text-center p-6 text-red-600">Error loading seller data</p>;

  const seller = data?.data;

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex justify-center items-start">

      {/* PAGE CONTAINER */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* SELLER CARD (CHOTA CARD) */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border">

          <h1 className="text-2xl font-bold text-center text-blue-600 mb-5">
            Seller Dashboard
          </h1>

          <div className="flex justify-center mb-5">
            <img
              src={seller.imageUrl}
              alt="Shop"
              className="w-32 h-32 object-cover rounded-xl shadow-md border"
            />
          </div>

          {/* SMALLER INFO CARD */}
          <div className="bg-gray-50 rounded-xl p-4 shadow-inner space-y-3">

            <div>
              <p className="text-xs text-gray-500 font-semibold">Shop Name</p>
              <p className="text-base font-medium">{seller.shopName}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold">Location</p>
              <p className="text-base font-medium">{seller.location}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold">Established Year</p>
              <p className="text-base font-medium">{seller.establishedYear}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold">Business Type</p>
              <p className="text-base font-medium">{seller.businessType}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold">Owner Name</p>
              <p className="text-base font-medium">{seller.ownerName}</p>
            </div>

          </div>
        </div>

        {/* ADD FOOD FORM — SAME PAGE FIT */}
        <div className="bg-white rounded-2xl shadow-lg p-5 border">
          <h2 className="text-xl font-bold text-blue-600 mb-4 text-center">
            Add New Food Item
          </h2>
          <AddFoodForm />
        </div>

      </div>
    </div>
  );
}

