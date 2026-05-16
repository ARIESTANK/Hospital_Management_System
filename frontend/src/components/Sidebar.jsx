import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", route: "/dashboard", icon: "⊞" },
  { label: "Patients",  route: "/patients",  icon: "👥" },
  { label: "Rooms",     route: "/rooms",     icon: "🛏" },
  { label: "Doctors",   route: "/doctors",   icon: "🩺" },
  { label: "Pharmacy",  route: "/pharmacy",  icon: "💊" },
  { label: "Laboratory",route: "/lab",       icon: "🧪" },
  { label: "Users",     route: "/users",     icon: "👤" },
  { label: "Settings",  route: "/settings",  icon: "⚙️" },
];

// ── Breakpoints ────────────────────────────────────────────────────────────
// < 768px  → hidden by default, slides in as a full overlay drawer
// 768–1024 → icon-only rail (collapsed)
// > 1024   → full expanded sidebar

function useWindowWidth() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handle = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);
  return width;
}

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const width     = useWindowWidth();
  const drawerRef = useRef(null);

  const isMobile  = width < 768;
  const isTablet  = width >= 768 && width < 1100;
  const isDesktop = width >= 1100;

  // Collapsed = icon-only on tablet; always full on desktop
  const collapsed = isTablet;

  // Close mobile drawer on outside click
  useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    const handler = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobile, mobileOpen, setMobileOpen]);

  // Close drawer on route change (mobile)
  useEffect(() => {
    if (isMobile) setMobileOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when drawer open on mobile
  useEffect(() => {
    if (isMobile && mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isMobile, mobileOpen]);

  const sidebarWidth = collapsed ? "68px" : "220px";

  // ── Sidebar content ──────────────────────────────────────────────────────
  const SidebarContent = () => (
    <aside
      ref={drawerRef}
      style={{
        width: isMobile ? "260px" : sidebarWidth,
        height: "100%",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
        overflowX: "hidden",
      }}
    >
      {/* ── Logo ── */}
      <div style={{
        padding: collapsed && !isMobile ? "20px 0" : "20px",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        display: "flex",
        alignItems: "center",
        gap: 10,
        justifyContent: collapsed && !isMobile ? "center" : "flex-start",
        flexShrink: 0,
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: 9,
          background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 2H15V7H20V9H15V22H9V9H4V7H9V2Z" fill="white" fillOpacity="0.95"/>
          </svg>
        </div>

        {(!collapsed || isMobile) && (
          <div style={{ overflow: "hidden" }}>
            <div style={{ color: "white", fontWeight: 700, fontSize: 14, letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
              MediCore
            </div>
            <div style={{ color: "#64748B", fontSize: 10 }}>HMS v4.2</div>
          </div>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              marginLeft: "auto", background: "rgba(255,255,255,0.08)",
              border: "none", color: "#94A3B8", width: 30, height: 30,
              borderRadius: 7, cursor: "pointer", fontSize: 15,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >✕</button>
        )}
      </div>

      {/* ── Nav items ── */}
      <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto", overflowX: "hidden" }}>
        {/* Section label */}
        {(!collapsed || isMobile) && (
          <p style={{ fontSize: 10, fontWeight: 700, color: "#334155",
                      textTransform: "uppercase", letterSpacing: ".1em",
                      padding: "8px 20px 4px", margin: 0 }}>
            Main Menu
          </p>
        )}

        {NAV_ITEMS.slice(0, 6).map(({ label, route, icon }) => {
          const isActive = location.pathname === route ||
            (route === "/dashboard" && location.pathname === "/");
          return (
            <NavItem
              key={label}
              label={label}
              icon={icon}
              isActive={isActive}
              collapsed={collapsed && !isMobile}
              onClick={() => navigate(route)}
            />
          );
        })}

        {/* Section divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "10px 14px" }}/>

        {(!collapsed || isMobile) && (
          <p style={{ fontSize: 10, fontWeight: 700, color: "#334155",
                      textTransform: "uppercase", letterSpacing: ".1em",
                      padding: "4px 20px 4px", margin: 0 }}>
            System
          </p>
        )}

        {NAV_ITEMS.slice(6).map(({ label, route, icon }) => {
          const isActive = location.pathname === route;
          return (
            <NavItem
              key={label}
              label={label}
              icon={icon}
              isActive={isActive}
              collapsed={collapsed && !isMobile}
              onClick={() => navigate(route)}
            />
          );
        })}
      </nav>

      {/* ── User chip ── */}
      {(!collapsed || isMobile) && (
        <div style={{
          margin: "0 10px 10px",
          padding: "10px 12px",
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10,
          border: "1px solid rgba(255,255,255,0.07)",
          display: "flex", alignItems: "center", gap: 10,
          flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: 12, flexShrink: 0,
          }}>AD</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "white", fontWeight: 600, fontSize: 12.5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Dr. Admin</div>
            <div style={{ color: "#64748B", fontSize: 10.5 }}>Super Admin</div>
          </div>
          <button style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 14, padding: 2, flexShrink: 0 }}>↗</button>
        </div>
      )}

      {/* Collapsed user avatar (tablet) */}
      {collapsed && !isMobile && (
        <div style={{ padding: "10px 0", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: 12,
          }}>AD</div>
        </div>
      )}

      {/* ── Desktop collapse toggle ── */}
      {!isMobile && (
        <div style={{ padding: "10px 10px 14px", borderTop: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
          <CollapseBtn collapsed={collapsed} isTablet={isTablet} />
        </div>
      )}
    </aside>
  );

  // ── Mobile overlay ───────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(15,23,42,0.55)",
          backdropFilter: "blur(2px)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
          transition: "opacity 0.25s ease",
        }} onClick={() => setMobileOpen(false)} />

        {/* Drawer */}
        <div style={{
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 50,
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.28s cubic-bezier(.16,1,.3,1)",
          boxShadow: mobileOpen ? "4px 0 40px rgba(0,0,0,0.4)" : "none",
        }}>
          <SidebarContent />
        </div>
      </>
    );
  }

  // ── Static sidebar (tablet / desktop) ────────────────────────────────────
  return (
    <div style={{
      width: sidebarWidth,
      minHeight: "100vh",
      flexShrink: 0,
      transition: "width 0.25s ease",
      position: "sticky",
      top: 0,
      height: "100vh",
    }}>
      <SidebarContent />
    </div>
  );
}

// ── NavItem ────────────────────────────────────────────────────────────────
function NavItem({ label, icon, isActive, collapsed, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : ""}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: collapsed ? "11px 0" : "10px 16px 10px 18px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: isActive
          ? "rgba(37,99,235,0.18)"
          : hovered ? "rgba(255,255,255,0.05)" : "transparent",
        border: "none",
        cursor: "pointer",
        borderLeft: isActive ? "3px solid #2563EB" : "3px solid transparent",
        borderRight: "none",
        borderTop: "none",
        borderBottom: "none",
        transition: "all 0.15s",
        textAlign: "left",
        position: "relative",
      }}
    >
      <span style={{ fontSize: 17, flexShrink: 0, lineHeight: 1 }}>{icon}</span>

      {!collapsed && (
        <span style={{
          fontSize: 13.5,
          fontWeight: isActive ? 600 : 400,
          color: isActive ? "#93C5FD" : "#94A3B8",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          transition: "color 0.15s",
        }}>
          {label}
        </span>
      )}

      {isActive && !collapsed && (
        <span style={{
          marginLeft: "auto",
          width: 6, height: 6, borderRadius: "50%",
          background: "#2563EB", flexShrink: 0,
        }}/>
      )}

      {/* Tooltip for collapsed icon-only mode */}
      {collapsed && hovered && (
        <div style={{
          position: "absolute",
          left: "calc(100% + 10px)",
          top: "50%",
          transform: "translateY(-50%)",
          background: "#1E293B",
          color: "white",
          fontSize: 12,
          fontWeight: 600,
          padding: "5px 10px",
          borderRadius: 7,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 99,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        }}>
          {label}
          <span style={{
            position: "absolute", right: "100%", top: "50%",
            transform: "translateY(-50%)",
            border: "5px solid transparent",
            borderRightColor: "#1E293B",
          }}/>
        </div>
      )}
    </button>
  );
}

// ── Collapse button (desktop only — note: tablet auto-collapses) ───────────
function CollapseBtn({ collapsed, isTablet }) {
  // On tablet we don't show a toggle — width is driven by breakpoint automatically
  if (isTablet) return null;
  return null; // Desktop is always expanded; remove if you want a manual toggle
}