import { Link } from "react-router-dom";
import {
  Home,
  UserCheck,
  UserCog,
  UserPlus,
  Settings,
  BarChart3,
} from "lucide-react";
import logo from "../../assets/logo.png";

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
  return (
    <aside className="w-64 bg-white text-gray-800 shadow-md min-h-screen p-5 flex flex-col">
      {/* Logo */}
      <div className="mb-8">
        <img src={logo} alt="MinT Logo" className="h-[65px] mx-auto" />
      </div>

      {/* Navigation Links */}
      <nav className="space-y-4">
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
    </aside>
  );
}
