import { FiKey } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiSearch, FiLogOut } from "react-icons/fi";
import { toast } from "react-hot-toast";
import defaultAvatar from "../../assets/default-avatar.png";
import logo from "../../assets/logo.png";

export default function SupervisorDashboard() {
  const { supervisorId, cohortId } = useParams();
  const navigate = useNavigate();

  const [supervisor, setSupervisor] = useState(null);
  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState({});
  const [absentCounts, setAbsentCounts] = useState({});
  const [passwordFields, setPasswordFields] = useState({});
  const [confirmingInternId, setConfirmingInternId] = useState(null); // custom confirmation modal

  const getImageUrl = (path) => {
    if (!path) return defaultAvatar;
    const fixedPath = path.includes("uploads/") ? path : `/uploads/${path}`;
    return `http://localhost:5000${fixedPath.replace(/\\/g, "/")}`;
  };

  const getImageUrl2 = (path) => {
    if (!path) return defaultAvatar;
    return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
  };

  useEffect(() => {
    const fetchSupervisor = async () => {
      try {
        const token = localStorage.getItem("supervisorToken");
        const res = await fetch(`http://localhost:5000/api/supervisor/${supervisorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);
        setSupervisor(data);
      } catch (err) {
        toast.error("Failed to load supervisor info.",err);
      }
    };

    if (supervisorId) fetchSupervisor();
  }, []);

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

        const initialAttendance = {};
        const absentCountMap = {};
        const initialPasswordFields = {};

        data.forEach((intern) => {
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const todayRecord = intern.attendanceRecords?.find((record) => {
            const recordDate = new Date(record.date);
            recordDate.setHours(0, 0, 0, 0);
            return recordDate.getTime() === today.getTime();
          });

          initialAttendance[intern._id] = todayRecord
            ? todayRecord.attendanceStatus === "present"
            : true;

          absentCountMap[intern._id] = intern.attendanceRecords?.filter(
            (record) => record.attendanceStatus === "absent"
          ).length;

          initialPasswordFields[intern._id] = {
            show: false,
            newPassword: "",
            confirmPassword: "",
          };
        });

        setAttendance(initialAttendance);
        setAbsentCounts(absentCountMap);
        setPasswordFields(initialPasswordFields);
      } catch (err) {
        toast.error("Error fetching interns.",err);
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

      setAttendance((prev) => {
        const newStatus = !prev[internId];
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

  const togglePasswordField = (internId) => {
    setPasswordFields((prev) => ({
      ...prev,
      [internId]: {
        ...prev[internId],
        show: !prev[internId].show,
        newPassword: "",
        confirmPassword: "",
      },
    }));
  };

  const handlePasswordChange = (internId, key, value) => {
    setPasswordFields((prev) => ({
      ...prev,
      [internId]: {
        ...prev[internId],
        [key]: value,
      },
    }));
  };

  const updatePassword = (internId) => {
    const { newPassword, confirmPassword } = passwordFields[internId];
    if (newPassword.length < 6) return toast.error("Password must be 6 characters or more.");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match.");
    setConfirmingInternId(internId);
  };

  const confirmPasswordUpdate = async (internId) => {
    const token = localStorage.getItem("supervisorToken");
    try {
      const res = await fetch(
        `http://localhost:5000/api/supervisor/intern/${internId}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ newPassword: passwordFields[internId].newPassword }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password update failed");

      toast.success("Password updated successfully.");
      togglePasswordField(internId);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirmingInternId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("supervisorToken");
    toast.success("Logged out successfully");
    navigate("/supervisor-login");
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-white text-black py-4 px-6 flex items-center justify-between rounded-b-3xl shadow-md">
        <div className="flex items-center gap-4">
          <img
            src={getImageUrl(supervisor?.profilePicture)}
            alt="Supervisor"
            className="h-12 w-12 rounded-full object-cover border border-gray-400 cursor-pointer"
            onClick={() => navigate(`/updateProfile/${supervisorId}/${cohortId}`)}
          />
          <div>
            <p className="text-lg font-semibold">{supervisor?.name || "Supervisor"}</p>
            <p className="text-sm text-gray-600">{supervisor?.email || ""}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <button
            className="px-3 py-1.5 bg-[#144145] text-white rounded-xl text-sm font-semibold"
            onClick={() =>
              navigate(`/supervisorDashboard/${supervisorId}/${cohortId}`)
            }
          >
            Interns
          </button>
          <button
            className="px-3 py-1.5 border border-[#144145] text-[#144145] rounded-xl text-sm font-semibold hover:bg-[#144145] hover:text-white"
            onClick={() =>
              navigate(`/supervisorProjects/${supervisorId}/${cohortId}`)
            }
          >
            Projects
          </button>
          <Link
            to={`/supervisor/${supervisorId}/${cohortId}/profile-update`}
            className="px-3 py-1.5 border border-[#144145] text-[#144145] rounded-xl text-sm font-semibold hover:bg-[#144145] hover:text-white"
          >
            Update Profile
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-[#144145] hover:text-red-500 transition-colors duration-200"
              title="Logout"
            >
              <FiLogOut size={20} />
            </button>
            <img src={logo} alt="System Logo" className="h-10 w-auto" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="p-6">
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
              <div
                key={intern._id}
                className="bg-[#2a2a2a] p-4 rounded-xl shadow space-y-2 relative"
              >
                {/* 🔑 Key Icon */}
                <button
                  onClick={() => togglePasswordField(intern._id)}
                  className="absolute top-2 right-2 text-yellow-500 hover:text-yellow-300"
                  title="Change Password"
                >
                  <FiKey size={18} />
                </button>

                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl2(intern.profilePicture)}
                    alt={intern.name}
                    className="w-14 h-14 rounded-full object-cover border border-gray-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = defaultAvatar;
                    }}
                  />
                  <div>
                    <p className="font-semibold">{intern.name}</p>
                    <p className="text-sm text-gray-400">{intern.email}</p>
                    <p className="text-sm text-gray-400">Absent Days: {absentCounts[intern._id]}</p>
                    <p className="text-sm text-gray-400">CGPA: {intern.CGPA}</p>
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

                {passwordFields[intern._id]?.show && (
                  <div className="mt-2">
                    <input
                      type="password"
                      placeholder="New Password"
                      className="w-full mb-1 p-2 text-sm rounded bg-[#1f1f1f] border border-yellow-500 text-white"
                      value={passwordFields[intern._id]?.newPassword}
                      onChange={(e) =>
                        handlePasswordChange(intern._id, "newPassword", e.target.value)
                      }
                    />
                    <input
                      type="password"
                      placeholder="Confirm New Password"
                      className="w-full mb-1 p-2 text-sm rounded bg-[#1f1f1f] border border-yellow-500 text-white"
                      value={passwordFields[intern._id]?.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange(intern._id, "confirmPassword", e.target.value)
                      }
                    />
                    <button
                      onClick={() => updatePassword(intern._id)}
                      className="mt-1 w-full py-1.5 rounded bg-yellow-500 text-black font-semibold text-sm hover:bg-yellow-600"
                    >
                      Update Password
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Confirmation */}
      {confirmingInternId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl p-6 space-y-4 max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold">Confirm Password Update</h2>
            <p>Are you sure you want to change this intern's password?</p>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => confirmPasswordUpdate(confirmingInternId)}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded font-semibold"
              >
                Confirm
              </button>
              <button
                onClick={() => setConfirmingInternId(null)}
                className="px-4 py-2 border border-gray-400 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
