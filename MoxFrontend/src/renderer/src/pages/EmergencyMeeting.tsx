import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Emergency from "../components/EmergencyMeetingOverlay";

const CreateEmergencyMeeting: React.FC = () => {
  const navigate = useNavigate();

  const [projectId, setProjectId] = useState<number | null>(null);
  const [projects, setProjects] = useState<{ projectID: number; projectName: string }[]>([]);
  const [attendees, setAttendees] = useState<{ id: string; userName: string }[]>([]);
  const [allUsers, setAllUsers] = useState<{ id: string; userName: string }[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    startTime: "",
    endTime: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [usersRes, projectsRes] = await Promise.all([
          fetch("http://localhost:5183/api/User"),
          fetch("http://localhost:5183/api/Project"),
        ]);

        if (!usersRes.ok || !projectsRes.ok) {
          throw new Error("Failed to fetch users or projects.");
        }

        const usersData = await usersRes.json();
        const projectsData = await projectsRes.json();

        const users = usersData.$values ?? usersData;
        const projects = projectsData.$values ?? projectsData;

        setAllUsers(Array.isArray(users) ? users : []);
        setProjects(Array.isArray(projects) ? projects : []);
      } catch (err) {
        console.error("Failed to load users or projects", err);
        setAllUsers([]);
        setProjects([]);
      }
    };

    fetchInitialData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

  const userId = localStorage.getItem("userId");

  const payload: any = {
    ...form,
    createdByUserId: userId,
    isResolved: false,
    attendees: attendees.map((a) => a.id),
    startTime: new Date(form.startTime).toISOString(),
    endTime: new Date(form.endTime).toISOString(),
  };

  if (projectId) {
    payload.projectID = projectId;
  }

  console.log("Payload being submitted:", payload);

    try {
      const response = await fetch("http://localhost:5183/api/EmergencyMeeting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create meeting");
      }

      setSuccess(true);
      setTimeout(() => navigate("/emergency-meeting"), 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto flex justify-center items-start p-4 pt-20">
      <div className="w-3xl bg-white rounded-3xl shadow-xl border border-gray-200 p-8 overflow-y-auto max-h-[90vh]">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🚨</div>
          <h1 className="text-2xl font-bold text-blue-400 uppercase">
            Emergency Meeting
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Fill in the details to notify your team
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm">
            Meeting created successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-5">
          <div className="flex flex-wrap gap-2">
            {attendees.map((user) => (
              <span
                key={user.id}
                className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {user.userName}
                <button
                  type="button"
                  onClick={() => setAttendees(attendees.filter((u) => u.id !== user.id))}
                >
                  ❌
                </button>
              </span>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Add Attendee</label>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300"
              onChange={(e) => {
                const user = allUsers.find((u) => u.id === e.target.value);
                if (user && !attendees.find((a) => a.id === user.id)) {
                  setAttendees([...attendees, user]);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>Select user to add</option>
              {allUsers
                .filter((u) => !attendees.some((a) => a.id === u.id))
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.userName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Meeting agenda or details..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={form.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={form.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/emergency-meeting")}
              className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-700 hover:scale-105 hover:shadow-md transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-blue-400 hover:text-white hover:scale-105 hover:shadow-md transition-all"
            >
              Create Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmergencyMeeting;
