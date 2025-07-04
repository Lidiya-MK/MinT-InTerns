// Full Supervisor Projects Page
// Includes: Full Width Layout + Full Edit Form (Name, Description, Leader, Members) + Create/Delete

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiEdit2, FiTrash2, FiCheck, FiX, FiSearch } from "react-icons/fi";
import logo from "../../assets/logo.png";
import avatar from "../../assets/default-avatar.png";
import placeholderImage from "../../assets/placeholder.png";

export default function SupervisorProjects() {
  const { supervisorId, cohortId } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: "", leader: "", description: "", members: [] });
  const [teamLeadSearch, setTeamLeadSearch] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", leader: "", members: [] });
  const [teamLeadSearchEdit, setTeamLeadSearchEdit] = useState("");
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("supervisorToken");
      const res = await fetch(`http://localhost:5000/api/supervisor/projects/${supervisorId}/${cohortId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);
      setProjects(data);
    } catch (err) {
      toast.error("Failed to load projects.", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [supervisorId, cohortId]);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const token = localStorage.getItem("supervisorToken");
        const res = await fetch(`http://localhost:5000/api/supervisor/cohort/${cohortId}/interns`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message);
        setInterns(data);
      } catch (err) {
        toast.error("Error fetching interns.", err);
      }
    };
    if (cohortId) fetchInterns();
  }, [cohortId]);

  const handleCreateProject = async () => {
    if (!newProject.name || !newProject.leader || !newProject.description || newProject.members.length === 0) {
      toast.error("Please fill in all fields and select at least one team member.");
      return;
    }
    try {
      const token = localStorage.getItem("supervisorToken");
      const res = await fetch("http://localhost:5000/api/supervisor/new-project", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ supervisorId, cohortId, ...newProject }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);
      toast.success("Project created successfully!");
      setProjects((prev) => [...prev, data]);
      setShowProjectForm(false);
      setNewProject({ name: "", leader: "", description: "", members: [] });
    } catch (err) {
      toast.error("Failed to create project.", err);
    }
  };

  const handleEdit = (project) => {
    setEditingProjectId(project._id);
    setEditForm({
      name: project.name,
      description: project.description,
      leader: project.leader?._id || "",
      members: project.members.map((m) => m._id),
    });
  };

  const handleUpdate = async (projectId) => {
    try {
      const token = localStorage.getItem("supervisorToken");
      const res = await fetch(`http://localhost:5000/api/supervisor/project/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);
      toast.success("Project updated successfully.");
      setEditingProjectId(null);
      fetchProjects();
    } catch (err) {
      toast.error("Failed to update project.", err);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      const token = localStorage.getItem("supervisorToken");
      const res = await fetch(`http://localhost:5000/api/supervisor/project/${projectId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);
      toast.success("Project deleted successfully.");
      setDeleteConfirmationId(null);
      fetchProjects();
    } catch (err) {
      toast.error("Failed to delete project.", err);
    }
  };

  const toggleTeamMember = (internId, isEdit = false) => {
    if (isEdit) {
      setEditForm((prev) => {
        const members = prev.members.includes(internId)
          ? prev.members.filter((id) => id !== internId)
          : [...prev.members, internId];
        return { ...prev, members };
      });
    } else {
      setNewProject((prev) => {
        const members = prev.members.includes(internId)
          ? prev.members.filter((id) => id !== internId)
          : [...prev.members, internId];
        return { ...prev, members };
      });
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/supervisor/${supervisorId}/${cohortId}/project/${projectId}`);
  };

  const filteredTeamLeadOptions = interns.filter((intern) => intern.name?.toLowerCase().includes(teamLeadSearch.toLowerCase()));
  const filteredTeamLeadOptionsEdit = interns.filter((intern) => intern.name?.toLowerCase().includes(teamLeadSearchEdit.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-white text-black py-4 px-6 flex items-center justify-between rounded-b-3xl shadow-md">
        <div className="flex items-center gap-3">
          <img src={avatar} alt="Avatar" className="h-10 w-10 rounded-full object-cover" />
          <h1 className="text-xl sm:text-2xl font-semibold text-black">Welcome, Supervisor</h1>
        </div>

        <div className="flex gap-4">
          <button
            className="px-4 py-2 border border-[#144145] text-[#144145] rounded-2xl font-semibold hover:bg-[#144145] hover:text-white"
            onClick={() => navigate(`/supervisorDashboard/${supervisorId}/${cohortId}`)}
          >
            Interns
          </button>
          <button
            className="px-4 py-2 bg-[#144145] text-white rounded-2xl font-semibold"
            onClick={() => navigate(`/supervisorProjects/${supervisorId}/${cohortId}`)}
          >
            Projects
          </button>
          <img src={logo} alt="MiNT InTerns Logo" className="h-10" />
        </div>
      </header>

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#FFA645]">Manage Your Projects</h2>
          <button
            onClick={() => setShowProjectForm(!showProjectForm)}
            className="px-4 py-2 bg-[#FFA645] text-black font-semibold rounded-2xl hover:bg-[#ffb74d]"
          >
            {showProjectForm ? "Cancel" : "+ New Project"}
          </button>
        </div>

        {showProjectForm && (
          <div className="bg-[#2a2a2a] p-6 rounded-lg space-y-4 mb-8">
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
              <input
                type="text"
                placeholder="Search Team Lead..."
                value={teamLeadSearch}
                onChange={(e) => setTeamLeadSearch(e.target.value)}
                className="w-full p-2 rounded bg-[#1f1f1f] border border-gray-600"
              />
            </div>

            <div className="max-h-40 overflow-y-auto border border-gray-600 rounded">
              {filteredTeamLeadOptions.map((intern) => (
                <div
                  key={intern._id}
                  onClick={() => setNewProject({ ...newProject, leader: intern._id })}
                  className={`p-2 cursor-pointer ${newProject.leader === intern._id ? "bg-[#FFA645] text-black" : "hover:bg-gray-700"}`}
                >
                  {intern.name}
                </div>
              ))}
            </div>

            <p className="text-sm font-semibold text-gray-400">Select Team Members:</p>
            <div className="max-h-40 overflow-y-auto border border-gray-600 rounded">
              {interns.map((intern) => (
                <div
                  key={intern._id}
                  onClick={() => toggleTeamMember(intern._id)}
                  className={`p-2 cursor-pointer ${newProject.members.includes(intern._id) ? "bg-[#FFA645] text-black" : "hover:bg-gray-700"}`}
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

        {projects.length === 0 ? (
          <div className="text-center">
            <img src={placeholderImage} alt="No Projects" className="mx-auto w-40 opacity-60" />
            <p className="text-gray-400 mt-2">No projects to show for this Cohort</p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project) => {
              const total = project.milestones.length;
              const completed = project.milestones.filter((m) => m.status === "complete").length;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

              return (
                <div key={project._id} className="bg-[#2a2a2a] p-6 rounded-2xl shadow-lg border border-gray-700">
                  {editingProjectId === project._id ? (
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full p-2 rounded bg-[#1f1f1f] border border-[#FFA645] text-white"
                      />
                      <textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        className="w-full p-2 rounded bg-[#1f1f1f] border border-[#FFA645] text-white"
                      />

                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search New Team Lead..."
                          value={teamLeadSearchEdit}
                          onChange={(e) => setTeamLeadSearchEdit(e.target.value)}
                          className="w-full p-2 rounded bg-[#1f1f1f] border border-gray-600"
                        />
                      </div>

                      <div className="max-h-40 overflow-y-auto border border-gray-600 rounded">
                        {filteredTeamLeadOptionsEdit.map((intern) => (
                          <div
                            key={intern._id}
                            onClick={() => setEditForm({ ...editForm, leader: intern._id })}
                            className={`p-2 cursor-pointer ${editForm.leader === intern._id ? "bg-[#FFA645] text-black" : "hover:bg-gray-700"}`}
                          >
                            {intern.name}
                          </div>
                        ))}
                      </div>

                      <p className="text-sm font-semibold text-gray-400">Edit Team Members:</p>
                      <div className="max-h-40 overflow-y-auto border border-gray-600 rounded">
                        {interns.map((intern) => (
                          <div
                            key={intern._id}
                            onClick={() => toggleTeamMember(intern._id, true)}
                            className={`p-2 cursor-pointer ${editForm.members.includes(intern._id) ? "bg-[#FFA645] text-black" : "hover:bg-gray-700"}`}
                          >
                            {intern.name}
                          </div>
                        ))}
                      </div>

                      <div className="flex justify-end gap-4">
                        <button onClick={() => handleUpdate(project._id)} className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2">
                          <FiCheck /> Save
                        </button>
                        <button onClick={() => setEditingProjectId(null)} className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2">
                          <FiX /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-[#FFA645] cursor-pointer hover:underline" onClick={() => handleProjectClick(project._id)}>
                            {project.name}
                          </h3>
                          <p className="text-gray-300 mt-1">{project.description}</p>
                          <p className="text-sm text-gray-400 mt-2">Leader: {project.leader?.name}</p>
                          <p className="text-sm text-gray-400">Members: {project.members.map((m) => m.name).join(", ")}</p>
                        </div>
                      <div className="flex space-x-2">
  <button
    title="Edit"
    onClick={() => handleEdit(project)}
    className="p-2 bg-[#FFA645] rounded-full hover:bg-[#ffb74d] transition-colors"
  >
    <FiEdit2 className="text-black" />
  </button>
  <button
    title="Delete"
    onClick={() => setDeleteConfirmationId(project._id)}
    className="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
  >
    <FiTrash2 className="text-white" />
  </button>
</div>

                      </div>

                      {total > 0 && (
                        <div className="mt-4">
                          <div className="w-full bg-gray-600 h-3 rounded-full overflow-hidden">
                            <div className="bg-[#FFA645] h-full" style={{ width: `${percentage}%` }}></div>
                          </div>
                          <p className="text-sm text-gray-400 mt-1">{percentage}% Milestones Completed</p>
                        </div>
                      )}

                      {deleteConfirmationId === project._id && (
                        <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                          <p className="text-red-300 mb-2 font-semibold">Are you sure you want to delete this project?</p>
                          <div className="flex justify-end gap-4">
                            <button onClick={() => handleDelete(project._id)} className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2">
                              <FiTrash2 /> Confirm
                            </button>
                            <button onClick={() => setDeleteConfirmationId(null)} className="px-4 py-2 bg-gray-500 text-white rounded-lg flex items-center gap-2">
                              <FiX /> Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
