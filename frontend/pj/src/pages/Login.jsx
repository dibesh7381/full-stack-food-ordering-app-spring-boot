import { useState, useEffect } from "react";
import { useLoginMutation } from "../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });

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
      await login(form).unwrap();
      setSuccessMsg("Login successful!");

      setTimeout(() => navigate("/profile"), 2000);

    } catch (err) {
      setErrorMsg(err?.data?.message || "Login failed. Try again!");
    }
  };

  // Auto-hide after 2 sec
  useEffect(() => {
    if (errorMsg || successMsg) {
      const t = setTimeout(() => {
        setErrorMsg("");
        setSuccessMsg("");
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [errorMsg, successMsg]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md border">

        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Email</label>
            <input
              name="email"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              value={form.email}
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
              value={form.password}
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
            Login
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}


