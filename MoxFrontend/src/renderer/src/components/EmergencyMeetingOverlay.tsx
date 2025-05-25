import React, { useState, useEffect } from "react";
import { fetchAllEmergencyMeetings } from "../services/api";

const Emergency: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(true);

  const activeMeetings = meetings.filter((m) => {
    const now = new Date();
    const endTime = new Date(m.endTime);
    return !m.isResolved && endTime > now;
  });

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const allMeetings = await fetchAllEmergencyMeetings();
        setMeetings(allMeetings);
      } catch (err) {
        console.error("Failed to load meetings", err);
        setError("Failed to fetch emergency meetings.");
      }
    };

    loadMeetings();
  }, []);

    return (
    <>
        {showPopup && activeMeetings.length > 0 && (
        <div className="fixed inset-0 flex justify-center items-center z-50 px-4">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-red-300 shadow-xl p-8 space-y-6">
            <button
                onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-700 text-xl transition">
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

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                {error}
                </div>
            )}

            <div className="space-y-4">
                {activeMeetings.map((meeting) => (
                <div
                    key={meeting.id}
                    className="border-l-4 border-red-500 bg-red-50 rounded-lg shadow-sm p-4">
                    <h3 className="font-bold text-lg mb-2">{meeting.title}</h3>

                    <p className="text-sm mb-2">
                    {meeting.description}
                    </p>

                    <p className="text-sm mb-1">
                    <span className="font-semibold">📍 Location:</span>{" "}
                    {meeting.location}
                    </p>

                    <p className="text-sm mb-1">
                    <span className="font-semibold">🕒 Time:</span>{" "}
                    {new Date(meeting.startTime).toLocaleString()} –{" "}
                    {new Date(meeting.endTime).toLocaleTimeString()}
                    </p>

                  {meeting.attendees?.$values?.length > 0 ? (
                    <p className="text-sm mb-1">
                      <span className="font-semibold">👥 Attendees:</span>{" "}
                      {meeting.attendees.$values.map((a: any, idx: number) => (
                        <span key={a.id}>
                          {a.userName}
                          {idx < meeting.attendees.$values.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <p className="text-sm mb-1 text-gray-400">
                      <span className="font-semibold">👥 Attendees:</span> None
                    </p>
                  )}

                    <p className="text-sm mb-1">
                    <span className="font-semibold">👤 Created by:</span>{" "}
                    {meeting.createdBy}
                    </p>
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
            className="group cursor-pointer flex items-center bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg transition-all duration-300 overflow-hidden">
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