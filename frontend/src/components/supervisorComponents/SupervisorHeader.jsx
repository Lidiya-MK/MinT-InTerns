// src/components/common/SupervisorHeader.jsx

import { FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../../assets/default-avatar.png";
import logo from "../../assets/logo.png";

export default function SupervisorHeader({
  supervisor,
  supervisorId,
  cohortId,
  onLogout,
}) {
  const navigate = useNavigate();

  const getImageUrl = (path) => {
    if (!path) return defaultAvatar;
    return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
  };

  return (
    <header className="bg-white text-black py-4 px-6 flex items-center justify-between rounded-b-3xl shadow-md">
      {/* Left: Supervisor info */}
      <div className="flex items-center gap-4">
        <img
          src={getImageUrl(supervisor?.profilePicture)}
          alt="Supervisor"
          className="h-12 w-12 rounded-full object-cover border border-gray-400"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultAvatar;
          }}
        />
        <div>
          <p className="text-lg font-semibold">
            {supervisor?.name || "Supervisor"}
          </p>
          <p className="text-sm text-gray-600">{supervisor?.email || ""}</p>
        </div>
      </div>

      {/* Right: Buttons and logo */}
      <div className="flex gap-4">
        <button
          className="px-4 py-2 bg-[#144145] text-white rounded-2xl font-semibold"
          onClick={() =>
            navigate(`/supervisorDashboard/${supervisorId}/${cohortId}`)
          }
        >
          Interns
        </button>
        <button
          className="px-4 py-2 border border-[#144145] text-[#144145] rounded-2xl font-semibold hover:bg-[#144145] hover:text-white"
          onClick={() =>
            navigate(`/supervisorProjects/${supervisorId}/${cohortId}`)
          }
        >
          Projects
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={onLogout}
            className="text-[#144145] hover:text-red-500 transition-colors duration-200"
            title="Logout"
          >
            <FiLogOut size={24} />
          </button>
          <img src={logo} alt="System Logo" className="h-10 w-auto" />
        </div>
      </div>
    </header>
  );
}
