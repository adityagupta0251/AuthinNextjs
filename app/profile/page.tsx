// app/profile/page.tsx
"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface User {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  isAdmin: boolean;
  __v: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const getUserDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/users/me");
      setUser(res.data.data);
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async () => {
    if (!user) return;
    const newName = prompt("New username:", user.username);
    if (!newName) return;
    try {
      const res = await axios.put("/api/users/me", { username: newName });
      setUser(res.data.data);
      toast.success("Username updated");
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const deleteUser = async () => {
    if (!confirm("Delete your account? This cannot be undone.")) return;
    try {
      await axios.delete("/api/users/me");
      toast.success("Account deleted");
      router.push("/signup");
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logged out");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6 p-4">
      <h1 className="text-3xl font-bold">My Profile</h1>

      {!user ? (
        <button
          onClick={getUserDetails}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          {loading ? "Loading…" : "Load My Details"}
        </button>
      ) : (
        <div className="bg-white shadow rounded-lg p-6 w-full max-w-md space-y-3">
          <p>
            <strong>ID:</strong> {user._id}
            <br />
            <p className="mt-2 text-sm text-gray-600">
              Checkout my profile at this link:{" "}
              <Link href={`/profile/${user._id}`}>{user._id}</Link>
            </p>
          </p>
          <p>
            <strong>Username:</strong>{" "}
            <Link
              href={`/profile/${user._id}`}
              className="text-blue-600 hover:underline"
            >
              {user.username}
            </Link>
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
          </p>
          <p>
            <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}
          </p>

          <div className="flex justify-between mt-4">
            <button
              onClick={updateUser}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Update Username
            </button>
            <button
              onClick={deleteUser}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete Account
            </button>
          </div>
        </div>
      )}

      <button
        onClick={logout}
        className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
