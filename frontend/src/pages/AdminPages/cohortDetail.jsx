import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

import Sidebar from "../../components/adminComponents/Sidebar";
import DashboardCards from "../../components/adminComponents/DashboardCards";
import PendingInternList from "../../components/adminComponents/PendingInternList";

function CohortDetailsPage() {
  const { cohortId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [cohort, setCohort] = useState(null);
  const [interns, setInterns] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Get data passed via navigation state (optional chaining ensures safety)
  const { acceptedCount = 0, pendingCount = 0, freeSlots = 0 } = location.state || {};

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      try {
        const cohortRes = await axios.get(
          `http://localhost:5000/api/admin/cohort/${cohortId}`,
          { headers }
        );
        setCohort(cohortRes.data);
      } catch (err) {
        toast.error("Error fetching cohort");
        console.error(err?.response?.data || err);
        return;
      }

      try {
        const internsRes = await axios.get(
          `http://localhost:5000/api/admin/cohort/${cohortId}/interns/pending-rejected`,
          { headers }
        );
        setInterns(internsRes.data || []);
      } catch (err) {
        toast.error("Error fetching interns");
        console.error(err?.response?.data || err);
      }

      setLoading(false);
    };

    fetchData();
  }, [cohortId]);

  if (loading) {
    return <div className="text-white p-8">Loading cohort details...</div>;
  }

  if (!cohort) {
    return <div className="text-white p-8">Cohort not found.</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#272a2b] text-white">
      <Sidebar />

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-2">{cohort.name}</h2>

        <div className="mb-6">
          <button
            onClick={() => navigate(`/admin/cohort/${cohortId}/accepted`)}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-2 px-4 rounded shadow-lg transition duration-300 z-20"
          >
            → View Accepted Interns
          </button>
        </div>

        <p className="text-gray-300 mb-1">
          {new Date(cohort.cohortStart).toLocaleDateString()} –{" "}
          {new Date(cohort.cohortEnd).toLocaleDateString()}
        </p>
        <p className="text-gray-300 mb-1">Capacity: {cohort.maxInterns}</p>
        <p className="text-gray-300 mb-6">Free Slots: {freeSlots}</p>

        <DashboardCards
          acceptedCount={acceptedCount}
          pendingCount={pendingCount}
          freeSlots={freeSlots}
        />

        <PendingInternList
          interns={interns}
          filter={filter}
          setFilter={setFilter}
          setInterns={setInterns}
        />
      </div>
    </div>
  );
}

export default CohortDetailsPage;
