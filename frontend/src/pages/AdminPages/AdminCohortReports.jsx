// src/pages/AdminPages/AdminCohortReports.jsx

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  FaProjectDiagram,
  FaUsers,
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaQuestionCircle,
} from "react-icons/fa";

export default function AdminCohortReports() {
  const { cohortId } = useParams();
  const [cohort, setCohort] = useState(null);
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

  const API_BASE = "http://localhost:5000/api/admin";
  const IMG_BASE = "http://localhost:5000";

  const COLORS = ["#144145", "#EA9753", "#8884d8"];

  // Build full image URL and normalize slashes
  const getImageUrl = (path) => {
    if (!path) return "/default-avatar.png";
    // ensure no double slashes and allow both absolute "/uploads/..." and "uploads/..."
    const clean = path.replace(/^\/+/, "");
    return `${IMG_BASE}/${clean}`;
  };

  // Background color based on outcome
  const getOutcomeBg = (outcome) => {
    switch (outcome) {
      case "successful":
        return "bg-green-50";
      case "failed":
        return "bg-red-50";
      case "unknown":
      default:
        return "bg-yellow-50";
    }
  };

  // Icon based on project outcome
  const getOutcomeIcon = (outcome) => {
    switch (outcome) {
      case "successful":
        return <FaCheckCircle className="text-green-500 inline-block mr-1" />;
      case "failed":
        return <FaTimesCircle className="text-red-500 inline-block mr-1" />;
      case "unknown":
      default:
        return <FaQuestionCircle className="text-yellow-500 inline-block mr-1" />;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAll = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch cohort meta
        const cohortRes = await fetch(`${API_BASE}/cohort/${cohortId}`, { headers });
        const cohortData = await cohortRes.json();
        if (!cohortRes.ok) throw new Error(cohortData?.message || "Failed to load cohort");
        if (!isMounted) return;
        setCohort(cohortData);

        // Fetch projects by cohort (includes leader, supervisor, members, and progress)
        const projRes = await fetch(`${API_BASE}/cohort/${cohortId}/projects`, { headers });
        const projData = await projRes.json();
        if (!projRes.ok) throw new Error(projData?.message || "Failed to load projects");
        if (!isMounted) return;
        setProjects(Array.isArray(projData) ? projData : []);

        // Fetch accepted interns by cohort
        const internsRes = await fetch(`${API_BASE}/cohort/${cohortId}/interns/accepted`, { headers });
        const internsData = await internsRes.json();
        if (!internsRes.ok) throw new Error(internsData?.message || "Failed to load interns");
        if (!isMounted) return;

        // Some backends might return {message: "..."} when none exist; normalize to []
        const internsArray = Array.isArray(internsData) ? internsData : [];

        // Compute absentDays from attendanceRecords
        const internsWithAbsents = internsArray.map((i) => {
          const absentDays =
            Array.isArray(i.attendanceRecords)
              ? i.attendanceRecords.filter((r) => r.attendanceStatus === "absent").length
              : 0;
          return { ...i, absentDays };
        });

        setInterns(internsWithAbsents);
      } catch (err) {
        console.error("Report fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (cohortId) fetchAll();
    return () => {
      isMounted = false;
    };
  }, [API_BASE, cohortId]);

  if (loading) {
    return <div className="p-8 text-center text-gray-600">Loading reports...</div>;
  }

  // Quick stats
  const totalProjects = projects.length;
  const totalInterns = interns.length;
  const avgAttendance =
    totalInterns > 0
      ? (interns.reduce((acc, i) => acc + (i.absentDays || 0), 0) / totalInterns).toFixed(2)
      : "0.00";

  return (
    <div className="min-h-screen p-8 bg-[#f5f7fa] text-gray-900 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10">
        <h1 className="text-5xl font-extrabold text-[#144145] flex items-center gap-3">
          <FaClipboardList />
          Cohort Report: {cohort?.name || "Cohort"}
        </h1>
        <div className="mt-4 md:mt-0 text-sm text-gray-600 italic">
          Generated on {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-gray-200 hover:shadow-xl transition">
          <FaProjectDiagram className="text-[#144145] text-4xl" />
          <div>
            <p className="text-sm text-gray-500">Total Projects</p>
            <p className="text-3xl font-bold">{totalProjects}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-gray-200 hover:shadow-xl transition">
          <FaUsers className="text-[#EA9753] text-4xl" />
          <div>
            <p className="text-sm text-gray-500">Total Interns</p>
            <p className="text-3xl font-bold">{totalInterns}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4 border border-gray-200 hover:shadow-xl transition">
          <FaClipboardList className="text-[#8884d8] text-4xl" />
          <div>
            <p className="text-sm text-gray-500">Avg. Absent Days</p>
            <p className="text-3xl font-bold">{avgAttendance}</p>
          </div>
        </div>
      </div>

      <div ref={reportRef}>
        {/* Projects Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-300 pb-2 flex items-center gap-3 text-[#144145]">
            <FaProjectDiagram /> Projects Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((project) => (
              <div
                key={project._id}
                className={`rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-2xl transition  ${getOutcomeBg(
                  project.outcome
                )}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      {project.name}
                      <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                        {(project.status || "open").toString().toUpperCase()}
                      </span>
                    </h3>

                    <p className="text-sm mb-1 flex items-center gap-1">
                      <strong>Outcome:</strong> {getOutcomeIcon(project.outcome)}{" "}
                      {project.outcome
                        ? project.outcome.charAt(0).toUpperCase() + project.outcome.slice(1)
                        : "Unknown"}
                    </p>

                    <p className="text-sm mb-1">
                      <strong>Supervisor:</strong> {project.supervisor?.name || "N/A"}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Team Lead:</strong> {project.leader?.name || "N/A"}
                    </p>
                  </div>

                  {/* Progress Circle */}
                  <div className="relative w-20 h-20">
                    <svg className="absolute top-0 left-0 w-full h-full">
                      <circle
                        className="text-gray-200"
                        strokeWidth="8"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="40"
                        cy="40"
                      />
                      <circle
                        className="text-[#144145]"
                        strokeWidth="8"
                        strokeDasharray={`${(((project.progress ?? 0) / 100) * 188).toFixed(1)}, 188`}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="30"
                        cx="40"
                        cy="40"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-[#144145]">
                      {project.progress ?? 0}%
                    </div>
                  </div>
                </div>

                {/* Members */}
                <div className="mt-6">
                  <p className="font-medium mb-3 border-b border-gray-300 pb-1">Team Members:</p>
                  {project.members?.length ? (
                    <ul className="flex flex-wrap gap-4">
                      {project.members.map((member) => (
                        <li
                          key={member._id}
                          className="flex items-center gap-3 bg-white shadow rounded-full px-3 py-1 border border-gray-200 hover:bg-[#EA9753] hover:text-white transition cursor-default"
                          title={member.name}
                        >
                          <img
                            src={getImageUrl(member.profilePicture)}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            onError={(e) => {
                              e.currentTarget.src = "/default-avatar.png";
                            }}
                          />
                          <span className="font-medium">{member.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">No members listed.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Outcomes Pie Chart */}
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-2 flex items-center gap-3 text-[#144145]">
            <FaClipboardList /> Project Outcomes Summary
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={[
                  { name: "Successful", value: projects.filter((p) => p.outcome === "successful").length },
                  { name: "Failed", value: projects.filter((p) => p.outcome === "failed").length },
                  { name: "Unknown", value: projects.filter((p) => !p.outcome || p.outcome === "unknown").length },
                ]}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {COLORS.map((color, index) => (
                  <Cell key={index} fill={color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </section>

        {/* Intern Table */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-2 flex items-center gap-3 text-[#144145]">
            <FaUsers /> Accepted Interns & Attendance
          </h2>
          <table className="w-full bg-white rounded-xl shadow overflow-hidden">
            <thead className="bg-[#144145] text-white">
              <tr>
                <th className="py-3 px-5 text-left">Intern</th>
                <th className="py-3 px-5 text-left">Email</th>
                <th className="py-3 px-5 text-left">Absent Days</th>
              </tr>
            </thead>
            <tbody>
              {interns.map((intern) => (
                <tr key={intern._id} className="border-b hover:bg-gray-100 transition">
                  <td className="py-3 px-5 flex items-center gap-3">
                    <img
                      src={getImageUrl(intern.profilePicture)}
                      alt={intern.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                      onError={(e) => {
                        e.currentTarget.src = "/default-avatar.png";
                      }}
                    />
                    <span className="font-semibold">{intern.name}</span>
                  </td>
                  <td className="py-3 px-5 text-gray-700">{intern.email}</td>
                  <td className="py-3 px-5 font-semibold text-center text-[#EA9753]">
                    {intern.absentDays ?? 0}
                  </td>
                </tr>
              ))}
              {!interns.length && (
                <tr>
                  <td className="py-4 px-5 text-gray-500" colSpan={3}>
                    No accepted interns for this cohort.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Footer */}
        <footer className="mt-20 text-center text-gray-500 italic">
          &copy; {new Date().getFullYear()} Ministry of Innovation and Technology
        </footer>
      </div>
    </div>
  );
}
