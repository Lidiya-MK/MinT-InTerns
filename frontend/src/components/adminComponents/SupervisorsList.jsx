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

  // Correctly resolve image URL
  const getImageUrl = (path) => {
    if (!path) return defaultImage;

    // If path already starts with /uploads/, use it directly
    const cleanPath = path.startsWith("/uploads/")
      ? path
      : `/uploads/profilePictures/${path.replace(/^\/+/, "").replace("uploads/", "")}`;

    return `http://localhost:5000${cleanPath}`;
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4 text-[#144145]">Supervisors</h2>
        <div className="space-y-4">
          {supervisors.map((supervisor) => (
            <div
              key={supervisor._id}
              className="bg-white shadow p-4 rounded-lg flex items-center space-x-4"
            >
              <img
                src={getImageUrl(supervisor.profilePicture)}
                alt={supervisor.name}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultImage;
                }}
              />
              <div>
                <h4 className="font-bold text-[#144145]">{supervisor.name}</h4>
                <p className="text-sm text-gray-600">{supervisor.email}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
