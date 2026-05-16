import { useState, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

// ── Static data ────────────────────────────────────────────────────────────

const STATS = [
  { label: "Total Patients",      value: "12,486", change: "+3.2%", up: true,  icon: "👥", bg: "#EFF6FF", color: "#2563EB", sub: "248 admitted"  },
  { label: "Appointments Today",  value: "184",    change: "+12",   up: true,  icon: "📅", bg: "#ECFEFF", color: "#0891B2", sub: "32 pending"    },
  { label: "Active Doctors",      value: "96",     change: "-2",    up: false, icon: "🩺", bg: "#ECFDF5", color: "#059669", sub: "18 on leave"   },
  { label: "Monthly Revenue",     value: "$284.5k",change: "+8.1%", up: true,  icon: "💰", bg: "#F5F3FF", color: "#7C3AED", sub: "vs last month" },
];

const APPOINTMENTS = [
  { id:"APT-4821", patient:"Sarah Mitchell",   age:34, doctor:"Dr. Rajan Patel",  dept:"Cardiology",  time:"09:00 AM", status:"Confirmed",   avatar:"SM" },
  { id:"APT-4822", patient:"James Okoye",      age:52, doctor:"Dr. Linda Chen",   dept:"Neurology",   time:"09:45 AM", status:"In Progress", avatar:"JO" },
  { id:"APT-4823", patient:"Maria Vasquez",    age:28, doctor:"Dr. Thomas Weiss", dept:"Obstetrics",  time:"10:30 AM", status:"Confirmed",   avatar:"MV" },
  { id:"APT-4824", patient:"David Park",       age:61, doctor:"Dr. Aisha Nkosi",  dept:"Oncology",    time:"11:00 AM", status:"Waiting",     avatar:"DP" },
  { id:"APT-4825", patient:"Emma Thornton",    age:45, doctor:"Dr. Rajan Patel",  dept:"Cardiology",  time:"11:30 AM", status:"Cancelled",   avatar:"ET" },
  { id:"APT-4826", patient:"Lucas Ferreira",   age:19, doctor:"Dr. Mei Suzuki",   dept:"Orthopedics", time:"01:00 PM", status:"Confirmed",   avatar:"LF" },
];

const STOCK_ALERTS = [
  { name:"Amoxicillin 500mg",   stock:12, min:50, unit:"boxes",  critical:true  },
  { name:"Insulin Glargine",    stock:8,  min:30, unit:"vials",  critical:true  },
  { name:"Paracetamol IV",      stock:24, min:40, unit:"bags",   critical:false },
  { name:"Atorvastatin 20mg",   stock:18, min:40, unit:"boxes",  critical:true  },
];

// ── Chart seed data ────────────────────────────────────────────────────────

const PATIENT_TREND = [
  { month:"Nov", admitted:210, discharged:198, emergency:32 },
  { month:"Dec", admitted:245, discharged:230, emergency:41 },
  { month:"Jan", admitted:198, discharged:187, emergency:28 },
  { month:"Feb", admitted:267, discharged:250, emergency:38 },
  { month:"Mar", admitted:312, discharged:295, emergency:52 },
  { month:"Apr", admitted:289, discharged:271, emergency:44 },
  { month:"May", admitted:248, discharged:230, emergency:36 },
];

const REVENUE_TREND = [
  { week:"W1",  revenue:62400, target:58000 },
  { week:"W2",  revenue:71200, target:65000 },
  { week:"W3",  revenue:58900, target:65000 },
  { week:"W4",  revenue:84500, target:72000 },
  { week:"W5",  revenue:76300, target:72000 },
  { week:"W6",  revenue:91200, target:80000 },
];

const DEPT_LOAD = [
  { dept:"Cardiology",   patients:87, beds:100 },
  { dept:"Neurology",    patients:54, beds:70  },
  { dept:"Oncology",     patients:63, beds:80  },
  { dept:"Orthopedics",  patients:41, beds:60  },
  { dept:"Pediatrics",   patients:72, beds:90  },
  { dept:"Emergency",    patients:38, beds:40  },
];

const STATUS_PIE = [
  { name:"Admitted",   value:248, color:"#2563EB" },
  { name:"Outpatient", value:186, color:"#059669" },
  { name:"Critical",   value:34,  color:"#DC2626" },
  { name:"Discharged", value:112, color:"#94A3B8" },
];

const BED_OCCUPANCY = [
  { floor:"G-Flr", total:50, used:38 },
  { floor:"1st",   total:60, used:54 },
  { floor:"2nd",   total:60, used:49 },
  { floor:"3rd",   total:40, used:31 },
  { floor:"4th",   total:30, used:22 },
];

// ── Helpers ────────────────────────────────────────────────────────────────

const statusStyle = (s) => ({
  "Confirmed":   { bg:"#DCFCE7", color:"#15803D" },
  "In Progress": { bg:"#DBEAFE", color:"#1D4ED8" },
  "Waiting":     { bg:"#FEF9C3", color:"#A16207" },
  "Cancelled":   { bg:"#FEE2E2", color:"#B91C1C" },
}[s] || { bg:"#F3F4F6", color:"#374151" });

const avatarColor = (initials) => {
  const colors = ["#2563EB","#0891B2","#059669","#7C3AED","#EA580C","#DB2777"];
  return colors[(initials.charCodeAt(0) + initials.charCodeAt(1)) % colors.length];
};

// ── Custom tooltip ─────────────────────────────────────────────────────────

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:10,
                  padding:"10px 14px", fontSize:12, color:"white", boxShadow:"0 8px 24px rgba(0,0,0,.3)" }}>
      <p style={{ fontWeight:700, marginBottom:5, color:"#94A3B8" }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color||"white", margin:"2px 0" }}>
          {p.name}: <strong>${typeof p.value === "number" && p.value > 1000 ? p.value.toLocaleString() : p.value}</strong>
        </p>
      ))}
    </div>
  );
};
const PlainTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:10,
                  padding:"10px 14px", fontSize:12, color:"white" }}>
      <p style={{ fontWeight:700, marginBottom:5, color:"#94A3B8" }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color||"white", margin:"2px 0" }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Stat Card ──────────────────────────────────────────────────────────────

