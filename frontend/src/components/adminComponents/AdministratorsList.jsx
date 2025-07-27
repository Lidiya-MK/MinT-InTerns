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
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 p-6 bg-gray-50">
        <h2 className="text-2xl font-semibold mb-4 text-[#144145]">Administrators</h2>
        <div className="space-y-4">
          {admins.map((admin) => (
            <div
              key={admin._id}
              className="bg-white shadow p-4 rounded-lg flex items-center space-x-4"
            >
              {admin.profilePicture ? (
                <img
                  src={getImageUrl(admin.profilePicture)}
                  alt={admin.name}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-avatar.png";
                  }}
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-[#144145] text-white flex items-center justify-center font-bold">
                  {admin.name[0]}
                </div>
              )}
              <div>
                <h4 className="font-bold text-[#144145]">{admin.name}</h4>
                <p className="text-sm text-gray-600">{admin.email}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
