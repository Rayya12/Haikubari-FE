// app/(dashboard)/layout.tsx
import SidebarNav from "@/app/ui/sideNav"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <SidebarNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
