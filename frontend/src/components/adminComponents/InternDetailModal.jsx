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
  className="w-32 h-32 rounded-full mx-auto object-cover mb-4
             border-4 border-[#144145] 
             shadow-[0_0_10px_3px_rgba(20,65,69,0.7)]
             transition-shadow duration-300
             hover:shadow-[0_0_20px_6px_rgba(20,65,69,0.9)]"
/>

          <h2 className="text-3xl text-[#144145] font-bold">{details.name}</h2>
          <p className="text-gray-600">{details.email}</p>
          <p className="text-gray-600">{details.university}</p>
          <p className="text-gray-800 font-semibold mt-2">CGPA: {details.CGPA}</p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold mb-2 text-black">📂 Uploaded Files</h3>
          {details.documents?.length > 0 ? (
  <ul className="ml-6 space-y-2">
    {details.documents.map((file, idx) => (
      <li key={idx}>
       <a
  href={`http://localhost:5000/${file.replace(/\\/g, "/")}`}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#144145] text-white font-semibold hover:bg-[#0f3035] transition-colors shadow-md"
>
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"
    ></path>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 2v6h6"
    ></path>
  </svg>
  Intern File {idx + 1}
</a>

      </li>
    ))}
  </ul>
) : (
  <p className="text-gray-500">No files uploaded.</p>
)}

        </div>

        <div className="flex justify-center gap-6 mt-6">
  <button
    onClick={() => handleAction("reject")}
    className="
      bg-red-100 text-red-700
      px-5 py-2.5
      rounded-lg
      font-semibold
      border border-red-300
      hover:bg-red-200
      transition
      duration-200
      ease-in-out
      focus:outline-none focus:ring-2 focus:ring-red-300
      active:bg-red-300
    "
  >
    Reject
  </button>
  <button
    onClick={() => handleAction("accept")}
    className="
      bg-green-100 text-green-700
      px-5 py-2.5
      rounded-lg
      font-semibold
      border border-green-300
      hover:bg-green-200
      transition
      duration-200
      ease-in-out
      focus:outline-none focus:ring-2 focus:ring-green-300
      active:bg-green-300
    "
  >
    Accept
  </button>
</div>

      </div>
    </div>
  );
}
