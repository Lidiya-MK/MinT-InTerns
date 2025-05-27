import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import Sidebar from "../components/adminComponents/Sidebar";

function AcceptedInternsPage() {
  const { cohortId } = useParams();
  const [interns, setInterns] = useState([]);

  useEffect(() => {
    const fetchAcceptedInterns = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `http://localhost:5000/api/admin/cohort/${cohortId}/interns/accepted`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        // ✅ Safely set interns only if the response is an array
        setInterns(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error("Failed to fetch accepted interns");
        console.error(err);
        setInterns([]); // fallback to empty array
      }
    };

    fetchAcceptedInterns();
  }, [cohortId]);

  const getImageUrl = (path) => {
    if (!path) return "/default-avatar.png";
    return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
  };

  return (
    <div className="flex min-h-screen bg-[#272a2b] text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Accepted Interns</h2>

        {interns.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-400 italic">
              No accepted interns in this cohort yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {interns.map((intern) => (
              <div
                key={intern._id}
                className="flex items-center bg-[#1f2324] p-4 rounded shadow-md"
              >
                <img
                  src={getImageUrl(intern.profilePicture)}
                  alt={intern.name}
                  className="w-16 h-16 rounded-full object-cover mr-4 border border-gray-500"
                />
                <div>
                  <h3 className="text-xl font-semibold">{intern.name}</h3>
                  <p className="text-sm text-gray-300">{intern.email}</p>
                  <p className="text-sm text-gray-300">CGPA: {intern.CGPA}</p>
                  <p className="text-sm text-green-400">Status: {intern.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AcceptedInternsPage;
