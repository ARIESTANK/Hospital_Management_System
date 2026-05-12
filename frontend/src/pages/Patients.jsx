import { useState, useMemo } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
const PATIENTS_RAW = [
  { id: "P-10021", name: "Sarah Mitchell",   gender: "Female", age: 34, phone: "+1 (415) 882-3301", blood: "A+",  dept: "Cardiology",   status: "Admitted",   joined: "2026-01-08" },
  { id: "P-10022", name: "James Okoye",       gender: "Male",   age: 52, phone: "+1 (312) 774-5590", blood: "O-",  dept: "Neurology",    status: "Outpatient", joined: "2025-11-14" },
  { id: "P-10023", name: "Maria Vasquez",     gender: "Female", age: 28, phone: "+1 (702) 991-4423", blood: "B+",  dept: "Obstetrics",   status: "Admitted",   joined: "2026-03-22" },
  { id: "P-10024", name: "David Park",        gender: "Male",   age: 61, phone: "+1 (206) 338-7761", blood: "AB+", dept: "Oncology",     status: "Critical",   joined: "2025-09-05" },
  { id: "P-10025", name: "Emma Thornton",     gender: "Female", age: 45, phone: "+1 (617) 445-2209", blood: "A-",  dept: "Cardiology",   status: "Discharged", joined: "2026-02-11" },
  { id: "P-10026", name: "Lucas Ferreira",    gender: "Male",   age: 19, phone: "+1 (503) 667-8834", blood: "O+",  dept: "Orthopedics",  status: "Outpatient", joined: "2026-04-01" },
  { id: "P-10027", name: "Priya Nair",        gender: "Female", age: 38, phone: "+1 (972) 554-1107", blood: "B-",  dept: "Dermatology",  status: "Outpatient", joined: "2026-01-29" },
  { id: "P-10028", name: "Ahmed Hassan",      gender: "Male",   age: 47, phone: "+1 (404) 772-6643", blood: "A+",  dept: "Pulmonology",  status: "Admitted",   joined: "2026-03-15" },
  { id: "P-10029", name: "Chloe Dupont",      gender: "Female", age: 55, phone: "+1 (305) 889-3320", blood: "O+",  dept: "Endocrinology",status: "Outpatient", joined: "2025-12-03" },
  { id: "P-10030", name: "Raj Krishnamurthy", gender: "Male",   age: 63, phone: "+1 (713) 443-9901", blood: "AB-", dept: "Nephrology",   status: "Critical",   joined: "2026-02-28" },
  { id: "P-10031", name: "Yuki Tanaka",       gender: "Female", age: 31, phone: "+1 (858) 221-5567", blood: "B+",  dept: "Psychiatry",   status: "Admitted",   joined: "2026-04-09" },
  { id: "P-10032", name: "Marcus Williams",   gender: "Male",   age: 42, phone: "+1 (602) 337-8812", blood: "O-",  dept: "Urology",      status: "Discharged", joined: "2026-01-17" },
  { id: "P-10033", name: "Fatima Al-Rashid",  gender: "Female", age: 29, phone: "+1 (214) 556-4430", blood: "A+",  dept: "Gynecology",   status: "Admitted",   joined: "2026-03-30" },
  { id: "P-10034", name: "Oliver Bennett",    gender: "Male",   age: 58, phone: "+1 (651) 774-2298", blood: "B+",  dept: "Gastroenterology", status: "Outpatient", joined: "2025-10-22" },
  { id: "P-10035", name: "Aisha Mensah",      gender: "Female", age: 36, phone: "+1 (404) 991-3345", blood: "O+",  dept: "Ophthalmology",status: "Outpatient", joined: "2026-02-05" },
  { id: "P-10036", name: "Chen Wei",          gender: "Male",   age: 44, phone: "+1 (415) 667-7723", blood: "A-",  dept: "Cardiology",   status: "Admitted",   joined: "2026-04-14" },
  { id: "P-10037", name: "Sofia Reyes",       gender: "Female", age: 23, phone: "+1 (213) 883-5501", blood: "AB+", dept: "Emergency",    status: "Critical",   joined: "2026-05-10" },
  { id: "P-10038", name: "Thomas Müller",     gender: "Male",   age: 67, phone: "+1 (312) 448-9934", blood: "O+",  dept: "Geriatrics",   status: "Admitted",   joined: "2026-03-01" },
  { id: "P-10039", name: "Nadia Petrov",      gender: "Female", age: 41, phone: "+1 (720) 334-6678", blood: "B-",  dept: "Rheumatology", status: "Outpatient", joined: "2026-01-22" },
  { id: "P-10040", name: "Samuel Johnson",    gender: "Male",   age: 50, phone: "+1 (617) 882-1123", blood: "A+",  dept: "Hematology",   status: "Discharged", joined: "2025-12-28" },
];

