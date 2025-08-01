import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  UserCheck,
  UserCog,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.png";

const navItems = [
  { icon: <Home className="h-5 w-5" />, label: "Dashboard", path: "/admin/cohorts" },
  { icon: <UserCheck className="h-5 w-5" />, label: "Supervisors", path: "/admin/supervisors" },
  { icon: <UserCog className="h-5 w-5" />, label: "Administrators", path: "/admin/administrators" },
  { icon: <UserPlus className="h-5 w-5" />, label: "Register Supervisor", path: "/admin/register-supervisor" },
  { icon: <UserPlus className="h-5 w-5" />, label: "Register Administrator", path: "/admin/register-admin" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/admin/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setAdmin(data);
      } catch (err) {
        console.error("Failed to fetch admin profile", err);
      }
    };
    fetchAdmin();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };

  return (
    <aside className="w-64 bg-[#121921] text-gray-300 shadow-xl min-h-screen flex flex-col">
      {/* Logo section with solid background */}
 <div className="bg-white p-6 border-b border-[#2E3A4E] rounded-b-3xl flex justify-center">
  <img src={logo} alt="MinT Logo" className="h-16" />
</div>


      {/* Profile section */}
      {admin && (
        <div className="px-6 py-5 border-b border-[#2E3A4E] text-center">
          <img
            src={admin.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-16 h-16 rounded-full mx-auto border-2 border-[#EA9753] object-cover shadow-sm"
          />
          <h2 className="mt-3 text-lg font-semibold text-white truncate">{admin.name}</h2>
          <p className="text-xs text-gray-400 truncate">{admin.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`
                flex items-center space-x-3 px-3 py-3 rounded-lg cursor-pointer
                transition-colors duration-300
                ${isActive
                  ? " border border-[#EA9753] text-white font-semibold shadow-md"
                  : "hover:bg-[#2E3A4E] hover:text-white"}
              `}
            >
              <span
                className={`transition-colors duration-300 ${
                  isActive ? "text-white" : "text-gray-400"
                }`}
              >
                {item.icon}
              </span>
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-6 py-4 border-t border-[#2E3A4E]">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-gray-400 hover:text-[#EA9753] transition-colors duration-300 font-semibold"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
