import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../adminComponents/Sidebar";
import defaultImage from "../../assets/default-avatar.png";
import { FiKey } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import toast from 'react-hot-toast';


export default function SupervisorsList() {
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:5000/api/admin/supervisors", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSupervisors(data);
      } catch (error) {
        console.error("Error fetching supervisors:", error);
      }
    };
    fetchSupervisors();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return defaultImage;
    const cleanPath = path.startsWith("/uploads/")
      ? path
      : `/uploads/${path.replace(/^\/+/, "").replace("uploads/", "")}`;
    return `http://localhost:5000${cleanPath}`;
  };

  const openModal = (supervisor) => {
    setSelectedSupervisor(supervisor);
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedSupervisor(null);
    setError("");
  };

  const handlePasswordUpdate = async () => {
    if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
    if (newPassword !== confirmPassword) return setError("Passwords do not match.");

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/supervisors/${selectedSupervisor._id}/password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeModal();
      toast.success("Password updated successfully.");
    } catch (error) {
      console.error("Failed to update password:", error);
      setError("Failed to update password.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0f1a1c] text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow">Supervisors Overview</h2>

        <div className="space-y-4">
          {supervisors.map((supervisor) => (
            <div
              key={supervisor._id}
              className="bg-[#1c2a2d] border border-transparent hover:border-[#EA9753] transition-all duration-200 rounded-2xl p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={getImageUrl(supervisor.profilePicture)}
                  alt={supervisor.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#EA9753]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImage;
                  }}
                />
                <div>
                  <h4 className="text-lg font-semibold text-white">{supervisor.name}</h4>
                  <p className="text-sm text-gray-400">{supervisor.email}</p>
                </div>
              </div>
              <button
                onClick={() => openModal(supervisor)}
                className="text-[#FFD700] text-xl hover:text-white transition"
                title="Change Password"
              >
                <FiKey />
              </button>
            </div>
          ))}
        </div>

        {supervisors.length === 0 && (
          <p className="text-center mt-20 text-gray-400 animate-pulse">
            No supervisors found. Please check back later.
          </p>
        )}
      </main>

      {/* Modal */}
      <Dialog open={isOpen} onClose={closeModal} className="relative z-50">
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <Dialog.Panel className="bg-white text-black p-8 rounded-2xl w-full max-w-md shadow-lg">
            <Dialog.Title className="text-xl font-semibold mb-4">Change Password</Dialog.Title>

            <p className="mb-2 text-gray-700">
              Supervisor: <span className="font-medium">{selectedSupervisor?.name}</span>
            </p>

            <input
              type="password"
              placeholder="New Password"
              className="w-full border border-gray-300 p-2 rounded mb-3"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 p-2 rounded mb-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

            <div className="flex justify-end gap-4">
              <button
                onClick={closeModal}
                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordUpdate}
                className="bg-[#EA9753] hover:bg-[#d47f3e] text-white px-4 py-2 rounded"
              >
                Update
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
