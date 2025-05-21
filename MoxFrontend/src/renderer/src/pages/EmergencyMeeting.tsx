import React, { useState, useEffect } from "react";
import "../styles/EmergencyMeeting.css";
import { fetchAllEmergencyMeetings } from "../services/api";

const Emergency: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
  const loadMeetings = async () => {
    try {
      const allMeetings = await fetchAllEmergencyMeetings();
      setMeetings(allMeetings);
    } catch (err) {
      console.error("Failed to load meetings", err);
    }
  };

  loadMeetings();
}, []);


  return (
    <div className="emergency-create">
      <h1>All Emergency Meetings</h1>

      {error && <p className="text-red-500">{error}</p>}

      {meetings.length === 0 ? (
        <p>No emergency meetings found.</p>
      ) : (
        <div className="meeting-list">
          {Array.isArray(meetings) && meetings.length > 0 ? (
            meetings.map((meeting) => (
              <div key={meeting.id} className="card w-full bg-base-100 shadow-md mb-4">
              <div className="card-body">
                <h3 className="card-title">{meeting.title}</h3>
                <p>{meeting.description}</p>
              </div>
            </div>
            ))
          ) : (
            <p>No emergency meetings found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Emergency;