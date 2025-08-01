import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Sidebar from "../../components/adminComponents/Sidebar";
import { Dialog } from "@headlessui/react";

function AcceptedInternsPage() {
  const { cohortId } = useParams();
  const [interns, setInterns] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [confirmName, setConfirmName] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAcceptedInterns = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/admin/cohort/${cohortId}/interns/accepted`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInterns(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        toast.error("Failed to fetch accepted interns",err);
        setInterns([]);
      }
    };

    fetchAcceptedInterns();
  }, [cohortId]);

  const getImageUrl = (path) => {
    if (!path) return "/default-avatar.png";
    return `http://localhost:5000/${path.replace(/\\/g, "/")}`;
  };

  const handleDelete = async () => {
    if (confirmName !== selectedIntern.name) {
      toast.error("Name does not match");
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/admin/interns/${selectedIntern._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(`${selectedIntern.name} has been deleted.`);
      setInterns((prev) => prev.filter((i) => i._id !== selectedIntern._id));
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to delete intern.",err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#272a2b] text-white">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-bold mb-6">Accepted Interns</h2>

        {interns.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-lg text-gray-400 italic">
              No accepted interns in this cohort yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {interns.map((intern) => (
              <div
                key={intern._id}
                className="flex items-center justify-between bg-[#1f2324] p-4 rounded-2xl shadow-md"
              >
                <div className="flex items-center">
                  <img
                    src={getImageUrl(intern.profilePicture)}
                    alt={intern.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border border-gray-500"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{intern.name}</h3>
                    <p className="text-sm text-gray-300">{intern.email}</p>
                    <p className="text-sm text-gray-300">CGPA: {intern.CGPA}</p>
                    <p className="text-sm text-green-400">Status: {intern.status}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedIntern(intern);
                    setShowModal(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-xl text-black">
            <Dialog.Title className="text-2xl font-bold text-red-700 mb-4">
              ⚠️ Confirm Deletion of Intern
            </Dialog.Title>
            <p className="text-gray-700 mb-4">
              You are about to delete <strong>{selectedIntern?.name}</strong>. This action will:
            </p>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
  <li><strong>Delete</strong> all their records and uploaded files</li>
  <li><strong>Remove</strong> their contributions to all projects</li>
  <li>⚠️ <strong>If they are a project leader</strong>, this may lead to the <strong>deletion of an entire project!</strong></li>
  <li><strong>Please consult with a supervisor before proceeding</strong></li>
</ul>


            <div className="mb-4">
              <label className="text-sm font-semibold text-gray-800 mb-1 block">
                Type <span className="text-red-600 font-bold">{selectedIntern?.name}</span> to confirm:
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                onClick={handleDelete}
              >
                Permanently Delete
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default AcceptedInternsPage;
