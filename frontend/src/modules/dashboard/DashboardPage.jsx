import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("mcp_profile");
    if (stored) {
      setProfile(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">MyCareerPortal</h1>
        <button
          className="text-sm text-slate-300 hover:text-red-400"
          onClick={() => {
            localStorage.removeItem("mcp_token");
            window.location.href = "/login";
          }}
        >
          Log out
        </button>
      </header>
      <main className="px-6 py-6">
        <h2 className="text-lg font-medium mb-2">Welcome back{profile ? `, ${profile.fullName}` : ""}</h2>
        <p className="text-slate-400 text-sm">
          This is the starting point of your preparation-to-placement journey. The full dashboard will
          show resume score, mastery heatmap, quiz performance, assignments and readiness.
        </p>
      </main>
    </div>
  );
}
