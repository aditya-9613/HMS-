"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Cross, Mail, Lock, Eye, EyeOff, ShieldCheck, UserCog } from "lucide-react";

type Role = "admin" | "staff";

const roles: { key: Role; label: string; icon: typeof ShieldCheck }[] = [
  { key: "admin", label: "Admin Login", icon: ShieldCheck },
  { key: "staff", label: "Staff Login", icon: UserCog },
];

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    // TODO: call your login API here with { email, password, role }
    router.push(`/${role}/dashboard`);
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      {/* Left panel */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#0f2742] p-12 text-white lg:flex">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-sky-400/60 text-sky-400">
          <Cross size={26} strokeWidth={2.5} />
        </div>

        <div>
          <h1 className="text-4xl font-semibold uppercase tracking-wide">
            Hospital
            <br />
            Management System
          </h1>
          <p className="mt-4 max-w-md text-slate-300">
            Manage patients, staff, pharmacy, inventory, insurance and finance
            from one place.
          </p>
        </div>

        <p className="text-sm text-slate-400">
          &copy; 2026 Hospital Management System
        </p>
      </div>

      {/* Right panel */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">
          {/* Mobile logo */}
          <div className="mb-6 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f2742] text-sky-400">
              <Cross size={22} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold uppercase tracking-wide text-slate-700">
              Hospital Management System
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-slate-800">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to continue to your dashboard.
          </p>

          {/* Role tabs */}
          <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg bg-slate-100 p-1">
            {roles.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setRole(key);
                  setError("");
                }}
                className={`flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-colors ${role === key
                    ? "bg-[#2f6fb0] text-white shadow"
                    : "text-slate-600 hover:bg-white"
                  }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    role === "admin" ? "admin@hospital.com" : "staff@hospital.com"
                  }
                  className="w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-800 outline-none focus:border-[#2f6fb0] focus:ring-2 focus:ring-[#2f6fb0]/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-slate-300 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none focus:border-[#2f6fb0] focus:ring-2 focus:ring-[#2f6fb0]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              className="w-full rounded-md bg-[#2f6fb0] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#265c93]"
            >
              Sign in as {role === "admin" ? "Admin" : "Staff"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}