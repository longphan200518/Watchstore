import { createContext, useContext, useEffect, useState } from "react";
import { getWebsiteSettings } from "../services/websiteSettingsService";

const WebsiteSettingsContext = createContext();

export const useWebsiteSettings = () => {
  const context = useContext(WebsiteSettingsContext);
  if (!context) {
    throw new Error(
      "useWebsiteSettings must be used within WebsiteSettingsProvider"
    );
  }
  return context;
};

export const WebsiteSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await getWebsiteSettings();
      if (response.success) {
        setSettings(response.data.settings || {});
      } else {
        setError("Failed to load website settings");
      }
    } catch (err) {
      console.error("Error loading website settings:", err);
      setError("Failed to load website settings");
    } finally {
      setLoading(false);
    }
  };

  const getSetting = (key, defaultValue = "") => {
    return settings[key] || defaultValue;
  };

  const getSettingBoolean = (key, defaultValue = false) => {
    const value = settings[key];
    if (value === "true" || value === true) return true;
    if (value === "false" || value === false) return false;
    return defaultValue;
  };

  const getSettingNumber = (key, defaultValue = 0) => {
    const value = settings[key];
    const number = parseInt(value);
    return isNaN(number) ? defaultValue : number;
  };

  const getSettingJSON = (key, defaultValue = null) => {
    try {
      const value = settings[key];
      return value ? JSON.parse(value) : defaultValue;
    } catch (err) {
      console.error(`Error parsing JSON setting ${key}:`, err);
      return defaultValue;
    }
  };

  const value = {
    settings,
    loading,
    error,
    getSetting,
    getSettingBoolean,
    getSettingNumber,
    getSettingJSON,
    refetch: fetchSettings,
  };

  return (
    <WebsiteSettingsContext.Provider value={value}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
};
