// ─────────────────────────────────────────────────────────────────────────────
// AppLayout.jsx  –  drop this around every protected page
// Usage:
//   <AppLayout>
//     <Dashboard />
//   </AppLayout>
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import Sidebar from "./Sidebar";
import TopBar  from "./Topbar";

export default function AppLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#F8FAFC",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    }}>
      {/* Sidebar handles its own responsive behaviour internally */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Right column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// How to use in individual pages (Dashboard, Patients, Rooms, Users …)
// ─────────────────────────────────────────────────────────────────────────────
//
// Option A – wrap at the Router level (recommended, one layout for all pages):
//
//   // App.jsx / router setup
//   import AppLayout from "./components/AppLayout";
//
//   <Routes>
//     <Route element={<AppLayout />}>
//       <Route path="/dashboard"  element={<Dashboard />} />
//       <Route path="/patients"   element={<PatientManagement />} />
//       <Route path="/rooms"      element={<RoomManagement />} />
//       <Route path="/users"      element={<UserManagement />} />
//     </Route>
//   </Routes>
//
//   Then add <Outlet /> inside AppLayout's <main>:
//     import { Outlet } from "react-router-dom";
//     <main style={{ flex: 1, overflowY: "auto" }}><Outlet /></main>
//
//
// Option B – wrap each page individually (if you prefer):
//
//   export default function Dashboard() {
//     return (
//       <AppLayout>
//         <div style={{ padding: 24 }}>… dashboard content …</div>
//       </AppLayout>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVE BEHAVIOUR SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
//
//  < 768 px   MOBILE
//    • Sidebar is hidden off-screen (translateX(-100%))
//    • TopBar shows a ☰ hamburger button
//    • Tapping hamburger slides the sidebar in as a 260px drawer overlay
//    • Semi-transparent backdrop closes it on outside tap
//    • Route changes auto-close the drawer
//
//  768–1099 px  TABLET
//    • Sidebar is a sticky 68px icon-only rail (no toggle needed)
//    • Hovering an icon shows a floating tooltip with the label
//    • TopBar hides the date string and user name to save space
//
//  ≥ 1100 px  DESKTOP
//    • Sidebar is the full 220px expanded panel with labels + user chip
//    • All TopBar elements visible
//
// ─────────────────────────────────────────────────────────────────────────────