const STATUS_CONFIG = {
  "Admitted":   { bg: "#DBEAFE", color: "#1D4ED8", dot: "#2563EB" },
  "Outpatient": { bg: "#DCFCE7", color: "#15803D", dot: "#16A34A" },
  "Critical":   { bg: "#FEE2E2", color: "#B91C1C", dot: "#DC2626" },
  "Discharged": { bg: "#F3F4F6", color: "#374151", dot: "#9CA3AF" },
};

const GENDER_CONFIG = {
  "Male":   { bg: "#EFF6FF", color: "#1D4ED8" },
  "Female": { bg: "#FDF2F8", color: "#9D174D" },
};

const BLOOD_COLORS = {
  "A+":"#FEE2E2","A-":"#FECACA","B+":"#FEF3C7","B-":"#FDE68A",
  "O+":"#D1FAE5","O-":"#A7F3D0","AB+":"#EDE9FE","AB-":"#DDD6FE",
};
const BLOOD_TEXT = {
  "A+":"#B91C1C","A-":"#991B1B","B+":"#92400E","B-":"#78350F",
  "O+":"#065F46","O-":"#064E3B","AB+":"#4C1D95","AB-":"#3B0764",
};

const avatarColor = (name) => {
  const palette = ["#2563EB","#0891B2","#059669","#7C3AED","#EA580C","#DB2777","#0369A1","#047857"];
  let hash = 0;
  for (let c of name) hash = (hash * 31 + c.charCodeAt(0)) & 0xFFFFFFFF;
  return palette[Math.abs(hash) % palette.length];
};

const initials = (name) => name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();

const PAGE_SIZE = 8;

