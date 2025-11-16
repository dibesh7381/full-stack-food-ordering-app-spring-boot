import { useHomepageQuery } from "../api/authApi";

export default function Homepage() {
  const { data, isLoading } = useHomepageQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  const home = data?.data; // ApiResponseDTO → data

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md border">

        <h1 className="text-3xl font-bold text-blue-600 text-center mb-4">
          {home?.title}
        </h1>

        <p className="text-gray-700 text-center text-lg leading-relaxed">
          {home?.content}
        </p>

      </div>
    </div>
  );
}
