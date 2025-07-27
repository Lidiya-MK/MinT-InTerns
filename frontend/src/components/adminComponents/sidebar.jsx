import { Link, useNavigate } from "react-router-dom";
import {
  Home,
  UserCheck,
  UserCog,
  UserPlus,
  Settings,
  LogOut,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { toast } from "react-hot-toast";

const navItems = [
  { icon: <Home className="h-5 w-5" />, label: "Dashboard", path: "/admin/cohorts" },
  { icon: <UserCheck className="h-5 w-5" />, label: "Supervisors", path: "/admin/supervisors" },
  { icon: <UserCog className="h-5 w-5" />, label: "Administrators", path: "/admin/administrators" },
  { icon: <UserPlus className="h-5 w-5" />, label: "Register Supervisor", path: "/admin/register-supervisor" },
  { icon: <UserPlus className="h-5 w-5" />, label: "Register Administrator", path: "/admin/register-admin" },
  // { icon: <BarChart3 className="h-5 w-5" />, label: "Reports", path: "/admin/reports" },
  { icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/admin/settings" },
];

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };

  return (
    <aside className="w-64 bg-white text-gray-800 shadow-md min-h-screen p-5 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <img src={logo} alt="MinT Logo" className="h-[65px] mx-auto" />
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4 flex-1">
        {navItems.map((item) => (
          <Link
            to={item.path}
            key={item.label}
            className="flex items-center space-x-3 hover:text-[#D25B24] transition-colors"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center space-x-3 text-left hover:text-[#D25B24] transition-colors mt-6"
      >
        <LogOut className="h-5 w-5" />
        <span className="text-sm font-medium">Logout</span>
      </button>
    </aside>
  );
}
