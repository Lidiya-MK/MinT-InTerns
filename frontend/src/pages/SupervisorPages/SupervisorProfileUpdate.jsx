import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import defaultAvatar from "../../assets/default-avatar.png";
import logo from "../../assets/logo.png";
import { FiLogOut } from "react-icons/fi";

export default function SupervisorProfileUpdate() {
  const { supervisorId, cohortId } = useParams();
  const navigate = useNavigate();

  const [supervisor, setSupervisor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profilePicture: null,
  });
  const [previewImage, setPreviewImage] = useState(null); // 👈 For profile preview

 const getImageUrl = (path) => {
  if (!path) return defaultAvatar;
  const fixedPath = path.includes("uploads/")
    ? path
    : `/uploads/${path}`;
  return `http://localhost:5000${fixedPath.replace(/\\/g, "/")}`;
};

  useEffect(() => {
    const fetchSupervisor = async () => {
      try {
        const token = localStorage.getItem("supervisorToken");
        const res = await fetch(`http://localhost:5000/api/supervisor/${supervisorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setSupervisor(data);
        setFormData((prev) => ({
          ...prev,
          name: data.name,
          email: data.email,
        }));
        setPreviewImage(getImageUrl(data.profilePicture)); 
      } catch (err) {
        toast.error("Failed to load supervisor info.",err);
      }
    };

    fetchSupervisor();
  }, [supervisorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, profilePicture: file }));
    setPreviewImage(URL.createObjectURL(file)); // 👈 Show preview before upload
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  const { password, confirmPassword } = formData;

  // If password is provided, validate length
  if (password && password.length < 6) {
    return toast.error("Password must be at least 6 characters long.");
  }

  // Password confirmation check
  if (password && password !== confirmPassword) {
    return toast.error("Passwords do not match.");
  }

  try {
    const token = localStorage.getItem("supervisorToken");
    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    if (password) form.append("password", password);
    if (formData.profilePicture) {
      form.append("profilePicture", formData.profilePicture);
    }

    const res = await fetch(
      `http://localhost:5000/api/supervisor/${supervisorId}/update`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    toast.success("Profile updated successfully!");
    navigate(`/supervisorDashboard/${supervisorId}/${cohortId}`);
  } catch (err) {
    toast.error(err.message || "Failed to update profile.");
  }
};


  const handleLogout = () => {
    localStorage.removeItem("supervisorToken");
    toast.success("Logged out successfully");
    navigate("/supervisor-login");
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-white text-black py-4 px-6 flex items-center justify-between rounded-b-3xl shadow-md">
        <div className="flex items-center gap-4">
          <img
            src={previewImage || defaultAvatar}
            alt="Profile"
            className="h-12 w-12 rounded-full object-cover border border-gray-400"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
          <div>
            <p className="text-lg font-semibold">{supervisor?.name || "Supervisor"}</p>
            <p className="text-sm text-gray-600">{supervisor?.email || ""}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            className="px-3 py-1.5 border border-[#144145] text-[#144145] rounded-2xl font-semibold hover:bg-[#144145] hover:text-white"
            onClick={() => navigate(`/supervisorDashboard/${supervisorId}/${cohortId}`)}
          >
            Dashboard
          </button>
          <button
            onClick={handleLogout}
            className="text-[#144145] hover:text-red-500 transition-colors duration-200"
            title="Logout"
          >
            <FiLogOut size={24} />
          </button>
          <img src={logo} alt="Logo" className="h-10 w-auto" />
        </div>
      </header>

      {/* Update Form */}
      <div className="max-w-xl mx-auto mt-10 bg-white text-black p-6 rounded-3xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Update Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 rounded border border-gray-300"
            />
          </div>
          <div>
            <label className="block font-semibold">New Password (optional)</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label className="block font-semibold">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 rounded border border-gray-300"
              placeholder="Re-enter new password"
            />
          </div>
          <div>
            <label className="block font-semibold">Profile Picture</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 rounded border border-gray-300 bg-white"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded bg-[#144145] text-white font-semibold hover:bg-[#0f2f30] transition"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
