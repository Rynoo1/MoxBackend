import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from './useAuth';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import '../styles/dashboard.css';
import moxLoadingGif from '../assets/mox-loading.gif';

interface User {
  UserName: string;
  ProfilePicture: string;
  Email: string;
}

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, getAuthHeaders, logout, isLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [edit, setEdit] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [contrast, setContrast] = useState(false);
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'normal');
  const [language, setLanguage] = useState(i18n.language);

  const today = new Date();
  const formattedDate = today.toLocaleDateString(language);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'goodMorning';
    if (hour < 18) return 'goodAfternoon';
    return 'goodEvening';
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const handleProfilePicChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);

    try {
      if (user.ProfilePicture?.includes('firebase')) {
        const url = new URL(user.ProfilePicture);
        const match = url.pathname.match(/\/o\/(.+)$/);
        const encodedPath = match ? match[1] : '';
        const filePath = decodeURIComponent(encodedPath);
        const oldRef = ref(storage, filePath);
        await deleteObject(oldRef);
      }

      const storageRef = ref(storage, `profile-pics/${user.UserName}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      setUser(prev => prev ? { ...prev, ProfilePicture: downloadURL } : prev);

      await fetch('http://localhost:5183/api/user/updateProfilePic', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profilePicture: downloadURL }),
      });
    } catch (err) {
      console.warn('Error uploading profile picture', err);
    }

    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      await fetch('http://localhost:5183/api/user/profile', {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
      setEdit(false);
    } catch {
      alert('Failed to save profile');
    }
  };

  const handleCancel = () => {
    setUser(originalUser);
    setEdit(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('http://localhost:5183/api/user/profile', {
          method: 'GET',
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          logout();
          return;
        }

        const result = await res.json();
        const { data } = result;

        setUser(data);
        setOriginalUser(data);
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    };

    if (!isLoading && isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, isLoading]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
    const root = document.documentElement;
    switch (fontSize) {
      case 'large':
        root.style.fontSize = '18px';
        break;
      case 'xl':
        root.style.fontSize = '20px';
        break;
      default:
        root.style.fontSize = '16px';
        break;
    }
  }, [fontSize]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src={moxLoadingGif} alt="Loading..." className="w-96" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full pt-10">
      <div className="bg-white px-6 py-4 shadow-sm rounded-b-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold">{t('settings')}</h1>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
          <div className="text-lg text-gray-600 md:text-right w-full md:w-auto">
            {t(getGreeting())},{" "}
            <span className="font-semibold break-all">{user?.UserName || 'User'}</span>
          </div>
        </div>
      </div>

      <div className="px-6 py-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-light">{t('userProfile')}</h2>
          {!edit ? (
            <button className="btn btn-primary" onClick={() => setEdit(true)}>
              {t('editProfile')}
            </button>
          ) : (
            <div className="flex gap-2">
              <button className="btn btn-outline" onClick={handleCancel}>
                {t('cancel')}
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {t('save')}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-xl mb-2">{t('profilePicture')}</p>
            <div className="avatar">
              <div className="w-24 h-24 rounded-full">
                <img
                  src={
                    user?.ProfilePicture ||
                    'https://img.daisyui.com/images/profile/demo/yellingcat@192.webp'
                  }
                  alt="profile"
                />
              </div>
            </div>
            {edit && (
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                className="file-input mt-4"
              />
            )}
          </div>

          <div>
            <label className="label">{t('username')}</label>
            {edit ? (
              <input
                className="input input-bordered w-full"
                value={user?.UserName || ''}
                onChange={(e) =>
                  setUser((prev) => (prev ? { ...prev, UserName: e.target.value } : prev))
                }
              />
            ) : (
              <p className="text-lg break-all">{user?.UserName}</p>
            )}

            <label className="label mt-4">{t('email')}</label>
            {edit ? (
              <input
                className="input input-bordered w-full"
                value={user?.Email || ''}
                onChange={(e) =>
                  setUser((prev) => (prev ? { ...prev, Email: e.target.value } : prev))
                }
              />
            ) : (
              <p className="text-lg break-all">{user?.Email}</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6 mx-6">
        <h3 className="text-xl font-semibold mb-4">{t('preferences')}</h3>

        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <span className="label-text">{t('darkMode')}</span>
            <input
              type="checkbox"
              className="toggle"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="label-text">{t('fontSize')}</span>
            <select
              className="select select-bordered w-1/2"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              <option value="normal">{t('normal')}</option>
              <option value="large">{t('large')}</option>
              <option value="xl">{t('xl')}</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="label-text">{t('language')}</span>
            <select
              className="select select-bordered w-1/2"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="af">Afrikaans</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <span className="label-text">{t('highContrast')}</span>
            <input
              type="checkbox"
              className="toggle toggle-warning"
              checked={contrast}
              onChange={() => setContrast(!contrast)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
