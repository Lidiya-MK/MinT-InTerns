import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, Plus, Pencil } from "lucide-react";
import {Users } from "lucide-react"; // Add Users icon


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
  const [editForm, setEditForm] = useState(null);
  const [newMaxInterns, setNewMaxInterns] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFullEditOpen, setIsFullEditOpen] = useState(false);

  const fetchCohorts = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/cohorts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCohorts(res.data);
    } catch (err) {
      toast.error("Failed to load cohorts.",err);
    }
  };

const createCohort = async (e) => {
  e.preventDefault();

  if (new Date(form.applicationEnd) < new Date(form.applicationStart)) {
    toast.error("Application end must be after start date.");
    return;
  }
  if (form.maxInterns<=0){
    toast.error("Maximum interns must atleast be 1");
    return;
  }
  

  if (new Date(form.cohortEnd) <= new Date(form.cohortStart)) {
    toast.error("Cohort end must be after start date.");
    return;
  }

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
    toast.error("Failed to create cohort.",err);
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
      toast.error("Delete failed.",err);
    }
  };

  const openEditModal = (cohort) => {
    setSelectedCohort(cohort);
    setNewMaxInterns(cohort.maxInterns);
    setIsModalOpen(true);
  };

  const openFullEditModal = (cohort) => {
    setSelectedCohort(cohort);
    setEditForm({
      name: cohort.name,
      applicationEnd: cohort.applicationEnd.slice(0, 10),
      cohortStart: cohort.cohortStart.slice(0, 10),
      cohortEnd: cohort.cohortEnd.slice(0, 10),
      maxInterns: cohort.maxInterns,
    });
    setIsFullEditOpen(true);
  };

  const handleUpdateMaxInterns = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/cohorts/updatemax/${selectedCohort._id}`,
        { max: newMaxInterns },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Max interns updated.");
      setIsModalOpen(false);
      fetchCohorts();
    } catch (err) {
      toast.error("Update failed.",err);
    }
  };

  const handleUpdateCohortDetails = async () => {
    const { name, applicationEnd, cohortStart, cohortEnd, maxInterns } = editForm;

    if (new Date(applicationEnd) < new Date(selectedCohort.applicationStart)) {
      toast.error("Application end must be after start.");
      return;
    }
    if (new Date(cohortEnd) <= new Date(cohortStart)) {
      toast.error("Cohort end must be after start.");
      return;
    }
 if (maxInterns<=0){
    toast.error("Maximum interns must atleast be 1");
    return;
  }
  
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/cohorts/${selectedCohort._id}`,
        { name, applicationEnd, cohortStart, cohortEnd, maxInterns },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Cohort updated.");
      setIsFullEditOpen(false);
      fetchCohorts();
    } catch (err) {
      toast.error("Failed to update cohort.",err);
    }
  };

  useEffect(() => {
    fetchCohorts();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#121212] text-white">
      <Sidebar />

      <main className="flex-1 p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Manage Internship Cohorts</h1>

        {/* Create Cohort */}
        <form
          onSubmit={createCohort}
          className="bg-[#1e1e1e] p-6 rounded-md shadow-md mb-10"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Cohort
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Cohort Name", name: "name", type: "text" },
              { label: "Max Interns", name: "maxInterns", type: "number" },
              { label: "Application Start", name: "applicationStart", type: "date" },
              { label: "Application End", name: "applicationEnd", type: "date" },
              { label: "Cohort Start", name: "cohortStart", type: "date" },
              { label: "Cohort End", name: "cohortEnd", type: "date" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm mb-1 text-gray-300">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                  required
                  className="w-full p-2 rounded bg-[#2e2e2e] text-white"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#D25B24] hover:bg-orange-700 px-6 py-2 rounded font-semibold"
          >
            Create Cohort
          </button>
        </form>

        {/* Cohort List */}
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
            title="Update Max Interns"
          >
            <Users className="w-5 h-5" />
          </button>
          <button
            onClick={() => openFullEditModal(c)}
            className="text-yellow-400 hover:text-yellow-600"
            title="Edit Full Details"
          >
            ✎
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

        {/* Max Interns Modal */}
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

        {/* Full Edit Modal */}
        {isFullEditOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-[#1e1e1e] p-6 rounded w-full max-w-lg space-y-4">
              <h3 className="text-xl font-semibold">Edit Cohort Details</h3>
            {["name", "applicationEnd", "cohortStart", "cohortEnd", "maxInterns"].map(
  (field) => (
    <div key={field}>
      <label className="block mb-1 capitalize">
        {field.replace(/([A-Z])/g, " $1")}
      </label>
      <input
        type={
          field === "maxInterns"
            ? "number"
            : field === "name"
            ? "text"
            : "date"
        }
        value={editForm[field]}
        onChange={(e) =>
          setEditForm({ ...editForm, [field]: e.target.value })
        }
        className="w-full px-4 py-2 rounded bg-[#2a2a2a] text-white"
      />
    </div>
  )
)}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsFullEditOpen(false)}
                  className="px-4 py-2 bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCohortDetails}
                  className="px-4 py-2 bg-blue-600 rounded"
                >
                  Save
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
