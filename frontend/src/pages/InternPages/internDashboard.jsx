import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/logo.png";
import { toast } from "react-hot-toast";

export default function InternDashboard() {
  const { id } = useParams();
  const [intern, setIntern] = useState(null);
  const [projects, setProjects] = useState([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const [updatedInfo, setUpdatedInfo] = useState({});

  useEffect(() => {
    const fetchIntern = async () => {
      try {
        const token = localStorage.getItem("internToken");

        if (!token || !id) {
          return toast.error("Missing credentials. Please login again.");
        }

        const { data } = await axios.get(`http://localhost:5000/api/interns/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIntern(data);
        setUpdatedInfo({
          name: data.name,
          email: data.email,
          CGPA: data.CGPA,
          university: data.university,
        });

        setProjects([
          { id: 1, title: "Mentorship Platform", progress: 80 },
          { id: 2, title: "Internal Chat App", progress: 45 },
        ]);
      } catch (error) {
        toast.error("Failed to load intern data.");
        console.error(error);
      }
    };

    fetchIntern();
  }, [id]);
  
 const getImageUrl = (path) => {
    if (!path) return "/default-avatar.png";
    return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
  };

  const handleProjectAdd = () => {
    if (newProjectTitle.trim() === "") return;

    const newProject = {
      id: projects.length + 1,
      title: newProjectTitle,
      progress: 0,
    };

    setProjects([...projects, newProject]);
    setNewProjectTitle("");
    toast.success("Project added (mock)");
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("internToken");
      await axios.patch(
        `http://localhost:5000/api/interns/${id}`,
        updatedInfo,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile",error);
    }
  };

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
        <div className="flex items-center gap-4">
          {intern?.profilePicture ? (
            <img
              src={getImageUrl(intern.profilePicture)}
              alt="Profile"
              className="h-16 w-16 rounded-full border border-[#EA9753] object-cover"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gray-700"></div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold">Welcome Back, {intern?.name}</h1>
            <p className="text-gray-300 mt-1">Your personalized dashboard</p>
          </div>
        </div>
        <img src={logo} alt="System Logo" className="h-14" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {/* Profile Info */}
        <div className="col-span-1 bg-[#1a1a1a] p-6 rounded-xl border border-[#144145] space-y-2">
          <h2 className="text-xl font-bold mb-4">👤 Your Info</h2>

          {editing ? (
            <>
              <input
                type="text"
                value={updatedInfo.name}
                onChange={(e) => setUpdatedInfo({ ...updatedInfo, name: e.target.value })}
                className="w-full bg-[#2a2a2a] text-white p-2 rounded mb-2"
                placeholder="Name"
              />
              <input
                type="email"
                value={updatedInfo.email}
                onChange={(e) => setUpdatedInfo({ ...updatedInfo, email: e.target.value })}
                className="w-full bg-[#2a2a2a] text-white p-2 rounded mb-2"
                placeholder="Email"
              />
              <input
                type="password"
                value={updatedInfo.password}
                onChange={(e) => setUpdatedInfo({ ...updatedInfo, password: e.target.value })}
                className="w-full bg-[#2a2a2a] text-white p-2 rounded mb-2"
                placeholder="password"
              />
              <input
                type="text"
                value={updatedInfo.university}
                onChange={(e) => setUpdatedInfo({ ...updatedInfo, university: e.target.value })}
                className="w-full bg-[#2a2a2a] text-white p-2 rounded mb-2"
                placeholder="University"
              />
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
              <button
                onClick={() => setEditing(true)}
                className="text-sm text-[#EA9753] hover:underline mt-2"
              >
                Edit Info
              </button>
            </>
          )}
        </div>

        {/* Project Tracker */}
        <div className="col-span-2 bg-[#1a1a1a] p-6 rounded-xl border border-[#144145]">
          <h2 className="text-xl font-bold mb-4">🚀 Your Projects</h2>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="New project title"
              className="flex-1 bg-[#2a2a2a] text-white p-2 rounded"
            />
            <button onClick={handleProjectAdd} className="bg-[#EA9753] px-4 rounded">
              Add
            </button>
          </div>

          <div className="space-y-4">
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
        </div>
      </div>
    </div>
  );
}
