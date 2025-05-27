import { useState } from "react";
import InternDetailModal from "./InternDetailModal";
import defaultAvatar from "../../assets/default-avatar.png";

const statuses = {
  accepted: "text-green-600 bg-green-100",
  rejected: "text-red-600 bg-red-100",
  pending: "text-yellow-600 bg-yellow-100",
};

export default function PendingInternList({ interns = [], filter, setFilter, setInterns }) {
  const [selectedIntern, setSelectedIntern] = useState(null);

  const applyFilter = (list) => {
    if (!Array.isArray(list)) return [];
    let sorted = [...list];
    switch (filter) {
      case "cgpa":
        return sorted.sort((a, b) => parseFloat(b.CGPA || 0) - parseFloat(a.CGPA || 0));
      case "female":
        return sorted.filter((i) => i.gender === "female");
      case "male":
        return sorted.filter((i) => i.gender === "male");
      case "date":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted;
    }
  };

  const formatDate = (isoDate) => {
    const dt = new Date(isoDate);
    return isNaN(dt)
      ? "Unknown date"
      : dt.toLocaleString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  const updateStatus = (id, newStatus) => {
    setInterns((prev) =>
      prev.map((intern) => (intern._id === id ? { ...intern, status: newStatus } : intern))
    );
  };

  const filteredInterns = applyFilter(interns);

  return (
    <>
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">Pending Applications</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 rounded-md border border-gray text-gray-200 bg-[#1f2324]"
          >
            <option value="all">All</option>
            <option value="cgpa">Sort by CGPA</option>
            <option value="date">Sort by Application Date</option>
            <option value="female">Only Female</option>
            <option value="male">Only Male</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredInterns.length === 0 ? (
            <div className="text-center text-gray-400 border border-gray-700 bg-[#1f2324] rounded-lg p-8">
              <p className="text-lg font-medium">No pending applications to display.</p>
              <p className="text-sm mt-1">Check back later or adjust the filters above.</p>
            </div>
          ) : (
            filteredInterns.map((intern) =>
              intern && intern._id ? (
                <div
                  key={intern._id}
                  onClick={() => setSelectedIntern(intern)}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        intern.profilePicture
                          ? `http://localhost:5000/${intern.profilePicture.replace(/\\/g, "/")}`
                          : defaultAvatar
                      }
                      alt={intern.name || "Intern"}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultAvatar;
                      }}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{intern.name || "Unnamed Intern"}</p>
                      <p className="text-sm text-gray-500">
                        Email: {intern.email || "No email"} · Applied: {formatDate(intern.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 font-medium">{intern.CGPA || "N/A"}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statuses[intern.status] || "text-gray-500 bg-gray-100"
                    }`}
                  >
                    {intern.status || "unknown"}
                  </span>
                </div>
              ) : null
            )
          )}
        </div>
      </section>

      {selectedIntern && (
        <InternDetailModal
          intern={selectedIntern}
          onClose={() => setSelectedIntern(null)}
          onStatusUpdate={updateStatus}
        />
      )}
    </>
  );
}