function AddPatientModal({ onClose }) {
  const [form, setForm] = useState({ name:"", gender:"Male", age:"", phone:"", dept:"", blood:"A+", status:"Outpatient" });
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const labelStyle = { fontSize:"12px", fontWeight:600, color:"#374151", display:"block", marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.04em" };
  const inputStyle = { width:"100%", padding:"9px 12px", fontSize:"13.5px", border:"1.5px solid #E5E7EB", borderRadius:"9px", background:"#F9FAFB", color:"#111827", outline:"none", boxSizing:"border-box" };

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.45)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ background:"white", borderRadius:"18px", width:"100%", maxWidth:"520px", boxShadow:"0 25px 60px rgba(0,0,0,0.2)", overflow:"hidden" }}>
        <div style={{ background:"linear-gradient(135deg,#1D4ED8,#2563EB,#0EA5E9)", padding:"24px 28px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <h2 style={{ color:"white", fontSize:"17px", fontWeight:700, margin:0 }}>Add New Patient</h2>
              <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"13px", margin:"3px 0 0" }}>Fill in patient details below</p>
            </div>
            <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none", color:"white", width:"32px", height:"32px", borderRadius:"8px", cursor:"pointer", fontSize:"16px", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          </div>
        </div>

        <div style={{ padding:"24px 28px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px" }}>
            <div style={{ gridColumn:"1/-1" }}>
              <label style={labelStyle}>Full Name</label>
              <input style={inputStyle} placeholder="e.g. Sarah Mitchell" value={form.name} onChange={e=>set("name",e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Gender</label>
              <select style={inputStyle} value={form.gender} onChange={e=>set("gender",e.target.value)}>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Age</label>
              <input style={inputStyle} type="number" placeholder="e.g. 35" value={form.age} onChange={e=>set("age",e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} placeholder="+1 (555) 000-0000" value={form.phone} onChange={e=>set("phone",e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Blood Group</label>
              <select style={inputStyle} value={form.blood} onChange={e=>set("blood",e.target.value)}>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Department</label>
              <input style={inputStyle} placeholder="e.g. Cardiology" value={form.dept} onChange={e=>set("dept",e.target.value)} />
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select style={inputStyle} value={form.status} onChange={e=>set("status",e.target.value)}>
                <option>Admitted</option><option>Outpatient</option><option>Critical</option><option>Discharged</option>
              </select>
            </div>
          </div>

          <div style={{ display:"flex", gap:"10px", marginTop:"24px", justifyContent:"flex-end" }}>
            <button onClick={onClose} style={{ padding:"10px 20px", fontSize:"13.5px", fontWeight:500, border:"1.5px solid #E5E7EB", borderRadius:"9px", background:"white", color:"#374151", cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={onClose} style={{ padding:"10px 22px", fontSize:"13.5px", fontWeight:600, border:"none", borderRadius:"9px", background:"linear-gradient(135deg,#1D4ED8,#2563EB)", color:"white", cursor:"pointer", boxShadow:"0 2px 8px rgba(37,99,235,0.3)" }}>
              Save Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ patient, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.45)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ background:"white", borderRadius:"16px", width:"100%", maxWidth:"380px", padding:"28px", boxShadow:"0 25px 60px rgba(0,0,0,0.2)", textAlign:"center" }}>
        <div style={{ width:"56px", height:"56px", borderRadius:"50%", background:"#FEE2E2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:"24px" }}>🗑️</div>
        <h3 style={{ fontSize:"16px", fontWeight:700, color:"#0F172A", margin:"0 0 8px" }}>Delete Patient Record</h3>
        <p style={{ fontSize:"13.5px", color:"#64748B", margin:"0 0 24px", lineHeight:1.6 }}>
          Are you sure you want to delete <strong style={{color:"#0F172A"}}>{patient?.name}</strong>? This action cannot be undone.
        </p>
        <div style={{ display:"flex", gap:"10px" }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", fontSize:"13.5px", fontWeight:500, border:"1.5px solid #E5E7EB", borderRadius:"9px", background:"white", color:"#374151", cursor:"pointer" }}>Cancel</button>
          <button onClick={onClose} style={{ flex:1, padding:"10px", fontSize:"13.5px", fontWeight:600, border:"none", borderRadius:"9px", background:"#DC2626", color:"white", cursor:"pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function ViewModal({ patient, onClose }) {
  if (!patient) return null;
  const sc = STATUS_CONFIG[patient.status];
  const ac = avatarColor(patient.name);
  const rows = [
    ["Patient ID", patient.id], ["Department", patient.dept],
    ["Blood Group", patient.blood], ["Date Joined", patient.joined],
    ["Phone", patient.phone], ["Age", `${patient.age} years`],
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.45)", zIndex:50, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
      <div style={{ background:"white", borderRadius:"18px", width:"100%", maxWidth:"480px", boxShadow:"0 25px 60px rgba(0,0,0,0.2)", overflow:"hidden" }}>
        <div style={{ background:"linear-gradient(135deg,#0F172A,#1E293B)", padding:"28px", textAlign:"center" }}>
          <div style={{ width:"64px", height:"64px", borderRadius:"50%", background:ac, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:"22px", margin:"0 auto 12px", border:"3px solid rgba(255,255,255,0.2)" }}>
            {initials(patient.name)}
          </div>
          <h2 style={{ color:"white", fontSize:"18px", fontWeight:700, margin:"0 0 4px" }}>{patient.name}</h2>
          <p style={{ color:"#94A3B8", fontSize:"13px", margin:"0 0 12px" }}>{patient.gender} · {patient.age} years old</p>
          <span style={{ fontSize:"12px", fontWeight:600, background:sc.bg, color:sc.color, padding:"4px 12px", borderRadius:"20px" }}>{patient.status}</span>
          <button onClick={onClose} style={{ position:"absolute", top:"16px", right:"16px", background:"rgba(255,255,255,0.1)", border:"none", color:"white", width:"30px", height:"30px", borderRadius:"8px", cursor:"pointer", fontSize:"15px" }}>✕</button>
        </div>
        <div style={{ padding:"24px 28px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
            {rows.map(([label, val]) => (
              <div key={label} style={{ background:"#F8FAFC", borderRadius:"10px", padding:"12px 14px", border:"1px solid #F1F5F9" }}>
                <div style={{ fontSize:"11px", color:"#94A3B8", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:"4px" }}>{label}</div>
                <div style={{ fontSize:"13.5px", fontWeight:600, color:"#0F172A" }}>{val}</div>
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{ width:"100%", marginTop:"20px", padding:"11px", fontSize:"13.5px", fontWeight:600, border:"none", borderRadius:"9px", background:"linear-gradient(135deg,#1D4ED8,#2563EB)", color:"white", cursor:"pointer" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Patients() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [genderFilter, setGenderFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [viewTarget, setViewTarget] = useState(null);
  const [sortCol, setSortCol] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
  };

  const filtered = useMemo(() => {
    let data = PATIENTS_RAW.filter(p => {
      const q = search.toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.phone.includes(q) || p.dept.toLowerCase().includes(q);
      const matchS = statusFilter === "All" || p.status === statusFilter;
      const matchG = genderFilter === "All" || p.gender === genderFilter;
      return matchQ && matchS && matchG;
    });
    data = [...data].sort((a,b) => {
      let av = a[sortCol], bv = b[sortCol];
      if (typeof av === "string") av = av.toLowerCase(), bv = bv.toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [search, statusFilter, genderFilter, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const safeSetPage = (p) => setPage(Math.min(Math.max(1,p), totalPages));

  const statusCounts = useMemo(() => {
    const counts = { All: PATIENTS_RAW.length };
    for (const p of PATIENTS_RAW) counts[p.status] = (counts[p.status]||0)+1;
    return counts;
  }, []);

  const SortIcon = ({ col }) => {
    const active = sortCol === col;
    return (
      <span style={{ marginLeft:"4px", opacity: active ? 1 : 0.35, fontSize:"10px", color: active ? "#2563EB" : "#9CA3AF" }}>
        {active && sortDir === "desc" ? "▼" : "▲"}
      </span>
    );
  };

  const thStyle = (col) => ({
    padding:"12px 16px", textAlign:"left", fontWeight:600, color:"#64748B",
    fontSize:"11.5px", textTransform:"uppercase", letterSpacing:"0.05em",
    cursor:"pointer", whiteSpace:"nowrap", userSelect:"none",
    background: sortCol === col ? "#F0F7FF" : "#F8FAFC",
    borderBottom:"1px solid #E5E7EB",
  });

  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("Patients");
  const [activeTab, setActiveTab] = useState("All");


  return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9", fontFamily:"'DM Sans','Segoe UI',sans-serif", display:"flex", padding:"0" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} activePage={activePage} setActivePage={setActivePage} />
      {/* Modals */}
      {showAdd && <AddPatientModal onClose={() => setShowAdd(false)} />}
      {deleteTarget && <DeleteModal patient={deleteTarget} onClose={() => setDeleteTarget(null)} />}
      {viewTarget && <ViewModal patient={viewTarget} onClose={() => setViewTarget(null)} />}
      {/* Page top */}
      <div>
      <div style={{ display:"flex", justifyContent:"space-between", background:"white", borderBottom:"1px solid #E5E7EB", padding:"20px 28px", alignItems:"center", }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"2px" }}>
            <span style={{ fontSize:"18px" }}>👥</span>
            <h1 style={{ fontSize:"20px", fontWeight:700, color:"#0F172A", margin:0, letterSpacing:"-0.4px" }}>Patient Management</h1>
          </div>
          <p style={{ fontSize:"13px", color:"#64748B", margin:0 }}>
            {filtered.length} patient{filtered.length !== 1 ? "s" : ""} found · Page {page} of {totalPages}
          </p>
        </div>
        <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
          <button style={{ padding:"9px 16px", fontSize:"13px", fontWeight:500, border:"1px solid #E5E7EB", borderRadius:"9px", background:"white", color:"#374151", cursor:"pointer", display:"flex", alignItems:"center", gap:"6px" }}>
            📥 Export
          </button>
          <button onClick={() => setShowAdd(true)} style={{ padding:"9px 18px", fontSize:"13.5px", fontWeight:600, border:"none", borderRadius:"9px", background:"linear-gradient(135deg,#1D4ED8,#2563EB)", color:"white", cursor:"pointer", display:"flex", alignItems:"center", gap:"7px", boxShadow:"0 2px 8px rgba(37,99,235,0.3)" }}>
            <span style={{ fontSize:"16px" }}>+</span> Add Patient
          </button>
        </div>
      </div>

      <div style={{ padding:"24px 28px" }}>

        {/* Summary pills */}
        <div style={{ display:"flex", gap:"10px", flexWrap:"wrap", marginBottom:"20px" }}>
          {["All","Admitted","Outpatient","Critical","Discharged"].map(s => {
            const sc = s !== "All" ? STATUS_CONFIG[s] : null;
            const isActive = statusFilter === s;
            return (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }} style={{
                padding:"8px 16px", fontSize:"13px", fontWeight:isActive?600:500, borderRadius:"30px",
                border: isActive ? "none" : "1px solid #E5E7EB",
                background: isActive ? (sc ? sc.bg : "#DBEAFE") : "white",
                color: isActive ? (sc ? sc.color : "#1D4ED8") : "#64748B",
                cursor:"pointer", display:"flex", alignItems:"center", gap:"7px",
                boxShadow: isActive ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                transition:"all 0.15s",
              }}>
                {sc && isActive && <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:sc.dot, display:"inline-block" }} />}
                {s}
                <span style={{ fontSize:"11px", fontWeight:700, background: isActive ? "rgba(0,0,0,0.08)" : "#F1F5F9", padding:"1px 7px", borderRadius:"20px" }}>
                  {statusCounts[s] || 0}
                </span>
              </button>
            );
          })}
        </div>

        {/* Toolbar */}
        <div style={{ background:"white", borderRadius:"12px", border:"1px solid #E5E7EB", padding:"14px 18px", marginBottom:"16px", display:"flex", gap:"12px", alignItems:"center", flexWrap:"wrap" }}>
          {/* Search */}
          <div style={{ flex:1, minWidth:"220px", position:"relative" }}>
            <span style={{ position:"absolute", left:"11px", top:"50%", transform:"translateY(-50%)", color:"#9CA3AF", fontSize:"15px" }}>🔍</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, ID, phone, department…"
              style={{ width:"100%", padding:"9px 12px 9px 36px", fontSize:"13.5px", border:"1.5px solid #E5E7EB", borderRadius:"9px", background:"#F9FAFB", color:"#111827", outline:"none", boxSizing:"border-box" }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position:"absolute", right:"10px", top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:"16px" }}>✕</button>
            )}
          </div>

          {/* Gender filter */}
          <div style={{ display:"flex", gap:"6px" }}>
            {["All","Male","Female"].map(g => (
              <button key={g} onClick={() => { setGenderFilter(g); setPage(1); }} style={{
                padding:"8px 14px", fontSize:"12.5px", fontWeight:genderFilter===g?600:500, borderRadius:"8px",
                border:"1px solid #E5E7EB",
                background: genderFilter===g ? "#EFF6FF" : "white",
                color: genderFilter===g ? "#1D4ED8" : "#64748B",
                cursor:"pointer", transition:"all 0.15s",
              }}>
                {g === "Male" ? "♂ " : g === "Female" ? "♀ " : ""}{g}
              </button>
            ))}
          </div>

          <div style={{ height:"32px", width:"1px", background:"#E5E7EB" }} />

          <span style={{ fontSize:"12.5px", color:"#94A3B8", whiteSpace:"nowrap" }}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Table */}
        <div style={{ background:"white", borderRadius:"14px", border:"1px solid #E5E7EB", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,0.04)" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:"13.5px" }}>
              <thead>
                <tr>
                  {[["id","Patient ID"],["name","Patient"],["gender","Gender"],["age","Age"],["phone","Phone"],["dept","Department"],["blood","Blood"],["status","Status"]].map(([col, label]) => (
                    <th key={col} style={thStyle(col)} onClick={() => handleSort(col)}>
                      {label}<SortIcon col={col} />
                    </th>
                  ))}
                  <th style={{ ...thStyle(""), cursor:"default" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding:"60px", textAlign:"center", color:"#94A3B8" }}>
                      <div style={{ fontSize:"36px", marginBottom:"12px" }}>🔍</div>
                      <div style={{ fontSize:"15px", fontWeight:500, color:"#64748B" }}>No patients found</div>
                      <div style={{ fontSize:"13px", marginTop:"4px" }}>Try adjusting your search or filters</div>
                    </td>
                  </tr>
                ) : paginated.map((p, i) => {
                  const sc = STATUS_CONFIG[p.status];
                  const gc = GENDER_CONFIG[p.gender] || GENDER_CONFIG["Male"];
                  const ac = avatarColor(p.name);
                  return (
                    <tr key={p.id}
                      style={{ borderTop:"1px solid #F1F5F9", animation:`fadeIn 0.25s ease both`, animationDelay:`${i*30}ms`, transition:"background 0.1s" }}
                      onMouseOver={e => e.currentTarget.style.background="#F8FAFC"}
                      onMouseOut={e => e.currentTarget.style.background="transparent"}
                    >
                      <td style={{ padding:"13px 16px" }}>
                        <span style={{ fontSize:"12.5px", fontWeight:600, color:"#2563EB", fontFamily:"monospace" }}>{p.id}</span>
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
                          <div style={{ width:"34px", height:"34px", borderRadius:"50%", background:ac, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontWeight:700, fontSize:"12px", flexShrink:0 }}>
                            {initials(p.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight:600, color:"#0F172A" }}>{p.name}</div>
                            <div style={{ fontSize:"11.5px", color:"#94A3B8" }}>Joined {p.joined}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        <span style={{ fontSize:"12px", fontWeight:500, background:gc.bg, color:gc.color, padding:"3px 10px", borderRadius:"20px" }}>
                          {p.gender === "Male" ? "♂" : "♀"} {p.gender}
                        </span>
                      </td>
                      <td style={{ padding:"13px 16px", fontWeight:600, color:"#374151" }}>{p.age}</td>
                      <td style={{ padding:"13px 16px", color:"#374151" }}>{p.phone}</td>
                      <td style={{ padding:"13px 16px" }}>
                        <span style={{ fontSize:"12px", background:"#EFF6FF", color:"#1D4ED8", padding:"3px 10px", borderRadius:"20px", fontWeight:500 }}>{p.dept}</span>
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        <span style={{ fontSize:"12px", fontWeight:700, background:BLOOD_COLORS[p.blood]||"#F3F4F6", color:BLOOD_TEXT[p.blood]||"#374151", padding:"3px 9px", borderRadius:"6px", fontFamily:"monospace" }}>{p.blood}</span>
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", fontSize:"12px", fontWeight:600, background:sc.bg, color:sc.color, padding:"4px 10px", borderRadius:"20px" }}>
                          <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:sc.dot, display:"inline-block" }} />
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding:"13px 16px" }}>
                        <div style={{ display:"flex", gap:"6px" }}>
                          <button onClick={() => setViewTarget(p)} title="View" style={{ width:"30px", height:"30px", borderRadius:"7px", border:"1px solid #DBEAFE", background:"#EFF6FF", color:"#2563EB", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>👁</button>
                          <button title="Edit" style={{ width:"30px", height:"30px", borderRadius:"7px", border:"1px solid #D1FAE5", background:"#ECFDF5", color:"#059669", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>✏️</button>
                          <button onClick={() => setDeleteTarget(p)} title="Delete" style={{ width:"30px", height:"30px", borderRadius:"7px", border:"1px solid #FEE2E2", background:"#FEF2F2", color:"#DC2626", cursor:"pointer", fontSize:"14px", display:"flex", alignItems:"center", justifyContent:"center" }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ padding:"14px 20px", borderTop:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"12px" }}>
            <span style={{ fontSize:"12.5px", color:"#64748B" }}>
              Showing <strong style={{color:"#0F172A"}}>{Math.min((page-1)*PAGE_SIZE+1, filtered.length)}–{Math.min(page*PAGE_SIZE, filtered.length)}</strong> of <strong style={{color:"#0F172A"}}>{filtered.length}</strong> patients
            </span>

            <div style={{ display:"flex", gap:"6px", alignItems:"center" }}>
              <button onClick={() => safeSetPage(1)} disabled={page===1} style={{ padding:"6px 10px", fontSize:"12px", fontWeight:500, border:"1px solid #E5E7EB", borderRadius:"7px", background:page===1?"#F8FAFC":"white", color:page===1?"#CBD5E1":"#374151", cursor:page===1?"default":"pointer" }}>«</button>
              <button onClick={() => safeSetPage(page-1)} disabled={page===1} style={{ padding:"6px 12px", fontSize:"12px", fontWeight:500, border:"1px solid #E5E7EB", borderRadius:"7px", background:page===1?"#F8FAFC":"white", color:page===1?"#CBD5E1":"#374151", cursor:page===1?"default":"pointer" }}>‹ Prev</button>

              {Array.from({length: totalPages}, (_,i)=>i+1)
                .filter(n => n===1 || n===totalPages || Math.abs(n-page)<=1)
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && arr[idx-1] !== n-1) acc.push("...");
                  acc.push(n);
                  return acc;
                }, [])
                .map((item, idx) =>
                  item === "..." ? (
                    <span key={`ellipsis-${idx}`} style={{ padding:"6px 8px", fontSize:"12px", color:"#94A3B8" }}>…</span>
                  ) : (
                    <button key={item} onClick={() => safeSetPage(item)} style={{
                      width:"34px", height:"32px", fontSize:"12.5px", fontWeight:item===page?700:500,
                      border: item===page ? "none" : "1px solid #E5E7EB",
                      borderRadius:"7px",
                      background: item===page ? "#2563EB" : "white",
                      color: item===page ? "white" : "#374151",
                      cursor:"pointer",
                      boxShadow: item===page ? "0 1px 4px rgba(37,99,235,0.3)" : "none",
                    }}>{item}</button>
                  )
                )
              }

              <button onClick={() => safeSetPage(page+1)} disabled={page===totalPages} style={{ padding:"6px 12px", fontSize:"12px", fontWeight:500, border:"1px solid #E5E7EB", borderRadius:"7px", background:page===totalPages?"#F8FAFC":"white", color:page===totalPages?"#CBD5E1":"#374151", cursor:page===totalPages?"default":"pointer" }}>Next ›</button>
              <button onClick={() => safeSetPage(totalPages)} disabled={page===totalPages} style={{ padding:"6px 10px", fontSize:"12px", fontWeight:500, border:"1px solid #E5E7EB", borderRadius:"7px", background:page===totalPages?"#F8FAFC":"white", color:page===totalPages?"#CBD5E1":"#374151", cursor:page===totalPages?"default":"pointer" }}>»</button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing:border-box; margin:0; padding:0; }
        input::placeholder { color:#CBD5E1; }
        ::-webkit-scrollbar { width:4px; height:4px; }
        ::-webkit-scrollbar-thumb { background:#E2E8F0; border-radius:4px; }
      `}</style>
      </div>
    </div>
  );
}