import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

interface LayoutProps {
  user?: {
    id: number;
    full_name: string;
    email: string;
    role: string;
  } | null;
  onLogout?: () => void;
}

export default function Layout({ user, onLogout }: LayoutProps) {
  return (
    <div className="min-h-screen flex overflow-hidden bg-gray-50">
      <Sidebar user={user || undefined} onLogout={onLogout} />
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
