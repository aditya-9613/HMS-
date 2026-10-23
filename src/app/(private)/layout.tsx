import { Suspense } from "react";
import PrivateComponents from "@/components/PrivateComponents";

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="h-screen bg-slate-100" />}>
      <PrivateComponents>{children}</PrivateComponents>
    </Suspense>
  );
}