import React, { useEffect, useState } from "react";
import { User, Mail, Lock, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import profileService from "../../services/profileService";

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profile, setProfile] = useState({
    username: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await profileService.getProfile();

      if (response.success) {
        setProfile({
          username: response.data.username,
          email: response.data.email,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswords((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      setSavingProfile(true);

      const response =
        await profileService.updateProfile(profile);

      if (response.success) {
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.error ||
          "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    if (
      passwords.newPassword !==
      passwords.confirmPassword
    ) {
      return toast.error("Passwords do not match");
    }

    try {
      setSavingPassword(true);

      const response =
        await profileService.changePassword({
          currentPassword:
            passwords.currentPassword,
          newPassword: passwords.newPassword,
        });

      if (response.success) {
        toast.success("Password changed successfully");

        setPasswords({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.error ||
          "Failed to change password"
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Profile Settings
        </h1>

        <p className="mt-2 text-slate-500 dark:text-slate-400">
          Manage your account information and password.
        </p>
      </div>

      {/* Profile */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
          User Information
        </h2>

        <form
          onSubmit={updateProfile}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Username
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                name="username"
                value={profile.username}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
              Email Address
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <button
            disabled={savingProfile}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {savingProfile
              ? "Updating..."
              : "Update Profile"}
          </button>
        </form>
      </div>

      {/* Password */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-semibold text-slate-900 dark:text-white">
          Change Password
        </h2>

        <form
          onSubmit={changePassword}
          className="space-y-6"
        >
          {[
            {
              name: "currentPassword",
              placeholder: "Current Password",
            },
            {
              name: "newPassword",
              placeholder: "New Password",
            },
            {
              name: "confirmPassword",
              placeholder: "Confirm New Password",
            },
          ].map((field) => (
            <div key={field.name} className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="password"
                name={field.name}
                placeholder={field.placeholder}
                value={passwords[field.name]}
                onChange={handlePasswordChange}
                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-11 pr-4 text-slate-900 focus:border-emerald-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          ))}

          <button
            disabled={savingPassword}
            className="rounded-xl bg-emerald-600 px-6 py-3 font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {savingPassword
              ? "Changing..."
              : "Change Password"}
          </button>
        </form>
      </div>

    </div>
  );
};

export default ProfilePage;