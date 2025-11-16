import { useState, useEffect } from "react";
import { useProfileQuery, useUpdateProfileMutation } from "../api/authApi";

export default function Profile() {
  const { data, isLoading } = useProfileQuery();
  const [updateProfile] = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
  });

  // Load profile data
  useEffect(() => {
    if (data?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        username: data.data.username,
        email: data.data.email,
      });
    }
  }, [data]);

  if (isLoading) return <p className="p-4 text-center">Loading...</p>;

  const user = data.data;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateProfile(form).unwrap();
    alert("Profile updated!");
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md border">

        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          My Profile
        </h2>

        {/* USERNAME */}
        <div className="mb-4">
          <label className="font-medium">Username</label>
          {isEditing ? (
            <input
              name="username"
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.username}
              onChange={handleChange}
            />
          ) : (
            <p className="text-lg mt-1">{user.username}</p>
          )}
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <label className="font-medium">Email</label>
          {isEditing ? (
            <input
              name="email"
              className="w-full p-3 border rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={handleChange}
            />
          ) : (
            <p className="text-lg mt-1">{user.email}</p>
          )}
        </div>

        {/* ROLE */}
        <div className="mb-4">
          <label className="font-medium">Role</label>
          <p className="text-lg mt-1">{user.role}</p>
        </div>

        {/* BUTTONS */}
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Save
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                setForm({ username: user.username, email: user.email });
              }}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

