import StaffSidebar from "@/components/StaffSidebar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <StaffSidebar />
      <main className="flex-1 overflow-y-auto bg-slate-100">{children}</main>
    </div>
  );
}