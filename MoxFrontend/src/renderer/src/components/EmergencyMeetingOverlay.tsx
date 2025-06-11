import React, { useState, useEffect } from "react";
import { fetchAllEmergencyMeetings } from "../services/api";

const Emergency: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [editingMeeting, setEditingMeeting] = useState<any | null>(null);
  const [cancelWarning, setCancelWarning] = useState<number | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  const userId = localStorage.getItem("userId");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const activeMeetings = meetings.filter((m) => {
    const now = new Date();
    const endTime = new Date(m.endTime);
    const attendees = m.attendees?.$values ?? m.attendees ?? [];
    const isUserIncluded = attendees.some((a: any) => a.id === userId);
    return !m.isResolved && endTime > now && isUserIncluded;
  });

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const [allMeetingsRes, usersRes] = await Promise.all([
          fetchAllEmergencyMeetings(),
          fetch("http://localhost:5183/api/User")
        ]);

        const usersRaw = await usersRes.json();
        const users = usersRaw?.$values ?? usersRaw;
        setMeetings(allMeetingsRes);
        setAllUsers(Array.isArray(users) ? users : []);
      } catch (err) {
        console.error("Failed to load data", err);
        setError("Failed to fetch emergency meetings.");
      }
    };
    loadMeetings();
  }, []);

  const handleEdit = (meeting: any) => {
    setEditingMeeting({
      ...meeting,
      attendees: meeting.attendees?.$values ?? meeting.attendees ?? [],
    });
  };

  const handleCancelEdit = () => {
    setEditingMeeting(null);
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:5183/api/EmergencyMeeting/${editingMeeting.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingMeeting,
          attendees: editingMeeting.attendees?.map((a: any) => a.id) ?? [],
          projectID: null
        }),
      });

      if (!res.ok) throw new Error("Failed to save meeting.");

      const updated = await res.json();
      setMeetings((prev) => prev.map((m) => (m.id === updated.id ? { ...updated } : m)));
      setEditingMeeting(null);
      setSuccessMessage("Meeting updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update meeting.");
    }
  };

  const handleCancel = async (id: number) => {
    if (cancelWarning !== id) {
      setCancelWarning(id);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5183/api/EmergencyMeeting/${id}/cancel`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error("Failed to cancel meeting.");
      setMeetings((prev) => prev.filter((m) => m.id !== id));
      setSuccessMessage("Meeting cancelled.");
    } catch (err) {
      console.error("Cancel error:", err);
      setError("Could not cancel meeting.");
    }
  };

  return (
    <>
      {showPopup && activeMeetings.length > 0 && (
        <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
          <div className="relative w-full max-w-2xl bg-[#FFFFFF] rounded-3xl border border-red-300 shadow-xl p-8 space-y-6">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl transition"
            >
              ✖
            </button>

            <div className="text-center">
              <div className="text-5xl mb-2">⚠️</div>
              <h1 className="text-2xl font-extrabold text-red-700 uppercase mb-1">
                Emergency Meeting
              </h1>
              <p className="text-sm text-gray-500">
                🚫 Active meeting(s) override all task activity
              </p>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">{error}</div>}
            {successMessage && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              {activeMeetings.map((meeting) => {
                const canEdit = meeting.createdByUserId === userId || isAdmin;

                return (
                  <div
                    key={meeting.id}
                    className="border-l-4 border-red-500 bg-red-50 rounded-lg shadow-sm p-4"
                  >
                    {editingMeeting?.id === meeting.id ? (
                      <>
                        <input
                          className="w-full mb-2 px-3 py-1 border border-gray-300 rounded"
                          value={editingMeeting.title}
                          onChange={(e) => setEditingMeeting({ ...editingMeeting, title: e.target.value })}
                        />
                        <textarea
                          className="w-full mb-2 px-3 py-1 border border-gray-300 rounded"
                          value={editingMeeting.description}
                          onChange={(e) => setEditingMeeting({ ...editingMeeting, description: e.target.value })}
                        />
                        <input
                          type="datetime-local"
                          className="w-full mb-2 px-3 py-1 border border-gray-300 rounded"
                          value={editingMeeting.startTime.slice(0, 16)}
                          onChange={(e) => setEditingMeeting({ ...editingMeeting, startTime: e.target.value })}
                        />
                        <input
                          type="datetime-local"
                          className="w-full mb-2 px-3 py-1 border border-gray-300 rounded"
                          value={editingMeeting.endTime.slice(0, 16)}
                          onChange={(e) => setEditingMeeting({ ...editingMeeting, endTime: e.target.value })}
                        />
                        <input
                          className="w-full mb-2 px-3 py-1 border border-gray-300 rounded"
                          value={editingMeeting.location}
                          onChange={(e) => setEditingMeeting({ ...editingMeeting, location: e.target.value })}
                        />

                        {/* Pills for current attendees */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editingMeeting.attendees.map((user: any) => (
                            <span
                              key={user.id}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {user.userName}
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingMeeting({
                                    ...editingMeeting,
                                    attendees: editingMeeting.attendees.filter((u: any) => u.id !== user.id),
                                  })
                                }
                              >
                                ❌
                              </button>
                            </span>
                          ))}
                        </div>

                        {/* Dropdown to add attendees */}
                        <select
                          className="w-full mb-2 px-3 py-1 border border-gray-300 rounded"
                          onChange={(e) => {
                            const user = allUsers.find((u: any) => u.id === e.target.value);
                            if (user && !editingMeeting.attendees.some((a: any) => a.id === user.id)) {
                              setEditingMeeting({
                                ...editingMeeting,
                                attendees: [...editingMeeting.attendees, user],
                              });
                            }
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>Select user to add</option>
                          {allUsers
                            .filter((u: any) => !editingMeeting.attendees.some((a: any) => a.id === u.id))
                            .map((user: any) => (
                              <option key={user.id} value={user.id}>
                                {user.userName}
                              </option>
                            ))}
                        </select>

                        <div className="flex gap-2">
                          <button onClick={handleSaveEdit} className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                            📂 Save
                          </button>
                          <button onClick={handleCancelEdit} className="bg-gray-300 text-gray-800 px-4 py-1 rounded hover:bg-gray-400">
                            ❌ Cancel Edit
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="font-bold text-lg mb-2">{meeting.title}</h3>
                        <p className="text-sm mb-2">{meeting.description}</p>
                        <p className="text-sm mb-1">
                          <span className="font-semibold">📍 Location:</span> {meeting.location}
                        </p>
                        <p className="text-sm mb-1">
                          <span className="font-semibold">🕒 Time:</span> {new Date(meeting.startTime).toLocaleString()} – {new Date(meeting.endTime).toLocaleTimeString()}
                        </p>
                        <p className="text-sm mb-1">
                          <span className="font-semibold">👥 Attendees:</span>{" "}
                          {meeting.attendees?.$values?.map((a: any, idx: number) => (
                            <span key={a.id}>
                              {a.userName}
                              {idx < meeting.attendees.$values.length - 1 ? ", " : ""}
                            </span>
                          )) || "None"}
                        </p>
                        <p className="text-sm mb-1">
                          <span className="font-semibold">👤 Created by:</span> {meeting.createdBy}
                        </p>
                        {canEdit && (
                          <div className="flex flex-col gap-2 mt-3">
                            <div className="flex gap-2">
                              <button onClick={() => handleEdit(meeting)} className="px-4 py-1.5 rounded-lg bg-blue-100 text-blue-800 text-sm font-medium hover:bg-blue-200 transition">
                                ✏️ Edit
                              </button>
                              <button onClick={() => handleCancel(meeting.id)} className="px-4 py-1.5 rounded-lg bg-red-100 text-red-800 text-sm font-medium hover:bg-red-200 transition">
                                ❌ Cancel
                              </button>
                            </div>
                            {cancelWarning === meeting.id && (
                              <div className="text-sm text-red-600">
                                Are you sure? This will resolve the meeting and hide it from the board. Click cancel again to confirm.
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {!showPopup && activeMeetings.length > 0 && (
        <div className="fixed top-5 right-5 z-40">
          <div
            onClick={() => setShowPopup(true)}
            className="group cursor-pointer flex items-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="p-3 flex items-center justify-center text-lg">⚠️</div>
            <div className="whitespace-nowrap overflow-hidden w-0 group-hover:w-40 transition-all duration-300 text-sm font-semibold">
              Emergency Meeting
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Emergency;