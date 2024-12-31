import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import '../styles/AdminSettings.css';

function AdminSettings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30',
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
    },
  });

  const handleNotificationChange = (type) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type],
      },
    });
  };

  const handleSecurityChange = (type, value) => {
    setSettings({
      ...settings,
      security: {
        ...settings.security,
        [type]: value,
      },
    });
  };

  const handleAppearanceChange = (type, value) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [type]: value,
      },
    });
  };

  return (
    <div className="admin-app">
      <div className="dashboard">
        <Sidebar />
        <div className="main-content">
          <Header />
          <div className="settings-container">
            <h1>Settings</h1>

            <section className="settings-section">
              <h2>Notifications</h2>
              <div className="settings-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Email Notifications</h3>
                    <p>Receive email updates about your account activity</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={() => handleNotificationChange('email')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Push Notifications</h3>
                    <p>Receive push notifications about important updates</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={() => handleNotificationChange('push')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>SMS Notifications</h3>
                    <p>Receive text messages for critical alerts</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sms}
                      onChange={() => handleNotificationChange('sms')}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <h2>Security</h2>
              <div className="settings-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={settings.security.twoFactor}
                      onChange={() => handleSecurityChange('twoFactor', !settings.security.twoFactor)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Session Timeout</h3>
                    <p>Automatically log out after period of inactivity</p>
                  </div>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    className="select-input"
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="settings-section">
              <h2>Appearance</h2>
              <div className="settings-group">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Theme</h3>
                    <p>Choose your preferred color theme</p>
                  </div>
                  <select
                    value={settings.appearance.theme}
                    onChange={(e) => handleAppearanceChange('theme', e.target.value)}
                    className="select-input"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Font Size</h3>
                    <p>Adjust the text size for better readability</p>
                  </div>
                  <select
                    value={settings.appearance.fontSize}
                    onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
                    className="select-input"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                  </select>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettings; 