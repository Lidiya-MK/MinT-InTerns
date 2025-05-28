import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import logo from "../../assets/logo.png";

const mockInterns = [
  { id: 1, name: "Amanuel T", email: "aman@mint.com", attendance: false },
  { id: 2, name: "Sara M", email: "sara@mint.com", attendance: true },
];

const mockProjects = [
  { id: 1, title: "Web Redesign", interns: [1], progress: 50 },
  { id: 2, title: "Mobile App", interns: [2], progress: 30 },
];

export default function SupervisorDashboard() {
  const [interns, setInterns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedInternId, setSelectedInternId] = useState("");

  useEffect(() => {
    setInterns(mockInterns);
    setProjects(mockProjects);
  }, []);

  const toggleAttendance = (id) => {
    setInterns((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, attendance: !i.attendance } : i
      )
    );
    toast.success("Attendance updated (mock)");
  };

  const handleAssignIntern = () => {
    if (!selectedInternId || !selectedProject) return toast.error("Select intern and project");
    setProjects((prev) =>
      prev.map((project) =>
        project.id === selectedProject
          ? {
              ...project,
              interns: [...new Set([...project.interns, Number(selectedInternId)])],
            }
          : project
      )
    );
    toast.success("Intern assigned to project (mock)");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <header className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold">Supervisor Dashboard</h1>
        <img src={logo} alt="Logo" className="h-12" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Interns */}
        <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#144145]">
          <h2 className="text-xl font-bold mb-4">👥 Interns</h2>
          {interns.map((intern) => (
            <div key={intern.id} className="mb-4 p-3 bg-[#2a2a2a] rounded-lg">
              <p><strong>{intern.name}</strong></p>
              <p className="text-sm text-gray-400">{intern.email}</p>
              <button
                onClick={() => toggleAttendance(intern.id)}
                className={`mt-2 text-sm px-3 py-1 rounded ${
                  intern.attendance ? "bg-green-600" : "bg-red-600"
                }`}
              >
                {intern.attendance ? "Present" : "Absent"}
              </button>
            </div>
          ))}
        </div>

        {/* Assign Intern to Project */}
        <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#144145]">
          <h2 className="text-xl font-bold mb-4">➕ Assign Intern to Project</h2>
          <select
            onChange={(e) => setSelectedInternId(e.target.value)}
            className="w-full mb-3 p-2 bg-[#2a2a2a] text-white rounded"
          >
            <option value="">Select Intern</option>
            {interns.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
          <select
            onChange={(e) => setSelectedProject(Number(e.target.value))}
            className="w-full mb-3 p-2 bg-[#2a2a2a] text-white rounded"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <button
            onClick={handleAssignIntern}
            className="bg-[#EA9753] text-white px-4 py-2 rounded"
          >
            Assign
          </button>
        </div>

        {/* Project Progress */}
        <div className="bg-[#1a1a1a] p-5 rounded-xl border border-[#144145]">
          <h2 className="text-xl font-bold mb-4">📈 Project Progress</h2>
          {projects.map((project) => (
            <div key={project.id} className="mb-5">
              <div className="flex justify-between text-sm mb-1">
                <span>{project.title}</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full">
                <div
                  className="h-full bg-[#EA9753] rounded-full transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Interns: {project.interns.map((id) => interns.find(i => i.id === id)?.name).join(", ")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