function StatCard({ stat, idx }) {
  return (
    <div style={{
      background:"white", borderRadius:14, border:"1px solid #F1F5F9",
      padding:"18px 20px", boxShadow:"0 1px 3px rgba(0,0,0,.04)",
      animation:`fadeUp .4s ease both`, animationDelay:`${idx*70}ms`,
      cursor:"default", transition:"box-shadow .2s,transform .2s",
    }}
      onMouseOver={e=>{ e.currentTarget.style.boxShadow="0 6px 24px rgba(0,0,0,.08)"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseOut={e=>{  e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.04)"; e.currentTarget.style.transform="none"; }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <p style={{ fontSize:11.5, color:"#6B7280", marginBottom:6, fontWeight:600,
                      textTransform:"uppercase", letterSpacing:".06em" }}>{stat.label}</p>
          <p style={{ fontSize:26, fontWeight:800, color:"#0F172A",
                      letterSpacing:"-.5px", lineHeight:1.1 }}>{stat.value}</p>
          <p style={{ fontSize:11.5, color:"#94A3B8", marginTop:4 }}>{stat.sub}</p>
        </div>
        <div style={{ width:46, height:46, borderRadius:12, background:stat.bg,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:21, flexShrink:0 }}>{stat.icon}</div>
      </div>
      <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:6 }}>
        <span style={{ fontSize:12, fontWeight:700,
          color:stat.up?"#059669":"#DC2626",
          background:stat.up?"#DCFCE7":"#FEE2E2",
          padding:"2px 8px", borderRadius:20 }}>
          {stat.up ? "▲" : "▼"} {stat.change}
        </span>
        <span style={{ fontSize:11.5, color:"#9CA3AF" }}>vs last period</span>
      </div>
    </div>
  );
}

// ── Chart wrapper ──────────────────────────────────────────────────────────

