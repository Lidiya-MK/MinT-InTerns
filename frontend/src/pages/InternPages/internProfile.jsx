// src/pages/InternProfilePage.jsx
import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";
import { toast } from "react-hot-toast";
import { FiEdit2 } from "react-icons/fi";

export default function InternProfilePage() {
  const { id } = useParams();
  const [intern, setIntern] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const inputFileRef = useRef(null);

  useEffect(() => {
    fetchInternData();
  }, [id]);

  const fetchInternData = async () => {
    try {
      const token = localStorage.getItem("internToken");
      if (!token || !id) return toast.error("Missing credentials. Please login again.");

      const { data } = await axios.get(`http://localhost:5000/api/interns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIntern(data);
      setEmail(data.email);
      setPreviewImage(getImageUrl(data.profilePicture));
    } catch (err) {
      console.error(err);
      toast.error("Failed to load intern data.");
    }
  };

  const getImageUrl = (path) =>
    path ? `http://localhost:5000/${path.replace(/\\/g, "/")}` : "/default-avatar.png";

  // Handle image file select
  const onProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePictureFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Confirm Save: open modal
  const handleSaveClick = () => {
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsConfirmOpen(true);
  };

  // Perform Save after confirmation
  const handleConfirmSave = async () => {
    try {
      const token = localStorage.getItem("internToken");
      const formData = new FormData();
      formData.append("email", email);
      if (password) formData.append("password", password);
      if (profilePictureFile) formData.append("profilePicture", profilePictureFile);

      await axios.patch(`http://localhost:5000/api/interns/${id}/profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Profile updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setProfilePictureFile(null);
      setIsConfirmOpen(false);
      fetchInternData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile.");
      setIsConfirmOpen(false);
    }
  };

  if (!intern) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-6">
      {/* HEADER */}
      <header className="sticky top-0 z-50 flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 md:p-6 rounded-2xl shadow border border-gray-200 mb-6">
        <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-0">
          <div className="relative w-16 h-16 md:w-20 md:h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#144145] to-[#1D7F8C] blur-sm opacity-30 animate-pulse"></div>
            <img
              src={previewImage}
              alt="Profile"
              className="relative rounded-full border-4 border-[#1D7F8C] shadow-md object-cover w-full h-full"
            />
            {/* Pen Icon Overlay */}
            <button
              type="button"
              onClick={() => inputFileRef.current?.click()}
              title="Change Profile Picture"
              className="absolute bottom-0 right-0 bg-[#144145] hover:bg-[#0f2c2f] text-white p-1 rounded-full shadow-md transition"
            >
              <FiEdit2 size={18} />
            </button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={inputFileRef}
              onChange={onProfilePicChange}
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-800">{intern?.name}</h1>
            <p className="text-xs md:text-sm text-gray-500 mt-1">Intern Profile Page</p>
          </div>
        </div>
        <img src={logo} alt="System Logo" className="h-10 w-auto" />
      </header>

      {/* TABS */}
      <div className="flex justify-center gap-4 mb-4 border-b border-gray-300">
        <Link
          to={`/internDashboard/${id}`}
          className="px-4 py-2 font-semibold border-b-4 border-transparent text-gray-500 hover:text-[#144145] hover:border-[#144145] transition"
        >
          Projects
        </Link>
        <Link
          to={`/interns/${id}/profile`}
          className="px-4 py-2 font-semibold border-b-4 border-transparent text-gray-500 hover:text-[#EA9753] hover:border-[#EA9753] transition"
        >
          Profile
        </Link>
      </div>

      {/* PROFILE FORM CARD */}
      <div className="flex-1 bg-white p-6 rounded-xl border border-gray-300 shadow max-w-md mx-auto">
        {/* Current Email */}
        <p className="text-gray-700 mb-6 text-center text-lg font-semibold">Update Your Profile</p>

        {/* Update Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-1 font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D7F8C] focus:border-transparent"
          />
        </div>

        {/* Update Password */}
        <div className="mb-4">
          <label htmlFor="password" className="block mb-1 font-medium text-gray-700">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter new password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D7F8C] focus:border-transparent"
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block mb-1 font-medium text-gray-700">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            placeholder="Confirm new password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1D7F8C] focus:border-transparent"
          />
        </div>

        {/* Save Changes Button */}
        <button
          onClick={handleSaveClick}
          className="w-full bg-[#1D7F8C] hover:bg-[#155c60] text-white font-semibold py-2 rounded-md transition"
        >
          Save Changes
        </button>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold mb-4">Confirm Profile Update</h2>
            <p className="mb-6">Are you sure you want to save these changes?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSave}
                className="px-4 py-2 bg-[#1D7F8C] text-white rounded hover:bg-[#155c60] transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
