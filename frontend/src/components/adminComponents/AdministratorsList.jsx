import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../adminComponents/Sidebar";

export default function AdministratorsList() {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/administrators",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAdmins(data);
      } catch (error) {
        console.error("Error fetching admins:", error);
      }
    };
    fetchAdmins();
  }, []);

  const getImageUrl = (path) =>
    path
      ? `http://localhost:5000/${path.replace(/^\/+/, "")}`
      : "/default-avatar.png";

  return (
    <div className="flex min-h-screen bg-[#0f1a1c] text-gray-300">
      <Sidebar />

      <main className="flex-1 p-8">
        <h2 className="text-3xl font-extrabold mb-8 text-white drop-shadow-lg">
          Administrators
        </h2>

        <div className="space-y-5 max-w-4xl mx-auto">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="bg-[#1c2a2d] border border-transparent hover:border-[#144145] transition-all duration-300 rounded-2xl p-5 flex items-center gap-5 "
            >
              {admin.profilePicture ? (
                <img
                  src={getImageUrl(admin.profilePicture)}
                  alt={admin.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-[#144145]"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#199c47] text-[#0f1a1c] flex items-center justify-center font-extrabold text-xl select-none">
                  {admin.name[0].toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="text-xl font-semibold text-white">{admin.name}</h4>
                <p className="text-sm text-gray-400">{admin.email}</p>
              </div>
            </div>
          ))}

          {admins.length === 0 && (
            <p className="text-center mt-20 text-gray-500 italic animate-pulse">
              No administrators found. Please check back later.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
