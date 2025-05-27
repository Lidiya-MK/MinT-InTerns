import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

import Sidebar from "../components/adminComponents/Sidebar";
import DashboardCards from "../components/adminComponents/DashboardCards";
import PendingInternList from "../components/adminComponents/PendingInternList";
import Registration from "../components/adminComponents/Registration";
import Settings from "../components/adminComponents/Settings";

function Cohorts() {
  const [cohorts, setCohorts] = useState([]);
  const [selectedCohort, setSelectedCohort] = useState(null);
  const [interns, setInterns] = useState([]);
  const [filter, setFilter] = useState("all");

  const [acceptedCount, setAcceptedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [freeSlots, setFreeSlots] = useState(0);

  const [view, setView] = useState("cohorts"); // 'cohorts', 'register-admin', 'register-supervisor', 'settings'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCohorts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/admin/cohort/ongoing", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCohorts(res.data || []);
      } catch (err) {
        toast.error("Failed to fetch cohorts");
        console.error(err);
      }
    };
    fetchCohorts();
  }, []);

  useEffect(() => {
    const fetchCohortDetails = async () => {
      if (!selectedCohort) return;

      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const [internsRes, acceptedRes, pendingRes, slotsRes] = await Promise.all([
          axios.get(
            `http://localhost:5000/api/admin/cohort/${selectedCohort._id}/interns/pending-rejected`,
            { headers }
          ),
          axios.get(
            `http://localhost:5000/api/admin/cohort/${selectedCohort._id}/accepted-count`,
            { headers }
          ),
          axios.get(
            `http://localhost:5000/api/admin/cohort/${selectedCohort._id}/pending-count`,
            { headers }
          ),
          axios.get(
            `http://localhost:5000/api/admin/cohorts/${selectedCohort._id}/available-slots`,
            { headers }
          ),
        ]);

        setInterns(internsRes.data || []);
        setAcceptedCount(Number(acceptedRes.data.acceptedCount) || 0);
        setPendingCount(Number(pendingRes.data.pendingCount) || 0);
        setFreeSlots(Number(slotsRes.data.freeSlots) || 0);
      } catch (err) {
        toast.error("Failed to fetch cohort details");
        console.error(err);
      }
    };

    fetchCohortDetails();
  }, [selectedCohort]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword)
      return toast.error("Please fill in all fields");
    if (password.length !== 6) return toast.error("Password must be 6 digits");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/admin/register",
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Administrator registered successfully");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setView("cohorts");
    } catch (error) {
      toast.error("Registration failed");
      console.error(error);
    }
  };

  const handleRegisterSupervisor = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword)
      return toast.error("Please fill in all fields");
    if (password.length !== 6) return toast.error("Password must be 6 digits");
    if (password !== confirmPassword) return toast.error("Passwords do not match");

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/admin/register/supervisor",
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Supervisor registered successfully");
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setView("cohorts");
    } catch (error) {
      toast.error("Registration failed");
      console.error(error);
    }
  };

  const renderCohortCard = (cohort) => (
    <div
      key={cohort._id}
      onClick={() => {
        setSelectedCohort(cohort);
        setView("cohorts");
      }}
      className="relative bg-[#1f2324] text-white p-4 rounded-lg shadow-md cursor-pointer hover:bg-[#2e3233] transition-colors"
    >
      <h3 className="text-lg font-semibold">{cohort.name}</h3>
      <p className="text-sm text-gray-300">
        Start: {new Date(cohort.cohortStart).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-300">
        End: {new Date(cohort.cohortEnd).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-300">Capacity: {cohort.maxInterns}</p>

      <button
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/admin/cohort/${cohort._id}/accepted`);
        }}
        className="mt-4 w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-semibold py-2 px-4 rounded shadow-md transition"
      >
        → View Accepted Interns
      </button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#272a2b] text-white">
      <Sidebar setView={setView} />
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold">Admin Dashboard</h2>
          <p className="text-gray-300">Welcome back, Mr. Denber</p>
        </header>

        {view === "register-admin" || view === "register-supervisor" ? (
          <Registration
            view={view}
            formData={formData}
            setFormData={setFormData}
            handleRegisterSubmit={handleRegisterSubmit}
            handleRegisterSupervisor={handleRegisterSupervisor}
          />
        ) : view === "settings" ? (
          <Settings />
        ) : !selectedCohort ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cohorts.length > 0 ? (
              cohorts.map(renderCohortCard)
            ) : (
              <p>No ongoing cohorts available.</p>
            )}
          </div>
        ) : (
          <>
            <button
              onClick={() => {
                setSelectedCohort(null);
                setInterns([]);
                setFreeSlots(0);
                setAcceptedCount(0);
                setPendingCount(0);
              }}
              className="mb-6 px-4 py-2 bg-[#3a3f40] rounded hover:bg-[#4a5052] text-sm"
            >
              ← Back to Cohorts
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-semibold">{selectedCohort.name}</h3>
              <p className="text-gray-300">
                {new Date(selectedCohort.cohortStart).toLocaleDateString()} –{" "}
                {new Date(selectedCohort.cohortEnd).toLocaleDateString()}
              </p>
              <p className="text-gray-300">Capacity: {selectedCohort.maxInterns}</p>
              <p className="text-gray-300">Free Slots: {freeSlots}</p>
            </div>

            <DashboardCards
              cohortId={selectedCohort._id}
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
          </>
        )}
      </main>
    </div>
  );
}

export default Cohorts;
