import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [language, setLanguage] = useState("en");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("username") || "User";
    setUsername(storedName);
    setFullName(storedName);
    document.body.classList.toggle("dark-mode", darkMode);
  }, [darkMode]);

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const handleSave = () => {
    localStorage.setItem("username", fullName);
    alert("Settings saved successfully.");
  };

  return (
    <div className="min-h-screen w-full pt-10">
      {/* Header */}
      <div className="bg-white px-6 py-4 shadow-sm rounded-b-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Settings</h1>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
          <Link to="/profile">
            <div className="avatar placeholder cursor-pointer">
              <div className="w-10 rounded-full bg-neutral-focus text-white">
                <span className="text-lg">👤</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Greeting */}
      <div className="text-center mt-6 mb-6">
        <h2 className="text-3xl font-light">
          {getGreeting()},{" "}
          <Link to="/profile" className="text-blue-600 underline hover:text-blue-800">
            {username}
          </Link>
        </h2>
      </div>

      {/* Settings Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
        <div className="bg-white p-6 shadow rounded col-span-1 md:col-span-2 lg:col-span-3">
          <h3 className="text-xl font-semibold mb-6">Account Settings</h3>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input input-bordered w-full"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
            />
            <input type="password" placeholder="New Password" className="input input-bordered w-full" />

            <div className="flex items-center gap-2">
              <span className="label-text w-40">Language</span>
              <select
                className="select select-bordered w-full"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English</option>
                <option value="af">Afrikaans</option>
                <option value="zu">Zulu</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="label-text">Dark Mode</span>
              <input
                type="checkbox"
                className="toggle"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="label-text">Font Size</span>
              <select
                className="select select-bordered w-1/2"
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
              >
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="label-text">High Contrast</span>
              <input
                type="checkbox"
                className="toggle toggle-warning"
                checked={contrast}
                onChange={() => setContrast(!contrast)}
              />
            </div>

            <div className="flex gap-4 mt-4">
              <Link to="/kanban" className="btn btn-outline btn-sm">
                Go to Kanban
              </Link>
              <Link to="/projects" className="btn btn-outline btn-sm">
                Go to Timeline
              </Link>
            </div>
          </div>

          <div className="text-right mt-8">
            <button className="btn btn-primary" onClick={handleSave}>
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
