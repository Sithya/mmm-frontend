"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "../../../lib/api";
import { useAuth } from "../AuthProvider";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { refresh, signIn } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Basic client-side validation to avoid unnecessary server validation errors
    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }
   

    (async () => {
      const res = await apiClient.post<{ user: { is_admin: boolean }, token: string }>("/auth/login", {
        email,
        password,
      });

      // Log the full response for debugging 422 cases (developer only)
      // eslint-disable-next-line no-console
      console.debug("Login response:", res);

      if (res.errors) {
        // Backend may return validation errors in different shapes; normalize for display
        let msg = "Login failed";
        try {
          if (res.errors?.message) msg = String(res.errors.message);
          else {
            const vals = Object.values(res.errors).flat();
            msg = vals.join("\n");
          }
        } catch (e) {
          // fallback
          msg = "Login failed";
        }
        setError(msg || "Login failed");
        return;
      }

      const token = res.data?.token;
      const isAdmin = res.data?.user?.is_admin;
      if (!token) {
        setError("Login failed: missing token");
        return;
      }

      // Use signIn to set token and optionally set user directly (faster)
      try {
        await signIn(token, res.data?.user ?? null);
      } catch (e) {
        // fallback to setting token and refreshing
        apiClient.setAuthToken(token);
        try { await refresh(); } catch {}
      }

      // Redirect after login: return to home but keep token so admin state persists
      router.push("/");
    })();
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-400 to-indigo-500 animate-gradient-x"></div>

      {/* Overlay for subtle darkening */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-[#2A0845] mb-6">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-800 text-white py-3 rounded-lg text-lg font-semibold hover:bg-[#4b0d7e] transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          &copy; 2025 Your Company. All rights reserved.
        </p>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}</style>
    </div>
  );
}
