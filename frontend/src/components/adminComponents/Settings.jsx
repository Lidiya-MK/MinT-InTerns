import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Pencil } from "lucide-react";
import Sidebar from "../adminComponents/Sidebar"; 

const Settings = () => {
  const [cohorts, setCohorts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    applicationStart: "",
    applicationEnd: "",
    cohortStart: "",
    cohortEnd: "",
    maxInterns: "",
  });

  const [selectedCohort, setSelectedCohort] = useState(null);
  const [newMaxInterns, setNewMaxInterns] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchCohorts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/cohorts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCohorts(res.data);
    } catch (err) {
      toast.error("Failed to load cohorts.", err);
    }
  };

  const createCohort = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/admin/cohorts", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cohort created!");
      setForm({
        name: "",
        applicationStart: "",
        applicationEnd: "",
        cohortStart: "",
        cohortEnd: "",
        maxInterns: "",
      });
      fetchCohorts();
    } catch (err) {
      toast.error("Failed to create cohort.", err);
    }
  };

  const deleteCohort = async (id) => {
    if (!window.confirm("Are you sure you want to delete this cohort?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/admin/cohorts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cohort deleted.");
      fetchCohorts();
    } catch (err) {
      toast.error("Delete failed.", err);
    }
  };

  const openEditModal = (cohort) => {
    setSelectedCohort(cohort);
    setNewMaxInterns(cohort.maxInterns);
    setIsModalOpen(true);
  };

  const handleUpdateMaxInterns = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/cohorts/updatemax/${selectedCohort._id}`,
        {
          max: newMaxInterns,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Max interns updated.");
      setIsModalOpen(false);
      fetchCohorts();
    } catch (err) {
      toast.error("Update failed.",err);
    }
  };

  useEffect(() => {
    fetchCohorts();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Internship Cohorts</h1>

        {/* Create Cohort Form */}
        <form
          onSubmit={createCohort}
          className="bg-[#1e1e1e] p-6 rounded-md shadow-md mb-10"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Cohort
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1 text-gray-300">Cohort Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Summer 2025"
                required
                className="w-full p-2 rounded bg-[#2e2e2e] text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Max Interns</label>
              <input
                type="number"
                name="maxInterns"
                value={form.maxInterns}
                onChange={(e) => setForm({ ...form, maxInterns: e.target.value })}
                placeholder="Max Interns"
                required
                className="w-full p-2 rounded bg-[#2e2e2e] text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Application Start</label>
              <input
                type="date"
                name="applicationStart"
                value={form.applicationStart}
                onChange={(e) => setForm({ ...form, applicationStart: e.target.value })}
                required
                className="w-full p-2 rounded bg-[#2e2e2e] text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Application End</label>
              <input
                type="date"
                name="applicationEnd"
                value={form.applicationEnd}
                onChange={(e) => setForm({ ...form, applicationEnd: e.target.value })}
                required
                className="w-full p-2 rounded bg-[#2e2e2e] text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Cohort Start</label>
              <input
                type="date"
                name="cohortStart"
                value={form.cohortStart}
                onChange={(e) => setForm({ ...form, cohortStart: e.target.value })}
                required
                className="w-full p-2 rounded bg-[#2e2e2e] text-white"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-300">Cohort End</label>
              <input
                type="date"
                name="cohortEnd"
                value={form.cohortEnd}
                onChange={(e) => setForm({ ...form, cohortEnd: e.target.value })}
                required
                className="w-full p-2 rounded bg-[#2e2e2e] text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#D25B24] hover:bg-orange-700 px-6 py-2 rounded font-semibold"
          >
            Create Cohort
          </button>
        </form>

        {/* Existing Cohorts List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold mb-4">Existing Cohorts</h2>
          {cohorts.length === 0 ? (
            <p className="text-gray-400">No cohorts yet.</p>
          ) : (
            cohorts.map((c) => (
              <div
                key={c._id}
                className="bg-[#1e1e1e] p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{c.name}</h3>
                  <p className="text-sm text-gray-400">
                    Application: {new Date(c.applicationStart).toLocaleDateString()} -{" "}
                    {new Date(c.applicationEnd).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400">
                    Cohort: {new Date(c.cohortStart).toLocaleDateString()} -{" "}
                    {new Date(c.cohortEnd).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-400">Max Interns: {c.maxInterns}</p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => openEditModal(c)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => deleteCohort(c._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal for Editing Max Interns */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#1e1e1e] p-6 rounded w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                Update Max Interns for {selectedCohort?.name}
              </h3>
              <input
                type="number"
                value={newMaxInterns}
                onChange={(e) => setNewMaxInterns(e.target.value)}
                className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white mb-4"
                min="1"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateMaxInterns}
                  className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Settings;
