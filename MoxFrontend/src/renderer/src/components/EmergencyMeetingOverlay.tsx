import React, { useState, useEffect } from "react";
import { fetchAllEmergencyMeetings } from "../services/api";

const Emergency: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [confirmCancelId, setConfirmCancelId] = useState<number | null>(null);

  const activeMeetings = meetings.filter((m) => {
    const now = new Date();
    const endTime = new Date(m.endTime);
    return !m.isResolved && endTime > now;
  });

  const [allUsers, setAllUsers] = useState<{ id: string; userName: string }[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("http://localhost:5183/api/User");
        const data = await res.json();
        setAllUsers(data.$values ?? data);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const allMeetings = await fetchAllEmergencyMeetings();
      setMeetings(allMeetings);
    } catch (err) {
      console.error("Failed to load meetings", err);
      setError("Failed to fetch emergency meetings.");
    }
  };

  const formatForDateTimeLocal = (dateStr: string) => {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16);
  };

  const handleEdit = (meeting: any) => {
    setEditingId(meeting.id);
    setEditForm({
      ...meeting,
      startTime: formatForDateTimeLocal(meeting.startTime),
      endTime: formatForDateTimeLocal(meeting.endTime),
      attendees: meeting.attendees?.$values || [],
      projectID: meeting.projectID ?? null,
    });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditForm((prev: any) => ({ ...prev, [name]: value }));
  };


  const handleUpdateMeeting = async (id: number) => {
    try {
      const payload = {
        ...editForm,
        startTime: new Date(editForm.startTime).toISOString(),
        endTime: new Date(editForm.endTime).toISOString(),
        attendees: editForm.attendees.map((a: any) => a.id),
        projectID: editForm.projectID || null,
        isResolved: false,
        createdByUserId: editForm.createdByUserId || "9c3e7c81-3141-43b4-9b04-88055026934e", // fallback if missing
      };

      const res = await fetch(`http://localhost:5183/api/EmergencyMeeting/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");

      setEditingId(null);
      await loadMeetings();
    } catch (err) {
      console.error("Failed to update meeting", err);
      setError("Failed to update meeting.");
    }
  };

  const handleCancelMeeting = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5183/api/EmergencyMeeting/${id}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error("Cancellation failed");

      setConfirmCancelId(null);
      await loadMeetings();
    } catch (err) {
      console.error("Failed to cancel meeting", err);
      setError("Failed to cancel meeting.");
    }
  };


  return (
    <>
      {showPopup && activeMeetings.length > 0 && (
        <div className="fixed inset-0 flex justify-center items-center z-50 px-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-red-300 shadow-xl p-8 space-y-6 my-10">
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
              <p className="text-sm text-gray-500">⛔ Active meeting(s) override all task activity</p>
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {activeMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="border-l-4 border-red-500 bg-red-50 rounded-lg shadow-sm p-4"
                >
                  {editingId === meeting.id ? (
                    <div className="space-y-2">
                      <input className="w-full border p-2 rounded" name="title" value={editForm.title} onChange={handleEditChange} />
                      <textarea className="w-full border p-2 rounded" name="description" value={editForm.description} onChange={handleEditChange} />
                      <input className="w-full border p-2 rounded" name="location" value={editForm.location} onChange={handleEditChange} />
                      <input type="datetime-local" className="w-full border p-2 rounded" name="startTime" value={editForm.startTime} onChange={handleEditChange} />
                      <input type="datetime-local" className="w-full border p-2 rounded" name="endTime" value={editForm.endTime} onChange={handleEditChange} />

                      <select className="w-full border p-2 rounded" name="projectID" value={editForm.projectID ?? ""} onChange={handleEditChange}>
                        <option value="">Select a project</option>
                        <option value="1">Mox Platform</option>
                      </select>
                      <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700">Attendees</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {(editForm.attendees || []).map((user: any) => (
                            <span
                              key={user.id}
                              className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {user.userName}
                              <button
                                type="button"
                                onClick={() =>
                                  setEditForm((prev: any) => ({
                                    ...prev,
                                    attendees: prev.attendees.filter((u: any) => u.id !== user.id),
                                  }))
                                }
                              >
                                ❌
                              </button>
                            </span>
                          ))}
                        </div>

                      <select
                        className="w-full border p-2 rounded"
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedUser = allUsers.find((u) => u.id === selectedId);

                          if (
                            selectedUser &&
                            !editForm.attendees.some((u: any) => u.id === selectedUser.id)
                          ) {
                            setEditForm((prev: any) => ({
                              ...prev,
                              attendees: [...prev.attendees, selectedUser],
                            }));
                          }

                          e.target.value = "";
                        }}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Add user...
                        </option>
                        {allUsers
                          .filter((u) => !editForm.attendees?.some((a: any) => a.id === u.id))
                          .map((user) => (
                            <option key={user.id} value={user.id}>
                              {user.userName}
                            </option>
                          ))}
                      </select>
                      </div>

                      <div className="flex gap-2">
                        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => handleUpdateMeeting(meeting.id)}>Save</button>
                        <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => setEditingId(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-bold text-lg mb-2">{meeting.title}</h3>
                      <p className="text-sm mb-2">{meeting.description}</p>
                      <p className="text-sm mb-1"><span className="font-semibold">📍 Location:</span> {meeting.location}</p>
                      <p className="text-sm mb-1"><span className="font-semibold">🕒 Time:</span> {new Date(meeting.startTime).toLocaleString()} – {new Date(meeting.endTime).toLocaleTimeString()}</p>
                      <p className="text-sm mb-1"><span className="font-semibold">👥 Attendees:</span> {meeting.attendees?.$values?.map((a: any) => a.userName).join(", ") || "None"}</p>
                      <p className="text-sm mb-1"><span className="font-semibold">👤 Created by:</span> {meeting.createdBy}</p>
                      <div className="flex gap-3 mt-2">
                        <button className="text-blue-500 hover:underline" onClick={() => handleEdit(meeting)}>Edit</button>
                        <button className="text-red-500 hover:underline" onClick={() => setConfirmCancelId(meeting.id)}>Cancel</button>
                      </div>
                      {confirmCancelId === meeting.id && (
                        <div className="mt-2 bg-red-100 border border-red-400 rounded p-3 text-sm">
                          <p className="mb-2 font-medium text-red-800">Are you sure you want to cancel this meeting?</p>
                          <div className="flex gap-2">
                            <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleCancelMeeting(meeting.id)}>Yes, Cancel</button>
                            <button className="bg-gray-300 px-3 py-1 rounded" onClick={() => setConfirmCancelId(null)}>No, Go Back</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
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