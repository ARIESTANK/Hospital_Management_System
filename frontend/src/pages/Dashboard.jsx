import { useState ,useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const NAV_ITEMS = [
  { icon: "grid", label: "Dashboard", active: true },
  { icon: "users", label: "Patients" },
  { icon: "calendar", label: "Appointments" },
  { icon: "user-md", label: "Doctors" },
  { icon: "pills", label: "Pharmacy" },
  { icon: "flask", label: "Laboratory" },
  { icon: "file-text", label: "Reports" },
  { icon: "settings", label: "Settings" },
];

const STATS = [
  { label: "Total Patients", value: "12,486", change: "+3.2%", up: true, color: "#2563EB", bg: "#EFF6FF", icon: "👥", sub: "248 admitted" },
  { label: "Appointments Today", value: "184", change: "+12", up: true, color: "#0891B2", bg: "#ECFEFF", icon: "📅", sub: "32 pending" },
  { label: "Active Doctors", value: "96", change: "-2", up: false, color: "#059669", bg: "#ECFDF5", icon: "🩺", sub: "18 on leave" },
  { label: "Low Stock Items", value: "23", change: "+5", up: false, color: "#DC2626", bg: "#FEF2F2", icon: "💊", sub: "Needs reorder" },
  { label: "Monthly Revenue", value: "$284,500", change: "+8.1%", up: true, color: "#7C3AED", bg: "#F5F3FF", icon: "💰", sub: "vs last month" },
];

const APPOINTMENTS = [
  { id: "APT-4821", patient: "Sarah Mitchell", age: 34, doctor: "Dr. Rajan Patel", dept: "Cardiology", time: "09:00 AM", status: "Confirmed", avatar: "SM" },
  { id: "APT-4822", patient: "James Okoye", age: 52, doctor: "Dr. Linda Chen", dept: "Neurology", time: "09:45 AM", status: "In Progress", avatar: "JO" },
  { id: "APT-4823", patient: "Maria Vasquez", age: 28, doctor: "Dr. Thomas Weiss", dept: "Obstetrics", time: "10:30 AM", status: "Confirmed", avatar: "MV" },
  { id: "APT-4824", patient: "David Park", age: 61, doctor: "Dr. Aisha Nkosi", dept: "Oncology", time: "11:00 AM", status: "Waiting", avatar: "DP" },
  { id: "APT-4825", patient: "Emma Thornton", age: 45, doctor: "Dr. Rajan Patel", dept: "Cardiology", time: "11:30 AM", status: "Cancelled", avatar: "ET" },
  { id: "APT-4826", patient: "Lucas Ferreira", age: 19, doctor: "Dr. Mei Suzuki", dept: "Orthopedics", time: "01:00 PM", status: "Confirmed", avatar: "LF" },
];

const STOCK_ALERTS = [
  { name: "Amoxicillin 500mg", stock: 12, min: 50, unit: "boxes", critical: true },
  { name: "Insulin Glargine", stock: 8, min: 30, unit: "vials", critical: true },
  { name: "Paracetamol IV", stock: 24, min: 40, unit: "bags", critical: false },
  { name: "Metformin 850mg", stock: 31, min: 50, unit: "strips", critical: false },
  { name: "Atorvastatin 20mg", stock: 18, min: 40, unit: "boxes", critical: true },
];

const QUICK_ACTIONS = [
  { label: "New Patient", icon: "➕", color: "#2563EB" },
  { label: "Book Appointment", icon: "📋", color: "#0891B2" },
  { label: "Admit Patient", icon: "🏥", color: "#059669" },
  { label: "Issue Medicine", icon: "💊", color: "#7C3AED" },
  { label: "Generate Report", icon: "📊", color: "#EA580C" },
  { label: "Emergency", icon: "🚨", color: "#DC2626" },
];

const statusStyle = (s) => ({
  "Confirmed":    { bg: "#DCFCE7", color: "#15803D" },
  "In Progress":  { bg: "#DBEAFE", color: "#1D4ED8" },
  "Waiting":      { bg: "#FEF9C3", color: "#A16207" },
  "Cancelled":    { bg: "#FEE2E2", color: "#B91C1C" },
}[s] || { bg: "#F3F4F6", color: "#374151" });

const avatarColor = (initials) => {
  const colors = ["#2563EB","#0891B2","#059669","#7C3AED","#EA580C","#DB2777"];
  return colors[(initials.charCodeAt(0) + initials.charCodeAt(1)) % colors.length];
};


function StatCard({ stat, idx }) {
  return (
    <div style={{
      background: "white",
      borderRadius: "14px",
      border: "1px solid #F1F5F9",
      padding: "20px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
      animation: `fadeUp 0.4s ease both`,
      animationDelay: `${idx * 70}ms`,
      cursor: "default",
      transition: "box-shadow 0.2s, transform 0.2s",
    }}
    onMouseOver={e => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
    onMouseOut={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; e.currentTarget.style.transform = "none"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: "12px", color: "#6B7280", marginBottom: "6px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            {stat.label}
          </p>
          <p style={{ fontSize: "26px", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.5px", lineHeight: 1.1 }}>
            {stat.value}
          </p>
          <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "4px" }}>{stat.sub}</p>
        </div>
        <div style={{
          width: "48px", height: "48px", borderRadius: "12px",
          background: stat.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "22px", flexShrink: 0,
        }}>
          {stat.icon}
        </div>
      </div>
      <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{
          fontSize: "12px", fontWeight: 600,
          color: stat.up ? "#059669" : "#DC2626",
          background: stat.up ? "#DCFCE7" : "#FEE2E2",
          padding: "2px 8px", borderRadius: "20px",
        }}>
          {stat.up ? "▲" : "▼"} {stat.change}
        </span>
        <span style={{ fontSize: "12px", color: "#9CA3AF" }}>vs last period</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [activeTab, setActiveTab] = useState("All");
  const [today, setToday] = useState("");

  const filteredApts =
    activeTab === "All"
      ? APPOINTMENTS
      : APPOINTMENTS.filter((a) => a.status === activeTab);

      useEffect(() => {
        const currentDate = new Date();
        // const day = new Date(currentDate).toLocaleDateString('en-US', { weekday: 'short' });
        const months = ['Jan','Feb','Mar','Apr','May','Jun','July','Aug','Sep','Oct','Nov','Dec']
        const days = ['Monday','Tuesday',"Wednesday","Thursday","Friday","Saturday","Sunday"]
        const day= days[currentDate.getDay()];
      
        const month = months[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        const date = currentDate.getDate();
        const time = currentDate.getHours()>=12? "Night" : "Day" ;
        
        setToday(`${day},${month} ${date}, ${year}   Shift : ${time}`);
      }, []);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC", fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} activePage={activePage} setActivePage={setActivePage} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar />

        <main style={{ flex: 1, padding: "24px", overflowY: "auto" }}>
          {/* Page header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "22px", fontWeight: 700, color: "#0F172A", margin: 0, letterSpacing: "-0.4px" }}>
                Dashboard Overview
              </h1>
              <p style={{ fontSize: "13px", color: "#64748B", margin: "3px 0 0" }}>
                 {today} 
              </p>
            </div>
          </div>

          {/* Stat Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "24px" }}>
            {STATS.map((s, i) => <StatCard key={s.label} stat={s} idx={i} />)}
          </div>

          {/* Quick Actions */}
          <div style={{ background: "white", borderRadius: "14px", border: "1px solid #F1F5F9", padding: "20px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A", margin: "0 0 16px", display: "flex", alignItems: "center", gap: "8px" }}>
              ⚡ Quick Actions
            </h2>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {QUICK_ACTIONS.map(({ label, icon, color }) => (
                <button key={label} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: 500,
                  border: `1px solid ${color}22`,
                  background: `${color}0D`,
                  color: color, cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseOver={e => { e.currentTarget.style.background = `${color}20`; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={e => { e.currentTarget.style.background = `${color}0D`; e.currentTarget.style.transform = "none"; }}
                >
                  <span style={{ fontSize: "16px" }}>{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom grid: Appointments + Stock */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "20px", alignItems: "start" }}>

            {/* Appointments Table */}
            <div style={{ background: "white", borderRadius: "14px", border: "1px solid #F1F5F9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ padding: "18px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A", margin: 0 }}>📅 Recent Appointments</h2>
                <div style={{ display: "flex", gap: "6px" }}>
                  {["All", "Confirmed", "In Progress", "Waiting", "Cancelled"].map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)} style={{
                      padding: "5px 11px", fontSize: "11.5px", fontWeight: 500, borderRadius: "20px",
                      border: "none", cursor: "pointer",
                      background: activeTab === tab ? "#2563EB" : "#F1F5F9",
                      color: activeTab === tab ? "white" : "#64748B",
                      transition: "all 0.15s",
                    }}>{tab}</button>
                  ))}
                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC" }}>
                      {["ID", "Patient", "Doctor", "Department", "Time", "Status", ""].map(h => (
                        <th key={h} style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: "#64748B", fontSize: "11.5px", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApts.map((apt, i) => {
                      const st = statusStyle(apt.status);
                      return (
                        <tr key={apt.id} style={{ borderTop: "1px solid #F1F5F9", transition: "background 0.1s" }}
                          onMouseOver={e => e.currentTarget.style.background = "#F8FAFC"}
                          onMouseOut={e => e.currentTarget.style.background = "transparent"}
                        >
                          <td style={{ padding: "13px 16px", color: "#2563EB", fontWeight: 600, fontSize: "12px" }}>{apt.id}</td>
                          <td style={{ padding: "13px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                              <div style={{
                                width: "30px", height: "30px", borderRadius: "50%",
                                background: avatarColor(apt.avatar),
                                display: "flex", alignItems: "center", justifyContent: "center",
                                color: "white", fontWeight: 700, fontSize: "11px", flexShrink: 0,
                              }}>{apt.avatar}</div>
                              <div>
                                <div style={{ fontWeight: 500, color: "#0F172A" }}>{apt.patient}</div>
                                <div style={{ fontSize: "11px", color: "#94A3B8" }}>Age {apt.age}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "13px 16px", color: "#374151" }}>{apt.doctor}</td>
                          <td style={{ padding: "13px 16px" }}>
                            <span style={{ fontSize: "11.5px", background: "#EFF6FF", color: "#1D4ED8", padding: "3px 9px", borderRadius: "20px", fontWeight: 500 }}>
                              {apt.dept}
                            </span>
                          </td>
                          <td style={{ padding: "13px 16px", color: "#374151", fontWeight: 500 }}>{apt.time}</td>
                          <td style={{ padding: "13px 16px" }}>
                            <span style={{ fontSize: "11.5px", background: st.bg, color: st.color, padding: "3px 10px", borderRadius: "20px", fontWeight: 600 }}>
                              {apt.status}
                            </span>
                          </td>
                          <td style={{ padding: "13px 16px" }}>
                            <button style={{ fontSize: "12px", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredApts.length === 0 && (
                  <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
                    No appointments found for this filter.
                  </div>
                )}
              </div>

              <div style={{ padding: "14px 20px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#94A3B8" }}>Showing {filteredApts.length} of {APPOINTMENTS.length} appointments</span>
                <button style={{ fontSize: "12.5px", color: "#2563EB", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>View All →</button>
              </div>
            </div>

            {/* Right column */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Stock Alerts */}
              <div style={{ background: "white", borderRadius: "14px", border: "1px solid #F1F5F9", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "18px 20px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A", margin: 0 }}>💊 Stock Alerts</h2>
                  <span style={{ fontSize: "11px", background: "#FEE2E2", color: "#B91C1C", padding: "3px 9px", borderRadius: "20px", fontWeight: 600 }}>
                    {STOCK_ALERTS.filter(s => s.critical).length} Critical
                  </span>
                </div>
                <div style={{ padding: "12px" }}>
                  {STOCK_ALERTS.map((item) => {
                    const pct = Math.round((item.stock / item.min) * 100);
                    const barColor = item.critical ? "#DC2626" : "#F59E0B";
                    return (
                      <div key={item.name} style={{
                        padding: "12px", borderRadius: "10px", marginBottom: "8px",
                        background: item.critical ? "#FFF7F7" : "#FFFBEB",
                        border: `1px solid ${item.critical ? "#FEE2E2" : "#FDE68A"}`,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 500, color: "#0F172A" }}>{item.name}</span>
                          <span style={{ fontSize: "11.5px", fontWeight: 700, color: barColor }}>
                            {item.stock} / {item.min} {item.unit}
                          </span>
                        </div>
                        <div style={{ height: "5px", background: "#F1F5F9", borderRadius: "10px", overflow: "hidden" }}>
                          <div style={{
                            height: "100%", width: `${Math.min(pct, 100)}%`,
                            background: barColor, borderRadius: "10px",
                            transition: "width 0.6s ease",
                          }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
                          <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{pct}% of minimum</span>
                          {item.critical && <span style={{ fontSize: "11px", color: "#DC2626", fontWeight: 600 }}>⚠ Reorder Now</span>}
                        </div>
                      </div>
                    );
                  })}
                  <button style={{
                    width: "100%", padding: "10px", fontSize: "13px", fontWeight: 500,
                    border: "1px solid #E5E7EB", borderRadius: "9px",
                    background: "white", color: "#374151", cursor: "pointer", marginTop: "4px",
                  }}>View Full Inventory →</button>
                </div>
              </div>

              {/* Today's Summary */}
              <div style={{ background: "linear-gradient(135deg,#1D4ED8,#0EA5E9)", borderRadius: "14px", padding: "20px", color: "white" }}>
                <h2 style={{ fontSize: "14px", fontWeight: 600, margin: "0 0 16px" }}>📈 Today's Summary</h2>
                {[
                  { label: "Surgeries Scheduled", val: "7" },
                  { label: "Lab Tests Ordered", val: "142" },
                  { label: "Discharges", val: "18" },
                  { label: "Emergency Cases", val: "4" },
                  { label: "Beds Available", val: "63 / 200" },
                ].map(({ label, val }) => (
                  <div key={label} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.12)",
                    fontSize: "13px",
                  }}>
                    <span style={{ color: "rgba(255,255,255,0.75)" }}>{label}</span>
                    <span style={{ fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: #CBD5E1; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 4px; }
      `}</style>
    </div>
  );
}