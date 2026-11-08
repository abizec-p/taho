
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("demo@tastehome.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      email === "demo@tastehome.com" &&
      password === "123456"
    ) {
      router.push("/");
    } else {
      setError("Invalid demo credentials.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <div className="mb-7 text-center">
          <h1 className="text-3xl font-bold text-green-900">
            TasteHome
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Welcome back! Login to your dashboard.
          </p>
        </div>

        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <p className="mb-2 text-sm font-bold text-green-900">
            Demo Login Credentials
          </p>
          <p className="text-sm text-gray-700">
            Email: demo@tastehome.com
          </p>
          <p className="text-sm text-gray-700">
            Password: 123456
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-green-900 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Login to Dashboard
          </button>
        </form>

      </div>
    </main>
  );
}
