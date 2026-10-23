"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldCheck,
  Users,
  Pill,
  Package,
  Receipt,
  HeartPulse,
} from "lucide-react";
import logo from "@/Images/logo.png";


const FEATURES = [
  { icon: Users, label: "Patients & Staff" },
  { icon: Pill, label: "Pharmacy" },
  { icon: Package, label: "Inventory" },
  { icon: ShieldCheck, label: "Insurance" },
  { icon: Receipt, label: "Billing & Finance" },
  { icon: HeartPulse, label: "OPD / IPD" },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Invalid email or password.");
        return;
      }

      const data = result.data ?? result;
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("role", data.role);
      let renderRoute: any = ''

      if (data.role === 'Admin' || 'Super Admin' || 'Accountant') {
        renderRoute = '/admin/dashboard'
      } else if (data.role === 'Doctors') {
        renderRoute = '/staff/dashboard'
      }

      router.replace(renderRoute);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ───────── Left: brand panel ───────── */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-[#0b1f3a] via-[#0f2742] to-[#1d4f85] text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-blue-500/25 blur-3xl" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Logo */}
        <div className="relative z-10">
          <Image
            src={logo}
            alt="Hospital Management System"
            priority
            className="h-20 w-auto object-contain xl:h-28"
          />
        </div>

        {/* Headline + features */}
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium tracking-wide text-sky-100 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Secure staff portal
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
            Smarter care starts
            <br />
            with{" "}
            <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
              better systems.
            </span>
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-300">
            One place to manage patients, staff, pharmacy, inventory, insurance
            and finance.
          </p>

          <div className="mt-8 grid max-w-md grid-cols-2 gap-3">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-400/20 text-sky-300">
                  <Icon size={16} />
                </span>
                <span className="text-sm text-slate-100">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-slate-400">
          <p>&copy; 2026 Hospital Management System. All rights reserved.</p>
          <p className="mt-1">
            Developed by{" "}
            <span className="font-medium text-sky-300">Solucept</span>
          </p>
        </div>
      </div>

      {/* ───────── Right: login form ───────── */}
      <div className="relative flex w-full items-center justify-center overflow-hidden p-6 lg:w-1/2">
        {/* Soft background accents */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />

        <div className="relative w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-6 flex justify-center lg:hidden">
            <Image
              src={logo}
              alt="Hospital Management System"
              priority
              className="h-20 w-auto object-contain"
            />
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-300/40 backdrop-blur sm:p-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign in with your hospital account to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Email address / Employee ID
                </label>
                <div className="group relative">
                  <Mail
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#2f6fb0]"
                  />
                  <input
                    id="email"
                    type="text"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@hospital.com"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#2f6fb0] focus:bg-white focus:ring-4 focus:ring-[#2f6fb0]/15"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Password
                </label>
                <div className="group relative">
                  <Lock
                    size={18}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-[#2f6fb0]"
                  />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 py-3 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-[#2f6fb0] focus:bg-white focus:ring-4 focus:ring-[#2f6fb0]/15"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2f6fb0] to-[#1d4f85] py-3 text-sm font-semibold text-white shadow-lg shadow-[#2f6fb0]/30 transition hover:shadow-xl hover:shadow-[#2f6fb0]/40 focus:outline-none focus:ring-4 focus:ring-[#2f6fb0]/30 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={14} className="text-emerald-500" />
              Your session is protected and encrypted
            </div>
          </div>

          {/* Mobile footer */}
          <div className="mt-6 text-center text-xs text-slate-500 lg:hidden">
            <p>&copy; 2026 Hospital Management System</p>
            <p className="mt-1">
              Developed by{" "}
              <span className="font-medium text-[#2f6fb0]">Solucept</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}