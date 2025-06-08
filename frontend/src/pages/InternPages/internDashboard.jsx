import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";
import { toast } from "react-hot-toast";
import { MessageCircle } from "lucide-react";
import { FiSend} from "react-icons/fi";


export default function InternDashboard() {
  const { id } = useParams();
  const [intern, setIntern] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({});
  const [milestoneInput, setMilestoneInput] = useState({});
  const [subtaskInput, setSubtaskInput] = useState({});

  useEffect(() => {
    const fetchIntern = async () => {
      try {
        const token = localStorage.getItem("internToken");
        if (!token || !id) return toast.error("Missing credentials. Please login again.");

        const { data } = await axios.get(`http://localhost:5000/api/interns/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIntern(data);
        setUpdatedInfo({
          name: data.name,
          email: data.email,
          CGPA: data.CGPA,
          university: data.university,
        });

        setProjects([
          {
            id: 1,
            title: "Mentorship Platform",
            milestones: [
              {
                id: 1,
                title: "UI Design",
                status: "completed",
                subtasks: [
                  { id: 1, title: "Design login screen", status: "completed", completedBy: "Abdi" },
                  { id: 2, title: "Design dashboard", status: "completed", completedBy: "Lidiya" }
                ]
              },
              {
                id: 2,
                title: "Backend API",
                status: "ongoing",
                subtasks: [
                  { id: 1, title: "Setup DB", status: "ongoing", completedBy: null }
                ]
              }
            ]
          }
        ]);
      } catch (error) {
        toast.error("Failed to load intern data.");
        console.error(error);
      }
    };

    fetchIntern();
  }, [id]);

  const getImageUrl = (path) => path ? `http://localhost:5000/${path.replace(/\\/g, "/")}` : "/default-avatar.png";

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("internToken");
      await axios.patch(`http://localhost:5000/api/interns/${id}`, updatedInfo, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Profile updated");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted": return "text-[#EA9753]";
      case "pending": return "text-yellow-400";
      case "rejected": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const calculateMilestoneProgress = (milestone) => {
    const completed = milestone.subtasks.filter((s) => s.status === "completed").length;
    return milestone.subtasks.length === 0 ? 0 : Math.round((completed / milestone.subtasks.length) * 100);
  };

  const calculateProjectProgress = (project) => {
    const totalMilestones = project.milestones.length;
    if (totalMilestones === 0) return 0;
    const progressSum = project.milestones.map(calculateMilestoneProgress).reduce((a, b) => a + b, 0);
    return Math.round(progressSum / totalMilestones);
  };

  const addMilestone = (projectId, title) => {
    if (!title) return;
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              milestones: [
                ...project.milestones,
                {
                  id: Date.now(),
                  title,
                  status: "ongoing",
                  subtasks: [],
                },
              ],
            }
          : project
      )
    );
    toast.success("Milestone added");
    setMilestoneInput((prev) => ({ ...prev, [projectId]: "" }));
  };

  const addSubtask = (projectId, milestoneId, title) => {
    if (!title) return;
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              milestones: project.milestones.map((milestone) =>
                milestone.id === milestoneId
                  ? {
                      ...milestone,
                      subtasks: [
                        ...milestone.subtasks,
                        {
                          id: Date.now(),
                          title,
                          status: "ongoing",
                          completedBy: null,
                        },
                      ],
                    }
                  : milestone
              ),
            }
          : project
      )
    );
    toast.success("Subtask added");
    setSubtaskInput((prev) => ({ ...prev, [`${projectId}-${milestoneId}`]: "" }));
  };

  const toggleSubtaskStatus = (projectId, milestoneId, subtaskId) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              milestones: project.milestones.map((milestone) =>
                milestone.id === milestoneId
                  ? {
                      ...milestone,
                      subtasks: milestone.subtasks.map((subtask) =>
                        subtask.id === subtaskId
                          ? {
                              ...subtask,
                              status: subtask.status === "completed" ? "ongoing" : "completed",
                              completedBy: subtask.status === "completed" ? null : intern?.name,
                            }
                          : subtask
                      ),
                    }
                  : milestone
              ),
            }
          : project
      )
    );
  };

  const toggleMilestoneStatus = (projectId, milestoneId) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === projectId
          ? {
              ...project,
              milestones: project.milestones.map((milestone) =>
                milestone.id === milestoneId
                  ? {
                      ...milestone,
                      status: milestone.status === "completed" ? "ongoing" : "completed",
                    }
                  : milestone
              ),
            }
          : project
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white p-6">
      <header className="mb-10 flex items-center justify-between bg-white p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <img
            src={getImageUrl(intern?.profilePicture)}
            alt="Profile"
            className="h-16 w-16 rounded-full border border-[#EA9753] object-cover"
          />
          <div>
            <h1 className="text-3xl font-extrabold text-black">Welcome Back, {intern?.name}</h1>
            <p className="text-gray-600 mt-1">Your personalized dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
         <Link to="/company-chats" className="flex flex-col items-center text-[#EA9753] hover:text-[#d86e2c]">
              <FiSend size={24} />

