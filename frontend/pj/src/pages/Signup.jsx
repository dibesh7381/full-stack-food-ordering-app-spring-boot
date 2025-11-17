import { useState, useEffect } from "react";
import { useSignupMutation } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [signup] = useSignupMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await signup(form).unwrap();
      setSuccessMsg("Signup successful! Redirecting...");

      // redirect after 2 sec
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setErrorMsg(err?.data?.message || "Signup failed. Try again!");
    }
  };

  // Auto hide messages
  useEffect(() => {
    if (errorMsg || successMsg) {
      const timer = setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg, successMsg]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md border">

        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Username</label>
            <input
              name="username"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username"
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Email</label>
            <input
              name="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Password</label>
            <input
              name="password"
              type="password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              onChange={handleChange}
            />
          </div>

          {/* FIXED SPACE FOR ERROR / SUCCESS MESSAGE */}
          <div className="h-6 text-center">
            {errorMsg && (
              <p className="text-red-600 text-sm">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-green-600 text-sm">{successMsg}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Signup
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}


