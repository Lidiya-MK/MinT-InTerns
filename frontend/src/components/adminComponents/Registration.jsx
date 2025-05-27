import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../adminComponents/Sidebar"; // Adjust path if needed

export default function Registration({ view }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    const endpoint =
      view === "register-admin"
        ? "http://localhost:5000/api/admin/register"
        : "http://localhost:5000/api/admin/register/supervisor";

    try {
      const { data } = await axios.post(
        endpoint,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`${data}`)

      toast.success("Registration successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      const msg = error?.response?.data?.message || "Something went wrong!";
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Right side main content */}
      <main className="flex-1 flex justify-center items-center bg-[#272a2b] p-6">
        <section className="w-full max-w-lg bg-white p-6 rounded shadow">
          <h3 className="text-xl font-semibold mb-4">
            {view === "register-admin"
              ? "Register New Administrator"
              : "Register New Supervisor"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="6-digit Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full border border-gray-300 p-2 rounded"
              required
            />
            <button
              type="submit"
              className="w-full bg-[#D25B24] text-white p-2 rounded"
            >
              {view === "register-admin"
                ? "Register Administrator"
                : "Register Supervisor"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
