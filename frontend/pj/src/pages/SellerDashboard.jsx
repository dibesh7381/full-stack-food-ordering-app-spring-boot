import { useGetSellerQuery } from "../api/authApi";
import AddFoodForm from "../components/AddFoodForm";

export default function SellerDashboard() {
  const { data, isLoading, error } = useGetSellerQuery();

  if (isLoading) return <p className="text-center p-6">Loading...</p>;
  if (error) return <p className="text-center p-6 text-red-600">Error loading seller data</p>;

  const seller = data?.data;

  return (
    <>
         <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-6 border">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Seller Dashboard
        </h1>

        {/* Image */}
        <div className="flex justify-center mb-6">
          <img
            src={seller.imageUrl}
            alt="Shop"
            className="w-40 h-40 object-cover rounded-xl shadow-md border"
          />
        </div>

        {/* Info Card */}
        <div className="bg-gray-50 rounded-xl p-5 shadow-inner space-y-4">

          <div>
            <p className="text-sm text-gray-500 font-semibold">Shop Name</p>
            <p className="text-lg font-medium">{seller.shopName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-semibold">Location</p>
            <p className="text-lg font-medium">{seller.location}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-semibold">Established Year</p>
            <p className="text-lg font-medium">{seller.establishedYear}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-semibold">Business Type</p>
            <p className="text-lg font-medium">{seller.businessType}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500 font-semibold">Owner Name</p>
            <p className="text-lg font-medium">{seller.ownerName}</p>
          </div>

        </div>
      </div>
    </div>

    <AddFoodForm/>
    </>
    
  );
}

