import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";
import { toast } from "react-hot-toast";
import { FiLogOut, FiEdit, FiTrash2, FiCheck, FiPlus, FiCheckCircle, FiX } from "react-icons/fi";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
export default function InternDashboard() {
  const { id } = useParams();
  const [intern, setIntern] = useState(null);
  const [editingSubtask, setEditingSubtask] = useState({});
  const [editingMilestone, setEditingMilestone] = useState({});
  const [projects, setProjects] = useState([]);
  const [milestoneInputs, setMilestoneInputs] = useState({});
  const [subtaskInputs, setSubtaskInputs] = useState({});
  const [activeTab, setActiveTab] = useState("projects");

  useEffect(() => {
    fetchInternData();
  }, [id]);
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("internToken");
  toast.success("Logged out successfully");
  navigate("/intern-login");
};
  const fetchInternData = async () => {
    try {
      const token = localStorage.getItem("internToken");
      if (!token || !id) return toast.error("Missing credentials. Please login again.");

      const { data: internData } = await axios.get(`http://localhost:5000/api/interns/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIntern(internData);

      const { data: projectsData } = await axios.get(`http://localhost:5000/api/interns/${id}/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projectsData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data. Please try again.");
    }
  };

  const handleMilestoneInputChange = (projectId, value) => {
    setMilestoneInputs({ ...milestoneInputs, [projectId]: value });
  };

  const handleSubtaskInputChange = (milestoneId, value) => {
    setSubtaskInputs({ ...subtaskInputs, [milestoneId]: value });
  };

  const handleAddMilestone = async (projectId) => {
    const name = milestoneInputs[projectId]?.trim();
    if (!name) return toast.error("Milestone name required");

    try {
      const token = localStorage.getItem("internToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post("http://localhost:5000/api/interns/addms", { projectId, name }, config);

      toast.success("Milestone added");
      setMilestoneInputs({ ...milestoneInputs, [projectId]: "" });
      fetchInternData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add milestone");
    }
  };


  const handleEditSubtask = (taskId, currentName) => {
    setEditingSubtask({ taskId, name: currentName });
  };

  const handleSubtaskNameChange = (e) => {
    setEditingSubtask({ ...editingSubtask, name: e.target.value });
  };

  const handleConfirmSubtaskEdit = async (milestoneId, taskId) => {
    try {
      const token = localStorage.getItem("internToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.patch(
        `http://localhost:5000/api/interns/milestone/${milestoneId}/subtask/${taskId}`,
        { name: editingSubtask.name },
        config
      );

      toast.success("Subtask updated");
      setEditingSubtask({});
      fetchInternData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to edit subtask");
    }
  };

  const handleCancelSubtaskEdit = () => {
    setEditingSubtask({});
  };


  const handleEditMilestone = (milestoneId, currentName) => {
  setEditingMilestone({ milestoneId, name: currentName });
};

// Handle text input change while editing milestone name
const handleMilestoneNameChange = (e) => {
  setEditingMilestone({ ...editingMilestone, name: e.target.value });
};

// Confirm and submit milestone name update
const handleConfirmMilestoneEdit = async (milestoneId) => {
  try {
    const token = localStorage.getItem("internToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    await axios.patch(
      `http://localhost:5000/api/interns/milestone/${milestoneId}`,
      { name: editingMilestone.name },
      config
    );

    toast.success("Milestone updated");
    setEditingMilestone({});
    fetchInternData();
  } catch (error) {
    console.error(error);
    toast.error("Failed to edit milestone");
  }
};

// Cancel milestone editing
const handleCancelMilestoneEdit = () => {
  setEditingMilestone({});
};
  const handleAddSubtask = async (milestoneId) => {
    const taskName = subtaskInputs[milestoneId]?.trim();
    if (!taskName) return toast.error("Subtask name required");

    try {
      const token = localStorage.getItem("internToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.post(`http://localhost:5000/api/interns/milestones/${milestoneId}/tasks`, { taskName }, config);

      toast.success("Subtask added");
      setSubtaskInputs({ ...subtaskInputs, [milestoneId]: "" });
      fetchInternData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add subtask");
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (!window.confirm("Are you sure you want to delete this milestone?")) return;

    try {
      const token = localStorage.getItem("internToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`http://localhost:5000/api/interns/milestone/${milestoneId}`, config);

      toast.success("Milestone deleted successfully");
      fetchInternData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete milestone");
    }
  };

 const handleDeleteSubtask = async (milestoneId, taskId) => {
  if (!window.confirm("Are you sure you want to delete this subtask?")) return;

  try {
    const token = localStorage.getItem("internToken");
    const config = { headers: { Authorization: `Bearer ${token}` } };

    await axios.delete(`http://localhost:5000/api/interns/subtask/${milestoneId}/${taskId}`, config);

    toast.success("Subtask deleted successfully");
    fetchInternData();
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete subtask");
  }
};


  // UPDATED: Send task._id instead of index to toggle subtask status
  const handleToggleSubtaskStatus = async (milestoneId, taskId, completedBy) => {
    try {
      const userId = intern._id;
      const token = localStorage.getItem("internToken");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (completedBy && completedBy._id !== userId) {
        toast.error("Only the intern who marked this subtask completed can change its status.");
        return;
      }

      await axios.patch(
        `http://localhost:5000/api/interns/toggleSubTask/${userId}`,
        { milestoneId, taskId },
        config
      );

      toast.success("Subtask status updated!");
      fetchInternData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to toggle subtask status.");
    }
  };

  const getImageUrl = (path) => (path ? `http://localhost:5000/${path.replace(/\\/g, "/")}` : "/default-avatar.png");

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-6">
     <header className="sticky top-0 z-50 flex flex-col md:flex-row md:items-center md:justify-between bg-white p-4 md:p-6 rounded-2xl shadow border border-gray-200 mb-4">
  <div className="flex items-center gap-4 md:gap-6 mb-4 md:mb-0">
    <div className="relative">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#144145] to-[#1D7F8C] blur-sm opacity-30 animate-pulse"></div>
      <img
        src={getImageUrl(intern?.profilePicture)}
        alt="Profile"
        className="relative h-12 w-12 md:h-16 md:w-16 rounded-full border-4 border-[#1D7F8C] shadow-md object-cover"
      />
    </div>
    <div>
      <h1 className="text-xl md:text-2xl font-extrabold text-gray-800">
        {intern?.name}
      </h1>
      <p className="text-xs md:text-sm text-gray-500 mt-1">
        Welcome back! Here’s what’s happening today
      </p>
    </div>
  </div>

  <div className="flex items-center gap-4">
    
    <button
      onClick={handleLogout}
      className="text-[#144145] hover:text-red-500 transition-colors duration-200"
      title="Logout"
  
    >
      <FiLogOut size={24} />
    </button>
    <img src={logo} alt="System Logo" className="h-10 w-auto" />

   
  </div>
</header>

      <div className="flex justify-center gap-4 mb-4 border-b border-gray-300">
        <button
          onClick={() => setActiveTab("projects")}
          className={`px-4 py-2 font-semibold ${activeTab === "projects" ? "border-b-4 border-[#144145] text-[#144145]" : "text-gray-500"}`}
        >
          Projects
        </button>
        <Link
          to={`/interns/${id}/profile`}
          className="px-4 py-2 font-semibold border-b-4 border-transparent text-gray-500 hover:text-[#EA9753] hover:border-[#EA9753] transition"
        >
          Profile
        </Link>
      </div>

      {activeTab === "projects" && (
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          <div className="flex-1 bg-white p-4 md:p-6 rounded-xl border border-gray-300 shadow">
            <h2 className="text-lg font-bold mb-4">🚀 Your Projects</h2>

            {projects.length === 0 ? (
              <p className="text-gray-500">You’re not part of any project yet.</p>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => {
                  let totalSubtasks = 0;
                  let completedSubtasks = 0;

                  project.milestones?.forEach((m) => {
                    totalSubtasks += m.tasks?.length || 0;
                    completedSubtasks += m.tasks?.filter((st) => st.status === "completed").length || 0;
                  });

                  const progress = totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;
                  const isLeader = intern?.email === project?.leader?.email;

                  return (
                    <div key={project._id} className="border border-gray-300 p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="text-md md:text-3xl font-bold text-[#144145]">{project.name}</h3>
                        <div className="w-24 h-24">
                          <CircularProgressbar
                            value={progress}
                            text={`${Math.round(progress)}%`}
                            styles={buildStyles({
                              textSize: "24px",
                              textColor: "#144145",
                              pathColor: "#EA9753",
                              trailColor: "#e6e6e6",
                            })}
                          />
                        </div>
                      </div>
                      <p className="text-gray-600 mb-1">{project.description}</p>

                      {project.leader && (
                        <div className="mt-2 text-sm text-gray-800">
                          <p className="font-semibold">⭐ Project Leader:</p>
                          <p>Name: {project.leader.name}</p>
                          <p>Email: {project.leader.email}</p>
                        </div>
                      )}

                      {project.members?.length > 0 && (
                        <div className="mt-2 text-sm text-gray-800">
                          <p className="font-semibold">👥 Members:</p>
                          <ul className="list-disc list-inside ml-2">
                            {project.members.map((member) => (
                              <li key={member._id}>{member.name} - {member.email}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-700">Milestones:</p>
                        {project.milestones?.length > 0 ? (
                          project.milestones.map((milestone) => (
                            <div
  key={milestone._id}
  className={`p-2 rounded border text-sm ${
    milestone.status === "completed"
      ? "bg-green-100 border-green-300"
      : "bg-yellow-50 border-yellow-300"
  }`}
>
  <div className="flex justify-between items-center">
    <div className="flex gap-1 items-center">
      {milestone.status === "completed" ? (
        <FiCheck className="text-green-600" />
      ) : (
        <div className="w-4 h-4 border border-gray-400 rounded-full bg-yellow-400" />
      )}

      {/* EDIT MODE for Milestone Name */}
      {editingMilestone.milestoneId === milestone._id ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editingMilestone.name}
            onChange={handleMilestoneNameChange}
            className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#144145]"
          />
          <button
            onClick={() => handleConfirmMilestoneEdit(milestone._id)}
            className="text-green-600 hover:text-green-800"
            title="Confirm"
          >
            <FiCheck size={18} />
          </button>
          <button
            onClick={handleCancelMilestoneEdit}
            className="text-red-500 hover:text-red-700"
            title="Cancel"
          >
            <FiX size={18} />
          </button>
        </div>
      ) : (
        <div className="font-medium flex gap-2 items-center">
          📌 {milestone.name}
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              milestone.status === "completed"
                ? "bg-green-500 text-white"
                : "bg-yellow-400 text-white"
            }`}
          >
            {milestone.status}
          </span>
        </div>
      )}
    </div>

    {milestone.status !== "completed" && isLeader && editingMilestone.milestoneId !== milestone._id && (
      <div className="flex gap-1">
        <button
          onClick={() => handleEditMilestone(milestone._id, milestone.name)}
          className="text-[#144145] hover:text-[#144145]"
          title="Edit Milestone"
        >
          <FiEdit />
        </button>
        <button
          onClick={() => handleDeleteMilestone(milestone._id)}
          className="text-red-500 hover:text-red-700"
          title="Delete Milestone"
        >
          <FiTrash2 />
        </button>
      </div>
    )}
  </div>

  <div className="ml-4 mt-1 space-y-1">
    {milestone.tasks?.length > 0 ? (
      milestone.tasks.map((task) => (
        <div
          key={task._id}
          className={`flex justify-between items-center gap-2 p-2 rounded-md border ${
            task.status === "completed"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-white border-gray-200"
          } shadow-sm`}
        >
          {editingSubtask.taskId === task._id ? (
            <div className="flex items-center w-full gap-2">
              <input
                type="text"
                value={editingSubtask.name}
                onChange={handleSubtaskNameChange}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#144145]"
              />
              <button
                onClick={() => handleConfirmSubtaskEdit(milestone._id, task._id)}
                className="text-green-600 hover:text-green-800"
                title="Confirm"
              >
                <FiCheckCircle size={18} />
              </button>
              <button
                onClick={handleCancelSubtaskEdit}
                className="text-red-500 hover:text-red-700"
                title="Cancel"
              >
                <FiX size={18} />
              </button>
            </div>
          ) : (
            <>
              <div
                className="flex items-center gap-2 flex-1 cursor-pointer"
                onClick={() =>
                  handleToggleSubtaskStatus(milestone._id, task._id, task.completedBy)
                }
              >
                {task.status === "completed" ? "🟢" : "⚪"}{" "}
                <span className="text-sm font-medium">{task.name}</span>
                {task.completedBy && (
                  <span className="text-xs italic text-gray-500">
                    (by {task.completedBy.name})
                  </span>
                )}
              </div>

              {task.status !== "completed" && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditSubtask(task._id, task.name)}
                    className="text-[#144145] hover:text-[#0f2c2f]"
                    title="Edit Subtask"
                  >
                    <FiEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteSubtask(milestone._id, task._id)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete Subtask"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))
    ) : (
      <p className="text-xs text-gray-500">No subtasks yet.</p>
    )}

    {isLeader && (
      <div className="flex items-center gap-2 mt-1">
        <input
          type="text"
          placeholder="New subtask"
          value={subtaskInputs[milestone._id] || ""}
          onChange={(e) => handleSubtaskInputChange(milestone._id, e.target.value)}
          className="flex-1 p-1 border rounded text-xs"
        />
       <button
  onClick={() => {
    if (project.status !== "closed") handleAddSubtask(milestone._id);
  }}
  disabled={project.status === "closed"}
  className={`rounded p-1 ${
    project.status === "closed"
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-[#EA9753] hover:bg-[#d2782c] text-white"
  }`}
  title={project.status === "closed" ? "Project is closed" : "Add subtask"}
>
  <FiPlus />
</button>

      </div>
    )}
  </div>
</div>

                          ))
                        ) : (
                          <p className="text-xs text-gray-500">No milestones yet.</p>
                        )}

                        {isLeader && (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="text"
                              placeholder="New milestone"
                              value={milestoneInputs[project._id] || ""}
                              onChange={(e) => handleMilestoneInputChange(project._id, e.target.value)}
                              className="flex-1 p-1 border rounded text-xs"
                            />
                         <button
  onClick={() => {
    if (project.status !== "closed") handleAddMilestone(project._id);
  }}
  disabled={project.status === "closed"}
  className={`rounded p-1 ${
    project.status === "closed"
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-[#144145] hover:bg-[#0e2d30] text-white"
  }`}
  title={project.status === "closed" ? "Project is closed" : "Add milestone"}
>
  <FiPlus />
</button>

                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
