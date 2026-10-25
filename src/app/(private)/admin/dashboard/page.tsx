import Image from "next/image";
import Link from "next/link";
import {
  Users,
  UserPlus,
  BedDouble,
  LogOut,
  Activity,
  Briefcase,
  Wallet,
  TrendingDown,
  Receipt,
  Clock,
  User,
  Bell,
  FileText,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

const adminName = "Admin User"; // replace with the logged-in admin's name
const avatarSrc = ""; // put the user's image path/URL here, e.g. "/images/admin.png"

/* ---------- Dummy data ---------- */

const stats: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Total Patients", value: "1,452", icon: Users },
  { label: "New Today", value: "34", icon: UserPlus },
  { label: "Admitted", value: "68", icon: BedDouble },
  { label: "Discharged", value: "234", icon: LogOut },
  { label: "Outpatients", value: "1,204", icon: Activity },
  { label: "Total Attendants", value: "68", icon: Briefcase },
];

const labTests = [
  { name: "Blood Work", value: 92 },
  { name: "Imaging", value: 64 },
  { name: "Urinalysis", value: 55 },
  { name: "Diagnostics", value: 34 },
  { name: "Others", value: 18 },
];

const stockTimes = ["12:26", "12:38", "12:14", "12:15", "12:30"];
const medicines = [70, 105, 80, 118, 98];
const equipment = [45, 72, 55, 85, 70];

const claims = [
  { label: "Paid", value: 30, color: "#2f6fb0" },
  { label: "Pending", value: 55, color: "#8ec5e8" },
  { label: "Denied", value: 15, color: "#e06666" },
];

const staff = [
  { label: "Doctors", value: 134 },
  { label: "Nurses", value: 17 },
  { label: "Cleaning Staff", value: 234 },
];

const shifts = [
  { day: "Mon", time: "3 am", sub: "0 AM" },
  { day: "Tue", time: "3 pm", sub: "8 PM", active: true },
  { day: "Wed", time: "3 am", sub: "0 AM" },
  { day: "Thu", time: "3 am", sub: "6 AM" },
  { day: "Fri", time: "3 am", sub: "6 AM" },
  { day: "Sat", time: "7 pm", sub: "3 PM" },
];

const appointments = [
  { name: "Aarav Sharma", note: "General Checkup", time: "10:00 AM", status: "Paid" },
  { name: "Meera Iyer", note: "Cardiology", time: "10:00 AM", status: "Pending" },
  { name: "Dr. Rohan Verma", note: "Follow-up", time: "10:00 AM", status: "Pending" },
  { name: "Sara Khan", note: "Dermatology", time: "10:00 AM", status: "Pending" },
];

const finance: { label: string; value: string; icon: LucideIcon; tone: string }[] = [
  { label: "Revenue", value: "$1,835.00", icon: Wallet, tone: "bg-blue-100 text-blue-600" },
  { label: "Expenses", value: "$375.30", icon: TrendingDown, tone: "bg-red-100 text-red-500" },
  { label: "Pending Bills", value: "0", icon: Receipt, tone: "bg-orange-100 text-orange-500" },
];

/* ---------- Helpers ---------- */

const card = "rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60";
const cardTitle = "text-[15px] font-semibold text-slate-900";

