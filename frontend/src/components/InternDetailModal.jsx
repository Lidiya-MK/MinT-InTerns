import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { X } from "lucide-react";

export default function InternDetailModal({ intern, onClose, onStatusUpdate }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInternDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://localhost:5000/api/admin/interns/${intern._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDetails(res.data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to fetch intern details",error);
        setLoading(false);
      }
    };

    fetchInternDetails();
  }, [intern]);

  const handleAction = async (type) => {
    const confirmMsg = type === "accept" ? "Accept this intern?" : "Reject this intern?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:5000/api/admin/interns/${intern._id}/${type}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(`Intern ${type}ed successfully`);
      onStatusUpdate(intern._id, type);
      onClose();
    } catch (err) {
      toast.error(`Failed to ${type} intern`,err);
    }
  };

  if (!details || loading) return null;

  return (
    <div className="fixed inset-0 bg-grey-100 bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl relative overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-black">
          <X className="h-6 w-6" />
        </button>
        <div className="text-center">
          <img
            src={`http://localhost:5000/${details.profilePicture.replace(/\\/g, "/")}`}
            alt={details.name}
            className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
          />
          <h2 className="text-xl font-bold">{details.name}</h2>
          <p className="text-gray-600">{details.email}</p>
          <p className="text-gray-800 font-semibold mt-2">CGPA: {details.CGPA}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Uploaded Files</h3>
          {details.files?.length > 0 ? (
            <ul className="list-disc ml-6 text-blue-600">
              {details.files.map((file, idx) => (
                <li key={idx}>
                  <a
                    href={`http://localhost:5000/${file.replace(/\\/g, "/")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {file.split("/").pop()}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No files uploaded.</p>
          )}
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={() => handleAction("reject")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reject
          </button>
          <button
            onClick={() => handleAction("accept")}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
