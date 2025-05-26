import { useEffect, useState } from "react";
import logo from "../assets/logo.png";

export default function InternDashboard() {
  const [intern, setIntern] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const mockIntern = {
      name: "Abebe Kebede",
      email: "abebe@example.com",
      status: "accepted",
    };

    const mockTasks = [
      { id: 1, title: "Complete onboarding", status: "done" },
      { id: 2, title: "Submit weekly report", status: "in progress" },
      { id: 3, title: "Fix bugs in dashboard", status: "todo" },
    ];

    const mockProjects = [
      { id: 1, title: "Mentorship Platform", progress: 80 },
      { id: 2, title: "Internal Chat App", progress: 45 },
    ];

    setIntern(mockIntern);
    setTasks(mockTasks);
    setProjects(mockProjects);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "text-[#EA9753]";
      case "pending":
        return "text-yellow-400";
      case "rejected":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">👋 Welcome Back, {intern?.name || "Intern"}</h1>
          <p className="text-gray-300 mt-2">Your personalized project and task dashboard</p>
        </div>
        <img src={logo} alt="System Logo" className="h-16 " />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Profile Card */}
        <div className="col-span-1 bg-[#1a1a1a] p-6 rounded-xl border border-[#144145]">
          <h2 className="text-xl font-bold mb-4">👤 Your Info</h2>
          <p><span className="text-gray-400">Name:</span> {intern?.name}</p>
          <p><span className="text-gray-400">Email:</span> {intern?.email}</p>
          <p>
            <span className="text-gray-400">Status:</span>{" "}
            <span className={`font-semibold ${getStatusColor(intern?.status)}`}>
              {intern?.status?.charAt(0).toUpperCase() + intern?.status?.slice(1)}
            </span>
          </p>
        </div>

        {/* Task List */}
        <div className="col-span-2 bg-[#1a1a1a] p-6 rounded-xl border border-[#144145]">
          <h2 className="text-xl font-bold mb-4">📋 Your Tasks</h2>
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between bg-[#2a2a2a] px-4 py-3 rounded-lg">
                <span>{task.title}</span>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${
                    task.status === "done"
                      ? "bg-green-600 text-white"
                      : task.status === "in progress"
                      ? "bg-yellow-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                >
                  {task.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Project Section */}
      <section className="bg-[#1a1a1a] p-6 rounded-xl border border-[#144145]">
        <h2 className="text-xl font-bold mb-4">🚀 Your Projects</h2>
        <div className="space-y-5">
          {projects.map((project) => (
            <div key={project.id}>
              <div className="flex justify-between mb-1">
                <span>{project.title}</span>
                <span className="text-sm text-gray-400">{project.progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#EA9753] transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