function Select({ options }: { options: string[] }) {
  return (
    <div className="relative">
      <select className="appearance-none rounded-md border border-slate-200 bg-white py-1 pl-3 pr-7 text-xs text-slate-700 outline-none">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

function smoothPath(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

/* ---------- Page ---------- */

export default function AdminDashboardPage() {
  // Lab chart
  const labTicks = [100, 75, 50, 25, 0];

  // Inventory chart
  const PL = 30;
  const W = 400;
  const H = 140;
  const TOP = 8;
  const MAX = 125;
  const px = (i: number) => PL + (i * W) / (stockTimes.length - 1);
  const py = (v: number) => TOP + H - (v / MAX) * H;
  const medPts: [number, number][] = medicines.map((v, i) => [px(i), py(v)]);
  const eqPts: [number, number][] = equipment.map((v, i) => [px(i), py(v)]);
  const baseY = TOP + H;
  const medLine = smoothPath(medPts);
  const eqLine = smoothPath(eqPts);

  // Pie (white gaps between slices)
  const GAP = 0.8;
  let acc = 0;
  const pieGradient = claims
    .map((c) => {
      const start = acc;
      acc += c.value;
      return `#fff ${start}% ${start + GAP / 2}%, ${c.color} ${start + GAP / 2}% ${acc - GAP / 2}%, #fff ${acc - GAP / 2}% ${acc}%`;
    })
    .join(", ");

  return (
    <div className="flex min-h-full flex-col bg-[#e9eff7] text-slate-900">
      {/* Top navbar */}
      <header className="flex items-center justify-between bg-[#2f6fb0] px-6 py-3.5">
        <h1 className="text-lg font-semibold uppercase tracking-wide text-white">
          Hospital Management System
        </h1>
        <div className="flex items-center gap-5 text-white">
         <h4>Hello Admin Name</h4>
          <span className="flex items-center gap-1.5">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-white/20">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt={adminName}
                  width={36}
                  height={36}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={18} />
              )}
            </span>
            <ChevronDown size={14} />
          </span>
        </div>
      </header>

      <div className="flex flex-col gap-5 p-5">
        {/* Patient Admissions */}
        <section className={card}>
          <div className="mb-4 flex items-center justify-between">
            <h3 className={cardTitle}>Patient Admissions</h3>
            <Select options={["All current stats", "Today", "This week"]} />
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="flex items-center justify-between rounded-lg bg-[#e6effa] px-4 py-3"
                >
                  <div>
                    <p className="text-xs text-slate-600">{s.label}</p>
                    <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
                  </div>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#cfe0f5] text-[#2f6fb0]">
                    <Icon size={16} />
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1.4fr_1fr]">
          {/* Lab tests */}
          <div className={card}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className={cardTitle}>Top 5 Lab Test Categories</h3>
              <Select options={["Interactive", "Weekly", "Monthly"]} />
            </div>
            <div className="flex gap-2">
              <div className="flex h-44 flex-col justify-between text-[10px] text-slate-400">
                {labTicks.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="flex-1">
                <div className="relative h-44 border-b border-slate-200">
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {labTicks.slice(0, -1).map((t) => (
                      <div key={t} className="border-t border-slate-100" />
                    ))}
                  </div>
                  <div className="relative flex h-full items-end gap-6 px-4">
                    {labTests.map((l) => (
                      <div key={l.name} className="flex h-full flex-1 items-end justify-center">
                        <div
                          className="w-3/5 rounded-t-sm bg-[#2f6fb0]"
                          style={{ height: `${l.value}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-2 flex gap-6 px-4">
                  {labTests.map((l) => (
                    <span key={l.name} className="flex-1 text-center text-[10px] text-slate-500">
                      {l.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className={card}>
            <h3 className={`${cardTitle} mb-2`}>Inventory Stock Levels</h3>
            <div className="mb-2 flex gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 bg-[#2f6fb0]" /> Medicines
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 bg-[#8ec5e8]" /> Equipment
              </span>
            </div>
            <svg viewBox="0 0 440 185" className="block h-auto w-full">
              {[0, 25, 50, 75, 100, 125].map((t) => (
                <g key={t}>
                  <line x1={PL} x2={PL + W} y1={py(t)} y2={py(t)} stroke="#e8edf3" />
                  <text x={0} y={py(t) + 3} fontSize={9} fill="#94a3b8">
                    {t}
                  </text>
                </g>
              ))}
              <path
                d={`${eqLine} L${PL + W},${baseY} L${PL},${baseY} Z`}
                fill="#8ec5e8"
                fillOpacity={0.75}
              />
              <path d={eqLine} fill="none" stroke="#8ec5e8" strokeWidth={1.5} />
              <path
                d={`${medLine} L${PL + W},${baseY} L${PL},${baseY} Z`}
                fill="#2f6fb0"
                fillOpacity={0.55}
              />
              <path d={medLine} fill="none" stroke="#2f6fb0" strokeWidth={1.5} />
              {stockTimes.map((t, i) => (
                <text
                  key={i}
                  x={px(i)}
                  y={TOP + H + 20}
                  fontSize={9.5}
                  fill="#64748b"
                  textAnchor={i === 0 ? "start" : i === stockTimes.length - 1 ? "end" : "middle"}
                >
                  {t}
                </text>
              ))}
            </svg>
          </div>

          {/* Insurance pie */}
          <div className={card}>
            <h3 className={`${cardTitle} mb-4`}>Insurance Claims Status</h3>
            <div className="flex justify-center py-2">
              <div
                className="h-36 w-36 rounded-full"
                style={{ background: `conic-gradient(${pieGradient})` }}
              />
            </div>
            <div className="mt-5 flex justify-center gap-4 text-xs text-slate-600">
              {claims.map((c) => (
                <span key={c.label} className="flex items-center gap-1.5">
                  <i className="h-2.5 w-2.5 rounded-[2px]" style={{ background: c.color }} />{" "}
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom row */}
        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1.5fr_1fr]">
          {/* Staff availability */}
          <div className={card}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className={cardTitle}>Staff Availability</h3>
              <span className="rounded-md bg-green-600 px-2.5 py-1 text-[11px] font-medium text-white">
                Live Count
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {staff.map((s) => (
                <div key={s.label} className="rounded-lg bg-[#e6effa] px-3 py-3">
                  <p className="text-xs text-slate-600">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="mb-3 mt-6 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900">Shift View</h4>
              <Link
                href="/admin/duties"
                className="text-xs font-medium text-[#2f6fb0] hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {shifts.map((s) => (
                <div
                  key={s.day}
                  className={`rounded-md px-1 py-2 text-center text-[11px] ${s.active
                      ? "bg-[#dbe9fa] text-slate-900 ring-1 ring-[#2f6fb0]"
                      : "bg-slate-100 text-slate-600"
                    }`}
                >
                  <p className="font-semibold">{s.day}</p>
                  <p className="mt-1">{s.time}</p>
                  <p className="text-slate-500">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Appointments */}
          <div className={card}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className={cardTitle}>Upcoming Appointments</h3>
              <Select options={["All Status", "Paid", "Pending"]} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                    <th className="pb-2 font-semibold">Name</th>
                    <th className="pb-2 font-semibold">Time</th>
                    <th className="pb-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appointments.map((a) => (
                    <tr key={a.name}>
                      <td className="py-3 pr-3">
                        <div className="flex items-center gap-3">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                            {a.name.replace("Dr. ", "").charAt(0)}
                          </span>
                          <div>
                            <p className="font-semibold text-slate-900">{a.name}</p>
                            <p className="text-[11px] text-slate-400">{a.note}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-3 text-slate-600">
                        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                          <Clock size={13} className="text-slate-400" /> {a.time}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-md px-3 py-1 text-[11px] font-medium ${a.status === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                            }`}
                        >
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial overview */}
          <div className={card}>
            <h3 className={`${cardTitle} mb-5`}>Financial Overview</h3>
            <div className="flex flex-col gap-6">
              {finance.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.label} className="flex items-center gap-4">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${f.tone}`}
                    >
                      <Icon size={18} />
                    </span>
                    <div>
                      <p className="text-xs text-slate-500">{f.label}</p>
                      <p className="text-lg font-bold text-slate-900">{f.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}