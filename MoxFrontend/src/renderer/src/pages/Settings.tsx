import React, { useEffect, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import "../styles/dashboard.css";

const Settings = () => {
  const [active, setActive] = useState("account");
  const [darkMode, setDarkMode] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [fontSize, setFontSize] = useState("normal");
  const [defaultView, setDefaultView] = useState("kanban");
  const [language, setLanguage] = useState("en");
  const [date, setDate] = useState<Date | undefined>();

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

  const username = "Tylor";

  return (
    <div className="w-full px-6 py-4">
      {/* Header Section */}
       <div className="bg-base-300 px-6 py-4 shadow-sm rounded-b-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Home</h1>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <input type="text" placeholder="Search projects..." className="input input-bordered input-sm w-40 md:w-56" />
            <select className="select select-bordered select-sm w-28 md:w-32">
              <option>All</option>
              <option>Ongoing</option>
              <option>Completed</option>
            </select>
            <div className="avatar placeholder">
              <div className="w-10 rounded-full bg-neutral-focus text-neutral-content">
                <span>T</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div className="text-center mt-6 mb-6">
        <h2 className="text-3xl font-light">{getGreeting()}, {username}</h2>
      </div>

      {/* Tabs */}
      <div role="tablist" className="tabs tabs-boxed mb-6">
        <a role="tab" className={`tab ${active === 'account' ? 'tab-active' : ''}`} onClick={() => setActive('account')}>Account</a>
        <a role="tab" className={`tab ${active === 'preferences' ? 'tab-active' : ''}`} onClick={() => setActive('preferences')}>Preferences</a>
        <a role="tab" className={`tab ${active === 'accessibility' ? 'tab-active' : ''}`} onClick={() => setActive('accessibility')}>Accessibility</a>
      </div>

      {/* Grid Section Like Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Tab */}
        {active === 'account' && (
          <div className="bg-white p-4 shadow rounded col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-xl font-semibold mb-4">Account Information</h3>
            <div className="grid gap-4">
              <input type="text" placeholder="Full Name" className="input input-bordered w-full" />
              <input type="email" placeholder="Email Address" className="input input-bordered w-full" />
              <input type="password" placeholder="New Password" className="input input-bordered w-full" />
              <select className="select select-bordered w-full" value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">English</option>
                <option value="af">Afrikaans</option>
                <option value="zu">Zulu</option>
              </select>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {active === 'preferences' && (
          <div className="bg-white p-4 shadow rounded col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-xl font-semibold mb-4">Preferences</h3>
            <label className="label cursor-pointer">
              <span className="label-text">Enable Dark Mode</span>
              <input type="checkbox" className="toggle" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">Default View</span>
              <select className="select select-bordered" value={defaultView} onChange={(e) => setDefaultView(e.target.value)}>
                <option value="kanban">Kanban</option>
                <option value="timeline">Timeline</option>
              </select>
            </label>
          </div>
        )}

        {/* Accessibility Tab */}
        {active === 'accessibility' && (
          <div className="bg-white p-4 shadow rounded col-span-1 md:col-span-2 lg:col-span-3">
            <h3 className="text-xl font-semibold mb-4">Accessibility</h3>
            <label className="label">
              <span className="label-text">Font Size</span>
              <select className="select select-bordered" value={fontSize} onChange={(e) => setFontSize(e.target.value)}>
                <option value="normal">Normal</option>
                <option value="large">Large</option>
                <option value="xl">Extra Large</option>
              </select>
            </label>
            <label className="label cursor-pointer">
              <span className="label-text">High Contrast Mode</span>
              <input type="checkbox" className="toggle toggle-warning" checked={contrast} onChange={() => setContrast(!contrast)} />
            </label>
          </div>
        )}

        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-right">
          <button className="btn btn-primary mt-4">Save Settings</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
