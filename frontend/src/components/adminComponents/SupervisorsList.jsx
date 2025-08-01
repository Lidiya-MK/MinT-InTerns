import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../adminComponents/Sidebar";
import defaultImage from "../../assets/default-avatar.png";

export default function SupervisorsList() {
  const [supervisors, setSupervisors] = useState([]);

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

  return (
    <div className="flex min-h-screen bg-[#0f1a1c] text-white">
      <Sidebar />

      <main className="flex-1 p-6">
        <h2 className="text-3xl font-bold mb-6 text-white drop-shadow">Supervisors Overview</h2>

        <div className="space-y-4">
          {supervisors.map((supervisor) => (
            <div
              key={supervisor._id}
              className="bg-[#1c2a2d] border border-transparent hover:border-[#EA9753] transition-all duration-200 rounded-2xl p-5 flex items-center gap-4"
            >
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
          ))}
        </div>

        {supervisors.length === 0 && (
          <p className="text-center mt-20 text-gray-400 animate-pulse">
            No supervisors found. Please check back later.
          </p>
        )}
      </main>
    </div>
  );
}
