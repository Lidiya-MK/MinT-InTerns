import {
    Home,
    Users,
    UserCheck,
    UserCog,
    UserPlus,
    Settings,
    BarChart3,
  } from "lucide-react";
  import logo from "../assets/logo.png" ;
  
  const navItems = [
    { icon: <Home className="h-5 w-5" />, label: "Dashboard", key: "dashboard" },
    { icon: <Users className="h-5 w-5" />, label: "Interns", key: "intern"},
    { icon: <UserCheck className="h-5 w-5" />, label: "Supervisors" },
    { icon: <UserCog className="h-5 w-5" />, label: "Administrators" },
    { icon: <UserPlus className="h-5 w-5" />, label: "Register Supervisor", key:"register-supervisor" },
    { icon: <UserPlus className="h-5 w-5" />, label: "Register Administrator", key: "register-admin" },
    { icon: <BarChart3 className="h-5 w-5" />, label: "Reports" },
    { icon: <Settings className="h-5 w-5" />, label: "Settings" , key:"settings"},
  ];
  
  export default function Sidebar({ setView }) {
    return (
      <aside className="w-64 bg-white shadow-md p-5">
         <img src={logo} alt="MinT Logo" className="h-[65px] mb-3" />
        <nav className="space-y-4">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center space-x-3 text-gray-700 hover:text-[#D25B24] cursor-pointer"
              onClick={() => setView(item.key || "")}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
      </aside>
    );
  }
  