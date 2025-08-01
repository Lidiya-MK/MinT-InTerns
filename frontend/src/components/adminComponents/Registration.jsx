import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../adminComponents/Sidebar";
import { User, Mail, Lock, File } from "lucide-react";

export default function Registration({ view }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState(null);

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

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("password", formData.password);
    if (profilePicture) payload.append("profilePicture", profilePicture);

    try {
      const { data } = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Registration response:", data);

      toast.success("Registration successful!");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setProfilePicture(null);
    } catch (error) {
      const msg = error?.response?.data?.message || "Something went wrong!";
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
     <main className="flex-1 flex justify-center items-center bg-[#272a2b] p-6">
  <section className="w-full max-w-lg bg-[#1f262a] p-8 rounded-3xl shadow-lg border border-gray-700">
    <h3 className="text-2xl font-semibold mb-6 text-[#ffffff] tracking-wide">
      {view === "register-admin"
        ? "Register New Administrator"
        : "Register New Supervisor"}
    </h3>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Full Name */}
      <div className="relative">
        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-[#2b353a] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#EA9753] transition"
          required
        />
      </div>

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-[#2b353a] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#EA9753] transition"
          required
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="password"
          placeholder="6-digit Password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="w-full bg-[#2b353a] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#EA9753] transition"
          required
        />
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          className="w-full bg-[#2b353a] border border-gray-600 text-gray-200 placeholder-gray-500 rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#EA9753] transition"
          required
        />
      </div>

      {/* File Upload */}
      <div className="relative">
        <File className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProfilePicture(e.target.files[0])}
          className="w-full bg-[#2b353a] border border-gray-600 text-gray-200 rounded-2xl py-3 pl-11 pr-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#EA9753] transition"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-[#D25B24] hover:bg-[#f19a4b] text-white py-3 rounded-3xl font-semibold transition"
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
