import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
    { icon: "grid", label: "Dashboard",route:"/dashboard", active: true },
    { icon: "users", label: "Patients",route:"/patients" },
    { icon: "calendar", label: "Appointments",route:"/" },
    { icon: "user-md", label: "Doctors",route:"/" },
    { icon: "pills", label: "Pharmacy",route:"/" },
    { icon: "flask", label: "Laboratory",route:"/" },
    { icon: "file-text", label: "Reports",route:"/" },
    { icon: "settings", label: "Settings",route:"/" },
  ];

export default function Sidebar({ collapsed, setCollapsed, activePage, setActivePage }) {
  const navigate=useNavigate();
    return (
      <aside style={{
        width: collapsed ? "68px" : "220px",
        minHeight: "100vh",
        background: "#0F172A",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        flexShrink: 0,
        position: "relative",
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? "20px 0" : "20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "9px",
            background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 2H15V7H20V9H15V22H9V9H4V7H9V2Z" fill="white" fillOpacity="0.95"/>
            </svg>
          </div>
          {!collapsed && (
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: "14px", letterSpacing: "-0.3px" }}>MediCore</div>
              <div style={{ color: "#64748B", fontSize: "10px" }}>HMS v4.2</div>
            </div>
          )}
        </div>
  
        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 0", overflowY: "auto" }}>
          {NAV_ITEMS.map(({ label, active ,route}) => {
            const isActive = activePage === label || (label === "Dashboard" && !activePage);
            const icons = {
              "Dashboard": "⊞", "Patients": "👥", "Appointments": "📅", "Doctors": "🩺",
              "Pharmacy": "💊", "Laboratory": "🧪", "Reports": "📊", "Settings": "⚙️"
            };
            return (
              <button
                key={label}
                onClick={() => {setActivePage(label);navigate(route)}}
                title={collapsed ? label : ""}
                style={{
                  width: "100%", display: "flex", alignItems: "center",
                  gap: "10px",
                  padding: collapsed ? "11px 0" : "11px 20px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  background: isActive ? "rgba(37,99,235,0.18)" : "transparent",
                  border: "none", cursor: "pointer",
                  borderLeft: isActive ? "3px solid #2563EB" : "3px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseOver={e => { if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseOut={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "17px", flexShrink: 0 }}>{icons[label]}</span>
                {!collapsed && (
                  <span style={{ fontSize: "13.5px", fontWeight: isActive ? 600 : 400, color: isActive ? "#93C5FD" : "#94A3B8" }}>
                    {label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
  
        {/* Collapse toggle */}
        <div style={{ padding: "16px", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button
            onClick={() => setCollapsed(v => !v)}
            style={{
              width: "100%", padding: "9px", borderRadius: "8px",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
              color: "#64748B", cursor: "pointer", fontSize: "13px", display: "flex",
              alignItems: "center", justifyContent: "center", gap: "6px",
            }}
          >
            <span style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.25s", display: "inline-block" }}>◀</span>
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>
    );
  }