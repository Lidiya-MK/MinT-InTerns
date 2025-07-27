import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSearch,FiLogOut } from "react-icons/fi";
import { toast } from "react-hot-toast";
import defaultAvatar from "../../assets/default-avatar.png";
import logo from "../../assets/logo.png";
import avatar from "../../assets/default-avatar.png";

export default function SupervisorDashboard() {
  const { supervisorId, cohortId } = useParams();
  const navigate = useNavigate();

  const [supervisorName] = useState("Supervisor");
  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState({});
  const [absentCounts, setAbsentCounts] = useState({}); // { internId: numberOfAbsentDays }

  useEffect(() => {
    const fetchInterns = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("supervisorToken");
        const res = await fetch(
          `http://localhost:5000/api/supervisor/cohort/${cohortId}/interns`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);

        setInterns(data);
        setFilteredInterns(data);

        // Initialize today's attendance and absent count
        const initialAttendance = {};
        const absentCountMap = {};

        data.forEach((intern) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          // Find today's attendance record
          const todayRecord = intern.attendanceRecords?.find((record) => {
            const recordDate = new Date(record.date);
            recordDate.setHours(0, 0, 0, 0);
            return recordDate.getTime() === today.getTime();
          });

          initialAttendance[intern._id] = todayRecord
            ? todayRecord.attendanceStatus === "present"
            : true; // default present

          // Count total absent days
          const absentDays = intern.attendanceRecords?.filter(
            (record) => record.attendanceStatus === "absent"
          ).length;

          absentCountMap[intern._id] = absentDays || 0;
        });

        setAttendance(initialAttendance);
        setAbsentCounts(absentCountMap);
      } catch (err) {
        toast.error("Error fetching interns.", err);
      } finally {
        setLoading(false);
      }
    };
    if (cohortId) fetchInterns();
  }, [cohortId]);

  useEffect(() => {
    const filtered = interns.filter(
      (intern) =>
        intern.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInterns(filtered);
  }, [searchQuery, interns]);

  const toggleAttendance = async (internId) => {
    try {
      const token = localStorage.getItem("supervisorToken");
      const res = await fetch(
        `http://localhost:5000/api/supervisor/intern/${internId}/attendance`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update attendance");
      }

      // Toggle locally after successful backend update
      setAttendance((prev) => {
        const newStatus = !prev[internId];

        // Adjust absent count locally
        setAbsentCounts((counts) => ({
          ...counts,
          [internId]: newStatus ? counts[internId] - 1 : counts[internId] + 1,
        }));

        return { ...prev, [internId]: newStatus };
      });

      toast.success("Attendance updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("internToken");
    toast.success("Logged out successfully");
    navigate("/supervisor-login");
  };
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-white text-black py-4 px-6 flex items-center justify-between rounded-b-3xl shadow-md">
        <div className="flex items-center gap-3">
          <img src={avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
          <h1 className="text-xl sm:text-2xl font-semibold text-black">Welcome, {supervisorName}</h1>
        </div>

        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-[#144145] text-white rounded-2xl font-semibold"
            onClick={() => navigate(`/supervisorDashboard/${supervisorId}/${cohortId}`)}
          >
            Interns
          </button>
          <button
            className="px-4 py-2 border border-[#144145] text-[#144145] rounded-2xl font-semibold hover:bg-[#144145] hover:text-white"
            onClick={() => navigate(`/supervisorProjects/${supervisorId}/${cohortId}`)}
          >
            Projects
          </button>
        <div className="flex items-center gap-4">
            
            <button
              onClick={handleLogout}
              className="text-[#144145] hover:text-red-500 transition-colors duration-200"
              title="Logout"
          
            >
              <FiLogOut size={24} />
            </button>
            <img src={logo} alt="System Logo" className="h-10 w-auto" />
        
           
          </div>
        </div>
      </header>

      <main className="p-6">
        <div>
          <div className="relative mb-4 max-w-lg">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search interns by name or email..."
              className="w-full p-2 pl-10 rounded bg-[#1f1f1f] text-white border border-gray-600"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <p className="text-gray-400">Loading interns...</p>
          ) : filteredInterns.length === 0 ? (
            <p className="text-gray-400">No interns match your search.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {filteredInterns.map((intern) => (
                <div key={intern._id} className="bg-[#2a2a2a] p-4 rounded-xl shadow space-y-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        intern.profilePicture
                          ? `http://localhost:5000/${intern.profilePicture.replace(/\\/g, "/")}`
                          : defaultAvatar
                      }
                      alt={intern.name || "Intern"}
                      className="w-14 h-14 rounded-full object-cover border border-gray-500"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultAvatar;
                      }}
                    />
                    <div>
                      <p className="font-semibold">{intern.name || "Unnamed Intern"}</p>
                      <p className="text-sm text-gray-400">{intern.email || "No email"}</p>
                      <p className="text-sm text-gray-400">Absent Days: {absentCounts[intern._id]}</p>
                      <p className="text-sm text-gray-400">CGPA: {intern.CGPA ?? "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        attendance[intern._id] ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {attendance[intern._id] ? "Present" : "Absent"}
                    </span>
                    <button
                      onClick={() => toggleAttendance(intern._id)}
                      className={`w-10 h-5 rounded-full ${
                        attendance[intern._id] ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transform transition-transform ${
                          attendance[intern._id] ? "translate-x-5" : "translate-x-0"
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
