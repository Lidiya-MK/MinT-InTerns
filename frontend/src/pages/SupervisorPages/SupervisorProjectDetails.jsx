import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FiCheck } from "react-icons/fi";
import "react-circular-progressbar/dist/styles.css";
import logo from "../../assets/logo.png";
import avatar from "../../assets/default-avatar.png";

export default function SupervisorProjectDetails() {
  const { supervisorId, projectId, cohortId } = useParams();
  const [project, setProject] = useState(null);
  const [isClosed, setIsClosed] = useState(false);
  const [outcome, setOutcome] = useState(null);

  const token = localStorage.getItem("supervisorToken");

  const fetchProjectDetails = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/supervisor/project/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);

      const milestoneDetails = await Promise.all(
        (data.milestones || []).map(async (milestoneId) => {
          const milestoneRes = await fetch(
            `http://localhost:5000/api/supervisor/milestone/${milestoneId}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          const milestoneData = await milestoneRes.json();
          if (!milestoneRes.ok) throw new Error(milestoneData?.message);
          return milestoneData;
        })
      );

      setProject({ ...data, milestones: milestoneDetails });
      setIsClosed(data.status === "closed");
      setOutcome(data.outcome);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load project details.");
    }
  };

  useEffect(() => {
    if (projectId) fetchProjectDetails();
  }, [projectId]);

  const handleToggleStatus = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/supervisor/${projectId}/toggle-status`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);

      toast.success("Project status updated.");
      await fetchProjectDetails();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle project status.");
    }
  };

  const handleToggleOutcome = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/supervisor/${projectId}/toggle-outcome`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message);

      toast.success("Project outcome updated.");
      await fetchProjectDetails();
    } catch (err) {
      console.error(err);
      toast.error("Failed to toggle project outcome.");
    }
  };

  if (!project) {
    return <p className="text-gray-400 p-4">Loading project details...</p>;
  }

  let totalSubtasks = 0;
  let completedSubtasks = 0;
  project.milestones?.forEach((m) => {
    totalSubtasks += m.tasks?.length || 0;
    completedSubtasks +=
      m.tasks?.filter((st) => st.status === "completed").length || 0;
  });
  const progress =
    totalSubtasks === 0 ? 0 : (completedSubtasks / totalSubtasks) * 100;

  return (
    <div className="min-h-screen bg-white text-white">
      <header className="bg-white text-black py-4 px-4 flex items-center justify-between rounded-b-3xl shadow-md">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt="Avatar"
            className="h-10 w-10 rounded-full object-cover"
          />
          <h1 className="text-xl sm:text-2xl font-semibold text-black">
            Welcome, Supervisor
          </h1>
        </div>
        <div className="flex gap-4">
          <img src={logo} alt="MiNT InTerns" className="h-10" />
        </div>
      </header>

      <main className="mt-6 p-6">
        <Link
          to={`/supervisorDashboard/${supervisorId}/${cohortId}`}
          className="text-[#144145] hover:underline px-6"
        >
          ← Back to Dashboard
        </Link>

        <div className="flex flex-col md:flex-row gap-6 mt-4">
          <div className="flex-1 bg-white text-black p-4 md:p-6 rounded-xl border border-gray-300 shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl md:text-3xl font-bold text-[#144145]">
                {project.name}
              </h2>
              <div className="w-20 h-20">
                <CircularProgressbar
                  value={progress}
                  text={`${Math.round(progress)}%`}
                  styles={buildStyles({
                    textSize: "22px",
                    textColor: "#144145",
                    pathColor: "#EA9753",
                    trailColor: "#e6e6e6",
                  })}
                />
              </div>
            </div>

            <p className="text-gray-600 mb-2">
              {project.description || "No description available."}
            </p>

            <div className="mt-4 text-sm">
              <p className="font-semibold text-gray-700">⭐ Project Leader:</p>
              <p>{project.leader?.name || "N/A"}</p>
              <p className="text-gray-500">{project.leader?.email || ""}</p>
            </div>

            <div className="mt-4 text-sm">
              <p className="font-semibold text-gray-700">👥 Team Members:</p>
              {(!project.members || project.members.length === 0) ? (
                <p className="text-gray-500">No team members.</p>
              ) : (
                <ul className="list-disc list-inside ml-2">
                  {project.members.map((member) => (
                    <li key={member._id}>
                      {member.name}{" "}
                      <span className="text-gray-500 text-xs">
                        ({member.email})
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-semibold text-gray-700">📅 Milestones:</p>
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
                      </div>
                    </div>

                    <div className="ml-4 mt-1 space-y-1">
                      {milestone.tasks?.length > 0 ? (
                        milestone.tasks.map((task, index) => (
                          <div
                            key={index}
                            className={`flex items-center p-1 rounded ${
                              task.status === "completed"
                                ? "bg-green-50 text-green-700"
                                : "bg-white"
                            }`}
                          >
                            <span className="flex gap-2 items-center text-xs">
                              {task.status === "completed" ? "🟢" : "⚪"} {task.name}
                              {task.completedBy && (
                                <span className="italic text-gray-500">
                                  (by {task.completedBy.name})
                                </span>
                              )}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No subtasks yet.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No milestones yet.</p>
              )}
            </div>

            <div className="mt-6 flex items-center gap-4">
              <span className="font-medium">Project Status: </span>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-colors duration-300 ${
                  isClosed ? "bg-red-500 text-white" : "bg-green-500 text-white"
                }`}
              >
                {isClosed ? "Closed" : "Open"}
              </button>
            </div>

            {isClosed && (
             <div className="mt-4 flex flex-col gap-2">
  <button
    onClick={handleToggleOutcome}
    className={`flex-1 py-2 rounded-full font-semibold text-sm transition-colors duration-300 ${
      outcome === "successful"
        ? "bg-green-600 text-white"
        : "bg-green-200 text-green-800"
    }`}
  >
    {outcome === "successful" ? "Mark as Failed" : "Mark as Successful"}
  </button>

  {/* Display project outcome status */}
  <p className="text-sm text-gray-700 text-center">
    Current Outcome:{" "}
    <span
      className={`font-semibold ${
        outcome === "successful"
          ? "text-green-600"
          : outcome === "failed"
          ? "text-red-600"
          : "text-yellow-600"
      }`}
    >
      {outcome}
    </span>
  </p>
</div>

            )}
          </div>
        </div>
      </main>
    </div>
  );
}
