import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiSearch } from "react-icons/fi";
import defaultAvatar from "../../assets/default-avatar.png";
import logo from "../../assets/logo.png";
import placeholderImage from "../../assets/placeholder.png";

export default function SupervisorDashboard() {
  // get both supervisorId and cohortId from URL params
  const { supervisorId, cohortId } = useParams();
  const [interns, setInterns] = useState([]);
  const [filteredInterns, setFilteredInterns] = useState([]);
  const [supervisorName] = useState("Supervisor");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [attendance, setAttendance] = useState({});
  const [newProject, setNewProject] = useState({
    name: "",
    leader: "",
    description: "",
    members: [],
  });
  const [projects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [teamLeadSearch, setTeamLeadSearch] = useState("");

  useEffect(() => {
    const fetchInterns = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("supervisorToken");
        const response = await fetch(
          `http://localhost:5000/api/supervisor/cohort/${cohortId}/interns`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        if (!response.ok) throw new Error(data?.message || "Failed to fetch interns");
        if (Array.isArray(data)) {
          setInterns(data);
          setFilteredInterns(data);
          const initialAttendance = {};
          data.forEach((intern) => {
            initialAttendance[intern._id] = true;
          });
          setAttendance(initialAttendance);
        } else {
          setInterns([]);
        }
      } catch (error) {
        toast.error("Error fetching interns.",error);
        setInterns([]);
      } finally {
        setLoading(false);
      }
    };
    if (cohortId) {
      fetchInterns();
    }
  }, [cohortId]);

  useEffect(() => {
    const filtered = interns.filter(
      (intern) =>
        intern.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredInterns(filtered);
  }, [searchQuery, interns]);

  const toggleAttendance = (internId) => {
    setAttendance((prev) => ({
      ...prev,
      [internId]: !prev[internId],
    }));
  };

  const filteredTeamLeadOptions = filteredInterns.filter((intern) =>
    intern.name?.toLowerCase().includes(teamLeadSearch.toLowerCase())
  );

  const toggleTeamMember = (internId) => {
    setNewProject((prev) => {
      const members = prev.members.includes(internId)
        ? prev.members.filter((id) => id !== internId)
        : [...prev.members, internId];
      return { ...prev, members: members };
    });
  };

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.leader || !newProject.description || newProject.members.length === 0) {
      toast.error("Please fill in all fields and select at least one team member.");
      return;
    }
    try {
      const token = localStorage.getItem("supervisorToken");
      const response = await fetch("http://localhost:5000/api/supervisor/new-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          supervisorId, // ADD supervisorId from URL
          cohortId,
          name: newProject.name,
          description: newProject.description,
          leader: newProject.leader,
          members: newProject.members,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Failed to create project");
      toast.success("Project created successfully!");
      setNewProject({ name: "", leader: "", description: "", members: [] });
      setShowProjectForm(false);
    } catch (error) {
      toast.error("Failed to create project.",error);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="w-full bg-white text-black py-4 px-6 flex items-center justify-between rounded-b-3xl shadow-md">
        <div className="flex items-center gap-4">
          <img src={logo} alt="MiNT InTerns" className="h-10 w-auto" />
          <h1 className="text-3xl font-semibold text-black -ml-12">Welcome, {supervisorName}</h1>
        </div>
        <button
          onClick={() => setShowProjectForm(true)}
          className="px-4 py-2 border border-[#FFA645] text-[#FFA645] hover:bg-[#FFA645] hover:text-black font-semibold rounded-2xl shadow transition"
        >
          + New Project
        </button>
      </header>

      {/* Main content */}
      <div className="p-6 flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Panel */}
        <div className="lg:w-1/2">
          <div className="relative mb-4">
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
            <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
              {filteredInterns.map((intern) => (
                <div
                  key={intern._id}
                  className="bg-[#2a2a2a] rounded-xl shadow p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
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
                      <p className="font-semibold text-white">{intern.name || "Unnamed Intern"}</p>
                      <p className="text-sm text-gray-400">Email: {intern.email || "No email"}</p>
                      <p className="text-sm text-gray-400">CGPA: {intern.CGPA ?? "N/A"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center space-y-1">
                    <span
                      className={`text-xs font-semibold ${
                        attendance[intern._id] ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {attendance[intern._id] ? "Present" : "Absent"}
                    </span>
                    <button
                      onClick={() => toggleAttendance(intern._id)}
                      className={`w-10 h-5 rounded-full transition duration-200 ${
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

        {/* Right Panel */}
        <div className="lg:w-1/2 flex flex-col justify-start bg-[#2a2a2a] p-6 rounded-lg shadow-lg border border-[#FFA645] mt-4 lg:mt-2">
          {!showProjectForm ? (
            <div className="mt-6 flex flex-col items-center justify-center">
              {projects.length === 0 ? (
                <div className="text-center">
                  <img src={placeholderImage} alt="No Projects" className="mx-auto w-40 opacity-60" />
                  <p className="text-gray-400 mt-2">No projects to show</p>
                </div>
              ) : (
                <ul className="space-y-2">
                  {projects.map((project, index) => (
                    <li key={index} className="bg-[#1f1f1f] p-3 rounded border border-gray-600">
                      <h3 className="text-lg font-semibold text-[#FFA645]">{project.name}</h3>
                      <p className="text-sm text-gray-400">{project.description}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-[#FFA645]">Create a New Project</h2>
                <button
                  onClick={() => setShowProjectForm(false)}
                  className="text-gray-400 hover:text-red-400 transition text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={newProject.name}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full p-2 rounded-2xl bg-[#1f1f1f] text-white border border-[#74C2E1]"
                />

                <textarea
                  placeholder="Project Description"
                  value={newProject.description}
                  onChange={(e) => setNewProject((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 rounded-2xl bg-[#1f1f1f] text-white border border-[#74C2E1]"
                />

                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for Team Lead..."
                    value={teamLeadSearch}
                    onChange={(e) => setTeamLeadSearch(e.target.value)}
                    className="w-full p-2 pl-10 rounded bg-[#1f1f1f] text-white border border-gray-600"
                  />
                </div>

                <div className="max-h-40 overflow-y-auto border border-gray-600 rounded">
                  {filteredTeamLeadOptions.map((intern) => (
                    <div
                      key={intern._id}
                      onClick={() => setNewProject((prev) => ({ ...prev, leader: intern._id }))}
                      className={`p-2 cursor-pointer ${
                        newProject.leader === intern._id ? "bg-[#FFA645] text-black" : "hover:bg-gray-700"
                      }`}
                    >
                      {intern.name}
                    </div>
                  ))}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-400 mb-1">Select Team Members:</p>
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
                </div>

                <button
                  onClick={handleCreateProject}
                  className="w-full py-2 bg-[#FFA645] text-black font-semibold rounded-2xl mt-2 hover:bg-[#ffb74d] transition"
                >
                  Create Project
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