</Link>

          <img src={logo} alt="System Logo" className="h-14" />
        </div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Intern Info */}
        <div className="col-span-1 bg-[#1a1a1a] p-6 rounded-xl border border-[#144145] space-y-2">
          <h2 className="text-xl font-bold mb-4">👤 Your Info</h2>
          {editing ? (
            <>
              {["name", "email", "password", "university"].map((field) => (
                <input
                  key={field}
                  type={field === "password" ? "password" : "text"}
                  value={updatedInfo[field]}
                  onChange={(e) => setUpdatedInfo({ ...updatedInfo, [field]: e.target.value })}
                  placeholder={field}
                  className="w-full bg-[#2a2a2a] text-white p-2 rounded mb-2"
                />
              ))}
              <button onClick={handleUpdateProfile} className="bg-[#EA9753] text-white px-4 py-2 rounded mt-2">
                Save Changes
              </button>
            </>
          ) : (
            <>
              <p><span className="text-gray-400">Name:</span> {intern?.name}</p>
              <p><span className="text-gray-400">Email:</span> {intern?.email}</p>
              <p><span className="text-gray-400">CGPA:</span> {intern?.CGPA}</p>
              <p><span className="text-gray-400">University:</span> {intern?.university}</p>
              <p>
                <span className="text-gray-400">Status:</span>{" "}
                <span className={`font-semibold ${getStatusColor(intern?.status)}`}>
                  {intern?.status?.charAt(0).toUpperCase() + intern?.status?.slice(1)}
                </span>
              </p>
              <button onClick={() => setEditing(true)} className="text-sm text-[#EA9753] hover:underline mt-2">
                Edit Info
              </button>
            </>
          )}
        </div>

        {/* Projects, Milestones, Subtasks */}
        <div className="col-span-2 bg-[#1a1a1a] p-6 rounded-xl border border-[#144145] space-y-6">
          <h2 className="text-xl font-bold mb-4">🚀 Projects & Milestones</h2>

          {projects.map((project) => (
            <div key={project.id} className="mb-6 border-b border-[#333] pb-4">
              <div className="flex justify-between mb-1">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <span className="text-sm text-gray-400">{calculateProjectProgress(project)}%</span>
              </div>
              <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-[#EA9753]" style={{ width: `${calculateProjectProgress(project)}%` }}></div>
              </div>

              <input
                type="text"
                value={milestoneInput[project.id] || ""}
                onChange={(e) => setMilestoneInput((prev) => ({ ...prev, [project.id]: e.target.value }))}
                placeholder="New milestone"
                className="bg-[#2a2a2a] p-2 w-full rounded mb-2"
              />
              <button onClick={() => addMilestone(project.id, milestoneInput[project.id])} className="text-sm text-[#EA9753] mb-4">
                Add Milestone
              </button>

              {project.milestones.map((milestone) => (
                <div key={milestone.id} className="mb-4 pl-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      📍 {milestone.title} – <span className="text-sm text-gray-400">{calculateMilestoneProgress(milestone)}%</span>
                    </span>
                    <button
                      onClick={() => toggleMilestoneStatus(project.id, milestone.id)}
                      className="text-xs text-gray-300 hover:text-white"
                    >
                      Mark as {milestone.status === "completed" ? "Ongoing" : "Completed"}
                    </button>
                  </div>

                  {milestone.subtasks.map((subtask) => (
                    <div key={subtask.id} className="pl-4 flex justify-between items-center text-sm text-gray-300">
                      <div>
                        👉 {subtask.title}{" "}
                        {subtask.status === "completed" && (
                          <span className="text-xs text-green-400 ml-2">by {subtask.completedBy}</span>
                        )}
                      </div>
                      <button
                        onClick={() => toggleSubtaskStatus(project.id, milestone.id, subtask.id)}
                        className="text-xs text-[#EA9753] hover:underline"
                      >
                        Mark {subtask.status === "completed" ? "Ongoing" : "Completed"}
                      </button>
                    </div>
                  ))}

                  <input
                    type="text"
                    value={subtaskInput[`${project.id}-${milestone.id}`] || ""}
                    onChange={(e) =>
                      setSubtaskInput((prev) => ({ ...prev, [`${project.id}-${milestone.id}`]: e.target.value }))
                    }
                    placeholder="New subtask"
                    className="bg-[#2a2a2a] p-2 w-full mt-2 rounded"
                  />
                  <button
                    onClick={() => addSubtask(project.id, milestone.id, subtaskInput[`${project.id}-${milestone.id}`])}
                    className="text-xs text-[#EA9753] mt-1"
                  >
                    Add Subtask
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
