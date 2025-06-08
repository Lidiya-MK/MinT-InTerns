import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import defaultAvatar from "../../assets/default-avatar.png";
import logo from "../../assets/logo.png";
import placeholderImage from "../../assets/placeholder.png";

export default function SupervisorDashboard() {
  const { supervisorId, cohortId } = useParams();
  const [activeTab, setActiveTab] = useState("interns");
  const [supervisorName] = useState("Supervisor");

  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState({});

  const [projects, setProjects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", leader: "", description: "", members: [] });
  const [teamLeadSearch, setTeamLeadSearch] = useState("");

  useEffect(() => {
    const fetchInterns = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("supervisorToken");
        const res = await fetch(`http://localhost:5000/api/supervisor/cohort/${cohortId}/interns`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);
        setInterns(data);
        setFilteredInterns(data);
        const initialAttendance = {};
        data.forEach((intern) => (initialAttendance[intern._id] = true));
        setAttendance(initialAttendance);
      } catch (err) {
        toast.error("Error fetching interns.",err);
      } finally {
        setLoading(false);
      }
    };
    if (cohortId) fetchInterns();
  }, [cohortId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("supervisorToken");
        const res = await fetch(`http://localhost:5000/api/supervisor/projects/${supervisorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);
        setProjects(data);
      } catch (err) {
        toast.error("Failed to load projects.",err);
      }
    };
    if (supervisorId) fetchProjects();
  }, [supervisorId]);

  useEffect(() => {
    const filtered = interns.filter((intern) =>
      intern.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intern.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInterns(filtered);
  }, [searchQuery, interns]);

  const toggleAttendance = (internId) => {
    setAttendance((prev) => ({ ...prev, [internId]: !prev[internId] }));
  };

  const filteredTeamLeadOptions = filteredInterns.filter((intern) =>
    intern.name?.toLowerCase().includes(teamLeadSearch.toLowerCase())
  );

  const toggleTeamMember = (internId) => {
    setNewProject((prev) => {
      const members = prev.members.includes(internId)
        ? prev.members.filter((id) => id !== internId)
        : [...prev.members, internId];
      return { ...prev, members };
    });
  };

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.leader || !newProject.description || newProject.members.length === 0) {
      toast.error("Please fill in all fields and select at least one team member.");
      return;
    }
    try {
      const token = localStorage.getItem("supervisorToken");
      const res = await fetch("http://localhost:5000/api/supervisor/new-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supervisorId,
          cohortId,
          ...newProject,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);
      toast.success("Project created successfully!");
      setProjects((prev) => [...prev, data]);
      setShowProjectForm(false);
      setNewProject({ name: "", leader: "", description: "", members: [] });
    } catch (err) {
      toast.error("Failed to create project.",err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-white text-black py-4 px-6 flex items-center justify-between rounded-b-3xl shadow-md">
        <div className="flex items-center gap-4">
          <img src={logo} alt="MiNT InTerns" className="h-10" />
          <h1 className="text-3xl font-semibold text-black -ml-12">Welcome, {supervisorName}</h1>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("interns")}
            className={`px-4 py-2 rounded-2xl font-semibold transition ${
              activeTab === "interns"
                ? "bg-[#FFA645] text-black"
                : "border border-[#FFA645] text-[#FFA645] hover:bg-[#FFA645] hover:text-black"
            }`}
          >
            Interns
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-2xl font-semibold transition ${
              activeTab === "projects"
                ? "bg-[#FFA645] text-black"
                : "border border-[#FFA645] text-[#FFA645] hover:bg-[#FFA645] hover:text-black"
            }`}
          >
            Projects
          </button>
        </div>
      </header>

      {/* Tab Content */}
      <main className="p-6">
        {activeTab === "interns" && (
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
        )}

        {activeTab === "projects" && (
          <div className="mt-4">
            {!showProjectForm ? (
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-[#FFA645]">Projects</h2>
                <button
                  onClick={() => setShowProjectForm(true)}
                  className="px-4 py-2 bg-[#FFA645] text-black font-semibold rounded-2xl hover:bg-[#ffb74d]"
                >
                  + New Project
                </button>
              </div>
            ) : (
              <div className="bg-[#2a2a2a] p-6 rounded-lg space-y-4">
                <div className="flex justify-between">
                  <h2 className="text-xl font-semibold text-[#FFA645]">Create New Project</h2>
                  <button onClick={() => setShowProjectForm(false)} className="text-xl text-red-400">✕</button>
                </div>

                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full p-2 rounded bg-[#1f1f1f] border border-[#74C2E1]"
                />

                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full p-2 rounded bg-[#1f1f1f] border border-[#74C2E1]"
                />

                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search Team Lead..."
                    value={teamLeadSearch}
                    onChange={(e) => setTeamLeadSearch(e.target.value)}
                    className="w-full p-2 pl-10 rounded bg-[#1f1f1f] border border-gray-600"
                  />
                </div>

                <div className="max-h-40 overflow-y-auto border border-gray-600 rounded">
                  {filteredTeamLeadOptions.map((intern) => (
                    <div
                      key={intern._id}
                      onClick={() => setNewProject({ ...newProject, leader: intern._id })}
                      className={`p-2 cursor-pointer ${
                        newProject.leader === intern._id ? "bg-[#FFA645] text-black" : "hover:bg-gray-700"
                      }`}
                    >
                      {intern.name}
                    </div>
                  ))}
                </div>

                <p className="text-sm font-semibold text-gray-400">Select Team Members:</p>
                <div className="max-h-40 overflow-y-auto border border-gray-600 rounded">
                  {filteredInterns.map((intern) => (
                    <div
                      key={intern._id}
                      onClick={() => toggleTeamMember(intern._id)}
                      className={`p-2 cursor-pointer ${
                        newProject.members.includes(intern._id)
                          ? "bg-[#FFA645] text-black"
                          : "hover:bg-gray-700"
                      }`}
                    >
                      {intern.name}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCreateProject}
                  className="w-full py-2 bg-[#FFA645] text-black font-semibold rounded-2xl"
                >
                  Create Project
                </button>
              </div>
            )}

            {!showProjectForm && (
              <div className="mt-6">
                {projects.length === 0 ? (
                  <div className="text-center">
                    <img src={placeholderImage} alt="No Projects" className="mx-auto w-40 opacity-60" />
                    <p className="text-gray-400 mt-2">No projects to show</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
                    {projects.map((project) => {
                      const total = project.milestones.length;
                      const completed = project.milestones.filter((m) => m.status === "complete").length;
                      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

                      return (
                        <div key={project._id} className="bg-[#2a2a2a] p-4 rounded-lg shadow border border-gray-700">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-lg font-bold text-[#FFA645]">{project.name}</h3>
                              <p className="text-sm text-gray-300">{project.description}</p>
                              <p className="text-sm text-gray-400 mt-1">Leader: {project.leader?.name}</p>
                              <p className="text-sm text-gray-400">Members: {project.members.map((m) => m.name).join(", ")}</p>
                            </div>
                            <div className="text-xl text-[#FFA645] space-x-2">
                              <button title="Edit"><FiEdit2 /></button>
                              <button title="Delete"><FiTrash2 /></button>
                            </div>
                          </div>
                          {total > 0 && (
                            <div className="mt-3">
                              <p className="text-xs text-gray-400 mb-1">Progress: {percentage}%</p>
                              <div className="w-full bg-gray-700 rounded-full h-3">
                                <div
                                  className="bg-[#FFA645] h-3 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