function ChartCard({ title, subtitle, children, style={} }) {
  return (
    <div style={{ background:"white", borderRadius:14, border:"1px solid #F1F5F9",
                  padding:"20px", boxShadow:"0 1px 3px rgba(0,0,0,.04)", ...style }}>
      <div style={{ marginBottom:16 }}>
        <h3 style={{ fontSize:14, fontWeight:700, color:"#0F172A", margin:0, letterSpacing:"-.2px" }}>{title}</h3>
        {subtitle && <p style={{ fontSize:12, color:"#94A3B8", margin:"3px 0 0" }}>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────

export default function Dashboard() {
  const [collapsed,  setCollapsed]  = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [activeTab,  setActiveTab]  = useState("All");
  const [today,      setToday]      = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const filteredApts = activeTab === "All"
    ? APPOINTMENTS
    : APPOINTMENTS.filter(a => a.status === activeTab);

  useEffect(() => {
    const d = new Date();
    const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const shift  = d.getHours() >= 18 ? "Evening" : d.getHours() >= 12 ? "Afternoon" : "Morning";
    setToday(`${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}  ·  Shift: ${shift}`);
  }, []);

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#F8FAFC",
                  fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
        <TopBar onMenuClick={() => setMobileOpen(true)} />

        <main style={{ flex:1, padding:"20px 24px", overflowY:"auto" }}>

          {/* ── Page header ── */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start",
                        marginBottom:22, flexWrap:"wrap", gap:10 }}>
            <div>
              <h1 style={{ fontSize:21, fontWeight:800, color:"#0F172A", margin:0, letterSpacing:"-.4px" }}>
                Dashboard Overview
              </h1>
              <p style={{ fontSize:12.5, color:"#64748B", margin:"3px 0 0" }}>{today}</p>
            </div>
            
          </div>

          {/* ── KPI cards (4, not 5) ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",
                        gap:14, marginBottom:22 }}>
            {STATS.map((s,i) => <StatCard key={s.label} stat={s} idx={i} />)}
          </div>

          {/* ── Chart row 1: Patient trend + Revenue trend ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
                        gap:16, marginBottom:16 }}>

            <ChartCard title="Patient Admissions" subtitle="Last 7 months — admitted / discharged / emergency">
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={PATIENT_TREND} margin={{top:4,right:8,left:-20,bottom:0}}>
                  <defs>
                    <linearGradient id="gAdmit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563EB" stopOpacity={0.25}/>
                      <stop offset="100%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gDis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#059669" stopOpacity={0.2}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<PlainTip/>}/>
                  <Area type="monotone" dataKey="admitted"   name="Admitted"   stroke="#2563EB" strokeWidth={2} fill="url(#gAdmit)"/>
                  <Area type="monotone" dataKey="discharged" name="Discharged" stroke="#059669" strokeWidth={2} fill="url(#gDis)"/>
                  <Line type="monotone" dataKey="emergency"  name="Emergency"  stroke="#DC2626" strokeWidth={1.5} dot={{r:3,fill:"#DC2626"}} strokeDasharray="4 3"/>
                  <Legend wrapperStyle={{fontSize:11.5,paddingTop:8}}/>
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Weekly Revenue" subtitle="Actual vs target ($)">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={REVENUE_TREND} margin={{top:4,right:8,left:-20,bottom:0}} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="week" tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}
                         tickFormatter={v=>`$${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<ChartTip/>}/>
                  <Bar dataKey="revenue" name="Revenue" fill="#2563EB" radius={[5,5,0,0]}/>
                  <Bar dataKey="target"  name="Target"  fill="#CBD5E1" radius={[5,5,0,0]}/>
                  <Legend wrapperStyle={{fontSize:11.5,paddingTop:8}}/>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* ── Chart row 2: Patient status pie + Department load + Bed occupancy ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",
                        gap:16, marginBottom:16 }}>

            {/* Patient status pie */}
            <ChartCard title="Patient Status" subtitle="Current breakdown">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={STATUS_PIE} dataKey="value" nameKey="name"
                       cx="50%" cy="50%" innerRadius={52} outerRadius={80} paddingAngle={3}>
                    {STATUS_PIE.map((d,i) => <Cell key={i} fill={d.color}/>)}
                  </Pie>
                  <Tooltip content={<PlainTip/>}/>
                  <Legend wrapperStyle={{fontSize:11.5}}/>
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Department load */}
            <ChartCard title="Department Load" subtitle="Patients vs capacity">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={DEPT_LOAD} layout="vertical" margin={{top:0,right:8,left:4,bottom:0}} barSize={9}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false}/>
                  <XAxis type="number" tick={{fontSize:10.5,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                  <YAxis type="category" dataKey="dept" tick={{fontSize:10.5,fill:"#64748B"}}
                         axisLine={false} tickLine={false} width={76}/>
                  <Tooltip content={<PlainTip/>}/>
                  <Bar dataKey="beds"     name="Capacity" fill="#E2E8F0" radius={[0,5,5,0]}/>
                  <Bar dataKey="patients" name="Patients" fill="#2563EB" radius={[0,5,5,0]}/>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* Bed occupancy by floor */}
            <ChartCard title="Bed Occupancy" subtitle="Used vs total by floor">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={BED_OCCUPANCY} margin={{top:4,right:8,left:-20,bottom:0}} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                  <XAxis dataKey="floor" tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                  <Tooltip content={<PlainTip/>}/>
                  <Bar dataKey="total" name="Total"    fill="#E2E8F0" radius={[5,5,0,0]}/>
                  <Bar dataKey="used"  name="Occupied" fill="#7C3AED" radius={[5,5,0,0]}/>
                  <Legend wrapperStyle={{fontSize:11.5,paddingTop:8}}/>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* ── Bottom: Appointments table + Stock alerts ── */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
                        gap:16, alignItems:"start" }}>

            {/* Appointments */}
            <div style={{ background:"white", borderRadius:14, border:"1px solid #F1F5F9",
                          overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid #F1F5F9",
                            display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
                <h2 style={{ fontSize:14, fontWeight:700, color:"#0F172A", margin:0 }}>📅 Recent Appointments</h2>
                <div style={{ display:"flex", gap:5, flexWrap:"wrap" }}>
                  {["All","Confirmed","In Progress","Waiting","Cancelled"].map(tab => (
                    <button key={tab} onClick={()=>setActiveTab(tab)} style={{
                      padding:"4px 10px", fontSize:11.5, fontWeight:500, borderRadius:20,
                      border:"none", cursor:"pointer",
                      background: activeTab===tab ? "#2563EB" : "#F1F5F9",
                      color:       activeTab===tab ? "white"    : "#64748B",
                      transition:"all .15s",
                    }}>{tab}</button>
                  ))}
                </div>
              </div>

              <div style={{ overflowX:"auto" }}>
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12.5 }}>
                  <thead>
                    <tr style={{ background:"#F8FAFC" }}>
                      {["Patient","Doctor","Dept","Time","Status",""].map(h => (
                        <th key={h} style={{ padding:"10px 14px", textAlign:"left", fontWeight:600,
                            color:"#64748B", fontSize:11, textTransform:"uppercase",
                            letterSpacing:".05em", whiteSpace:"nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApts.map(apt => {
                      const st = statusStyle(apt.status);
                      return (
                        <tr key={apt.id} style={{ borderTop:"1px solid #F1F5F9", transition:"background .1s" }}
                          onMouseOver={e=>e.currentTarget.style.background="#F8FAFC"}
                          onMouseOut={e=>e.currentTarget.style.background="transparent"}
                        >
                          <td style={{ padding:"11px 14px" }}>
                            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                              <div style={{ width:28, height:28, borderRadius:"50%",
                                  background:avatarColor(apt.avatar),
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  color:"white", fontWeight:700, fontSize:10, flexShrink:0 }}>
                                {apt.avatar}
                              </div>
                              <div>
                                <div style={{ fontWeight:600, color:"#0F172A", fontSize:12.5 }}>{apt.patient}</div>
                                <div style={{ fontSize:11, color:"#94A3B8" }}>Age {apt.age}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding:"11px 14px", color:"#374151", fontSize:12.5 }}>{apt.doctor}</td>
                          <td style={{ padding:"11px 14px" }}>
                            <span style={{ fontSize:11, background:"#EFF6FF", color:"#1D4ED8",
                                           padding:"2px 8px", borderRadius:20, fontWeight:500 }}>{apt.dept}</span>
                          </td>
                          <td style={{ padding:"11px 14px", color:"#374151", fontWeight:600, fontSize:12.5 }}>{apt.time}</td>
                          <td style={{ padding:"11px 14px" }}>
                            <span style={{ fontSize:11, background:st.bg, color:st.color,
                                           padding:"2px 9px", borderRadius:20, fontWeight:700 }}>{apt.status}</span>
                          </td>
                          <td style={{ padding:"11px 14px" }}>
                            <button style={{ fontSize:12, color:"#2563EB", background:"none",
                                             border:"none", cursor:"pointer", fontWeight:600 }}>View</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {filteredApts.length === 0 && (
                  <div style={{ padding:"36px", textAlign:"center", color:"#94A3B8", fontSize:13 }}>
                    No appointments for this filter.
                  </div>
                )}
              </div>

              <div style={{ padding:"12px 18px", borderTop:"1px solid #F1F5F9",
                            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:12, color:"#94A3B8" }}>
                  Showing {filteredApts.length} of {APPOINTMENTS.length}
                </span>
                <button style={{ fontSize:12.5, color:"#2563EB", background:"none",
                                 border:"none", cursor:"pointer", fontWeight:600 }}>View All →</button>
              </div>
            </div>

            {/* Stock alerts */}
            <div style={{ background:"white", borderRadius:14, border:"1px solid #F1F5F9",
                          overflow:"hidden", boxShadow:"0 1px 3px rgba(0,0,0,.04)" }}>
              <div style={{ padding:"16px 20px", borderBottom:"1px solid #F1F5F9",
                            display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <h2 style={{ fontSize:14, fontWeight:700, color:"#0F172A", margin:0 }}>💊 Stock Alerts</h2>
                <span style={{ fontSize:11, background:"#FEE2E2", color:"#B91C1C",
                               padding:"3px 9px", borderRadius:20, fontWeight:700 }}>
                  {STOCK_ALERTS.filter(s=>s.critical).length} Critical
                </span>
              </div>
              <div style={{ padding:12 }}>
                {STOCK_ALERTS.map(item => {
                  const pct      = Math.round((item.stock/item.min)*100);
                  const barColor = item.critical ? "#DC2626" : "#F59E0B";
                  return (
                    <div key={item.name} style={{
                      padding:12, borderRadius:10, marginBottom:8,
                      background: item.critical ? "#FFF7F7" : "#FFFBEB",
                      border:`1px solid ${item.critical ? "#FEE2E2":"#FDE68A"}`,
                    }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                        <span style={{ fontSize:12.5, fontWeight:500, color:"#0F172A" }}>{item.name}</span>
                        <span style={{ fontSize:11.5, fontWeight:700, color:barColor }}>
                          {item.stock}/{item.min} {item.unit}
                        </span>
                      </div>
                      <div style={{ height:5, background:"#F1F5F9", borderRadius:10, overflow:"hidden" }}>
                        <div style={{ height:"100%", width:`${Math.min(pct,100)}%`,
                                      background:barColor, borderRadius:10, transition:"width .6s ease" }}/>
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                        <span style={{ fontSize:11, color:"#9CA3AF" }}>{pct}% of minimum</span>
                        {item.critical && <span style={{ fontSize:11, color:"#DC2626", fontWeight:700 }}>⚠ Reorder</span>}
                      </div>
                    </div>
                  );
                })}
                <button style={{ width:"100%", marginTop:6, padding:10, fontSize:13, fontWeight:500,
                    border:"1px solid #E5E7EB", borderRadius:9, background:"white",
                    color:"#374151", cursor:"pointer" }}>View Full Inventory →</button>
              </div>

              {/* Today's summary — compact */}
              <div style={{ margin:"0 12px 12px", background:"linear-gradient(135deg,#1D4ED8,#0EA5E9)",
                            borderRadius:12, padding:"16px 18px", color:"white" }}>
                <h3 style={{ fontSize:13, fontWeight:700, margin:"0 0 12px" }}>📈 Today at a Glance</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 16px" }}>
                  {[
                    ["Surgeries","7"],["Lab Tests","142"],
                    ["Discharges","18"],["Emergencies","4"],
                    ["Beds Free","63/200"],["ICU Beds","4/12"],
                  ].map(([l,v]) => (
                    <div key={l} style={{ display:"flex", justifyContent:"space-between",
                                          padding:"7px 0", borderBottom:"1px solid rgba(255,255,255,.1)", fontSize:12 }}>
                      <span style={{ color:"rgba(255,255,255,.7)" }}>{l}</span>
                      <span style={{ fontWeight:700 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        * { box-sizing:border-box; margin:0; padding:0; }
        input::placeholder { color:#CBD5E1; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#E2E8F0; border-radius:4px; }
        @media(max-width:640px){
          main { padding:14px !important; }
        }
      `}</style>
    </div>
  );
}