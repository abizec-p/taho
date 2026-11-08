
"use client";

import { useState } from "react";
import Nav from "../components/Nav";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-500">
            Manage your account and preferences.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_1fr]">

          {/* Sidebar */}
          <aside className="h-fit rounded-xl border border-gray-200 bg-white p-4">
            <nav className="space-y-2">
              <a href="#account" className="block rounded-lg bg-green-50 px-4 py-3 font-medium text-green-900">
                Account
              </a>
              <a href="#notifications" className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50">
                Notifications
              </a>
              <a href="#privacy" className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50">
                Privacy
              </a>
              <a href="#preferences" className="block rounded-lg px-4 py-3 text-gray-600 hover:bg-gray-50">
                Preferences
              </a>
            </nav>
          </aside>

          {/* Settings Content */}
          <div className="space-y-6">

            {/* Account */}
            <section id="account" className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-bold text-gray-900">
                Account Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Full Name</label>
                  <input
                    defaultValue="Demo User"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-700"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    defaultValue="demo@tastehome.com"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-700"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (000) 000-0000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-700"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">Location</label>
                  <input
                    defaultValue="Mississauga, Ontario"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-green-700"
                  />
                </div>
              </div>

              <button className="mt-5 rounded-lg bg-green-900 px-5 py-2 text-sm font-semibold text-white hover:bg-green-800">
                Save Changes
              </button>
            </section>

            {/* Notifications */}
            <section id="notifications" className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-bold">Notifications</h2>

              <div className="space-y-5">
                <SettingToggle
                  title="Push Notifications"
                  description="Receive notifications about orders and messages."
                  enabled={notifications}
                  onChange={setNotifications}
                />

                <SettingToggle
                  title="Email Updates"
                  description="Receive updates and announcements by email."
                  enabled={emailUpdates}
                  onChange={setEmailUpdates}
                />
              </div>
            </section>

            {/* Privacy */}
            <section id="privacy" className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-bold">Privacy</h2>

              <SettingToggle
                title="Public Profile"
                description="Allow other users to view your profile."
                enabled={publicProfile}
                onChange={setPublicProfile}
              />
            </section>

            {/* Preferences */}
            <section id="preferences" className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="mb-5 text-lg font-bold">Preferences</h2>

              <label className="mb-2 block text-sm font-medium">
                Preferred Language
              </label>

              <select className="w-full rounded-lg border border-gray-300 px-3 py-2 sm:w-64">
                <option>English</option>
                <option>Nepali</option>
                <option>French</option>
              </select>
            </section>

            {/* Danger Zone */}
            <section className="rounded-xl border border-red-200 bg-white p-6">
              <h2 className="mb-2 font-bold text-red-700">Danger Zone</h2>
              <p className="mb-4 text-sm text-gray-500">
                Permanently delete your account and associated information.
              </p>

              <button
                onClick={() => alert("Demo: Account deletion is disabled.")}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Delete Account
              </button>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}

function SettingToggle({
  title,
  description,
  enabled,
  onChange,
}: {
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => onChange(!enabled)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-green-700" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
