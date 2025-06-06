export const fetchAllEmergencyMeetings = async () => {
  const response = await fetch("http://localhost:5183/api/EmergencyMeeting");
  if (!response.ok) throw new Error("Failed to fetch meetings");

  const data = await response.json();
  return data.$values ?? [];
};

export const fetchAllTasks = async () => {
  const response = await fetch("http://localhost:5183/api/Task");
  if (!response.ok) throw new Error("Failed to fetch tasks");

  const data = await response.json();
  return data.$values ?? [];
};

export const fetchAllComments = async () => {
  const response = await fetch("http://localhost:5183/api/Comment");
  if (!response.ok) throw new Error("Failed to fetch comments");

  const data = await response.json();
  return data.$values ?? [];
};
