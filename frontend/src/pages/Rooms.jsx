import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

// ── Enums ─────────────────────────────────────────────────────────────────
const RoomType   = ["General","ICU","Private","Semi-Private","Operating","Emergency","Pediatric","Maternity"];
const RoomStatus = ["Available","Occupied","Under Maintenance","Reserved"];

// ── Config ────────────────────────────────────────────────────────────────
const TYPE_CFG = {
  General:        { icon:"🛏", color:"#2563EB", bg:"#EFF6FF", border:"#BFDBFE" },
  ICU:            { icon:"🫀", color:"#DC2626", bg:"#FEF2F2", border:"#FECACA" },
  Private:        { icon:"🏠", color:"#7C3AED", bg:"#F5F3FF", border:"#DDD6FE" },
  "Semi-Private": { icon:"🛋", color:"#0891B2", bg:"#ECFEFF", border:"#A5F3FC" },
  Operating:      { icon:"⚕",  color:"#059669", bg:"#ECFDF5", border:"#A7F3D0" },
  Emergency:      { icon:"🚨", color:"#EA580C", bg:"#FFF7ED", border:"#FED7AA" },
  Pediatric:      { icon:"🧒", color:"#DB2777", bg:"#FDF2F8", border:"#FBCFE8" },
  Maternity:      { icon:"🤱", color:"#65A30D", bg:"#F7FEE7", border:"#D9F99D" },
};
const STATUS_CFG = {
  Available:          { color:"#059669", bg:"#DCFCE7", dot:"#16A34A", border:"#BBF7D0" },
  Occupied:           { color:"#1D4ED8", bg:"#DBEAFE", dot:"#2563EB", border:"#BFDBFE" },
  "Under Maintenance":{ color:"#92400E", bg:"#FEF3C7", dot:"#D97706", border:"#FDE68A" },
  Reserved:           { color:"#6B21A8", bg:"#F3E8FF", dot:"#9333EA", border:"#E9D5FF" },
};
const FLOOR_LABELS = { 1:"Ground Floor",2:"1st Floor",3:"2nd Floor",4:"3rd Floor",5:"4th Floor" };

// ── Seed data ─────────────────────────────────────────────────────────────
let nextId = 19;
const SEED = [
  { roomId:1,  roomNumber:"G-101", floor:1, type:"General",        status:"Occupied",           capacity:4, occupied:3, pricePerDay:120, wing:"North" },
  { roomId:2,  roomNumber:"G-102", floor:1, type:"General",        status:"Available",          capacity:4, occupied:0, pricePerDay:120, wing:"North" },
  { roomId:3,  roomNumber:"G-201", floor:2, type:"Private",        status:"Occupied",           capacity:1, occupied:1, pricePerDay:280, wing:"East"  },
  { roomId:4,  roomNumber:"ICU-1", floor:3, type:"ICU",            status:"Occupied",           capacity:2, occupied:2, pricePerDay:850, wing:"West"  },
  { roomId:5,  roomNumber:"ICU-2", floor:3, type:"ICU",            status:"Available",          capacity:2, occupied:0, pricePerDay:850, wing:"West"  },
  { roomId:6,  roomNumber:"OP-01", floor:4, type:"Operating",      status:"Reserved",           capacity:1, occupied:0, pricePerDay:1200,wing:"South" },
  { roomId:7,  roomNumber:"EM-01", floor:1, type:"Emergency",      status:"Occupied",           capacity:3, occupied:3, pricePerDay:400, wing:"South" },
  { roomId:8,  roomNumber:"S-301", floor:2, type:"Semi-Private",   status:"Available",          capacity:2, occupied:0, pricePerDay:180, wing:"East"  },
  { roomId:9,  roomNumber:"P-401", floor:3, type:"Pediatric",      status:"Occupied",           capacity:3, occupied:2, pricePerDay:220, wing:"North" },
  { roomId:10, roomNumber:"M-501", floor:4, type:"Maternity",      status:"Reserved",           capacity:2, occupied:0, pricePerDay:350, wing:"East"  },
  { roomId:11, roomNumber:"G-103", floor:1, type:"General",        status:"Under Maintenance",  capacity:4, occupied:0, pricePerDay:120, wing:"North" },
  { roomId:12, roomNumber:"G-202", floor:2, type:"General",        status:"Occupied",           capacity:4, occupied:4, pricePerDay:120, wing:"South" },
  { roomId:13, roomNumber:"PR-01", floor:3, type:"Private",        status:"Available",          capacity:1, occupied:0, pricePerDay:280, wing:"West"  },
  { roomId:14, roomNumber:"OP-02", floor:4, type:"Operating",      status:"Under Maintenance",  capacity:1, occupied:0, pricePerDay:1200,wing:"South" },
  { roomId:15, roomNumber:"P-402", floor:3, type:"Pediatric",      status:"Available",          capacity:3, occupied:0, pricePerDay:220, wing:"North" },
  { roomId:16, roomNumber:"EM-02", floor:1, type:"Emergency",      status:"Reserved",           capacity:3, occupied:0, pricePerDay:400, wing:"South" },
  { roomId:17, roomNumber:"S-302", floor:2, type:"Semi-Private",   status:"Occupied",           capacity:2, occupied:1, pricePerDay:180, wing:"West"  },
  { roomId:18, roomNumber:"M-502", floor:4, type:"Maternity",      status:"Occupied",           capacity:2, occupied:2, pricePerDay:350, wing:"East"  },
];

const CHART_COLORS = ["#2563EB","#DC2626","#7C3AED","#059669","#EA580C","#0891B2","#DB2777","#65A30D"];

// ── Helpers ───────────────────────────────────────────────────────────────
const occupancyPct = (r) => r.capacity > 0 ? Math.round((r.occupied / r.capacity)*100) : 0;

// ── Animated counter ──────────────────────────────────────────────────────
function AnimNum({ val, prefix="", suffix="" }) {
  const [disp, setDisp] = useState(0);
  useEffect(() => {
    let start = 0, end = val, dur = 600, step = Math.ceil(end/30);
    const t = setInterval(() => { start += step; if(start >= end){ setDisp(end); clearInterval(t); } else setDisp(start); }, dur/30);
    return () => clearInterval(t);
  }, [val]);
  return <>{prefix}{disp.toLocaleString()}{suffix}</>;
}

// ── Custom Tooltip ────────────────────────────────────────────────────────
const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0F172A", border:"1px solid #1E293B", borderRadius:10, padding:"10px 14px", fontSize:12.5, color:"white" }}>
      <p style={{ fontWeight:700, marginBottom:4, color:"#94A3B8" }}>{label}</p>
      {payload.map((p,i) => (
        <p key={i} style={{ color:p.color||"white", margin:"2px 0" }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  );
};

// ── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color, bg, delay=0 }) {
  return (
    <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"18px 20px",
                  boxShadow:"0 1px 4px rgba(0,0,0,.04)",
                  animation:`fadeUp .45s ease both`, animationDelay:`${delay}ms`,
                  transition:"box-shadow .2s, transform .2s", cursor:"default" }}
      onMouseOver={e=>{ e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.09)"; e.currentTarget.style.transform="translateY(-2px)"; }}
      onMouseOut={e=>{ e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.04)"; e.currentTarget.style.transform="none"; }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          <p style={{ fontSize:11, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".07em", margin:"0 0 8px" }}>{label}</p>
          <p style={{ fontSize:28, fontWeight:800, color:"#0F172A", margin:"0 0 4px", letterSpacing:"-.5px", lineHeight:1 }}>{value}</p>
          <p style={{ fontSize:12, color:"#94A3B8", margin:0 }}>{sub}</p>
        </div>
        <div style={{ width:46, height:46, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{icon}</div>
      </div>
    </div>
  );
}

// ── Room Modal (Add / Edit) ────────────────────────────────────────────────
function RoomModal({ mode, initial, onSave, onClose }) {
  const blank = { roomNumber:"", floor:1, type:"General", status:"Available", capacity:2, occupied:0, pricePerDay:150, wing:"North" };
  const [form, setForm] = useState(mode==="edit" ? {...initial} : blank);
  const [errs, setErrs] = useState({});
  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrs(e=>({...e,[k]:""})); };

  const validate = () => {
    const e={};
    if(!form.roomNumber.trim()) e.roomNumber="Room number required";
    if(!form.type)              e.type="Type required";
    if(!form.status)            e.status="Status required";
    if(form.capacity<1)         e.capacity="Capacity ≥ 1";
    if(form.occupied<0||form.occupied>form.capacity) e.occupied=`Occupied must be 0–${form.capacity}`;
    if(form.pricePerDay<=0)     e.pricePerDay="Price must be > 0";
    return e;
  };

  const submit = () => {
    const e = validate();
    if(Object.keys(e).length){ setErrs(e); return; }
    onSave(form);
  };

  const LBL  = { fontSize:11, fontWeight:700, color:"#475569", display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:".07em" };
  const INP  = (err,extra={}) => ({ width:"100%", padding:"9px 12px", fontSize:13.5, fontFamily:"inherit",
    border:`1.5px solid ${err?"#FCA5A5":"#E2E8F0"}`, borderRadius:9, background:err?"#FFF5F5":"#F8FAFC",
    color:"#0F172A", outline:"none", boxSizing:"border-box", ...extra });

  const tc = TYPE_CFG[form.type] || {};

  

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.6)", zIndex:200,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:16,
                  backdropFilter:"blur(3px)", animation:"fadeIn .2s ease" }}>

      <div style={{ background:"white", borderRadius:18, width:"100%", maxWidth:560,
                    maxHeight:"90vh", overflowY:"auto",
                    boxShadow:"0 32px 80px rgba(0,0,0,.25)", animation:"slideUp .25s cubic-bezier(.16,1,.3,1)" }}>
        
        {/* Header */}
        <div style={{ background: mode==="edit"
            ? "linear-gradient(135deg,#0F172A,#1E3A5F)"
            : "linear-gradient(135deg,#1D4ED8,#2563EB,#0EA5E9)",
            padding:"22px 28px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", position:"sticky", top:0 }}>
          <div>
            <p style={{ margin:"0 0 3px", fontSize:10.5, fontWeight:700, color:"rgba(255,255,255,.5)", textTransform:"uppercase", letterSpacing:".1em" }}>
              {mode==="edit" ? `ROOM ${initial.roomNumber}` : "NEW ROOM"}
            </p>
            <h2 style={{ margin:0, color:"white", fontSize:18, fontWeight:800, letterSpacing:"-.3px" }}>
              {mode==="edit" ? "Edit Room" : "Add New Room"}
            </h2>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"white",
              width:32, height:32, borderRadius:8, cursor:"pointer", fontSize:17,
              display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        <div style={{ padding:"24px 28px", display:"flex", flexDirection:"column", gap:16 }}>
          {/* Row 1: roomNumber + floor */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <label style={LBL}>Room Number <span style={{color:"#EF4444"}}>*</span></label>
              <input style={INP(errs.roomNumber)} value={form.roomNumber} placeholder="e.g. G-101"
                onChange={e=>set("roomNumber",e.target.value)} />
              {errs.roomNumber && <p style={{fontSize:11.5,color:"#EF4444",margin:"4px 0 0"}}>{errs.roomNumber}</p>}
            </div>
            <div>
              <label style={LBL}>Floor</label>
              <select style={INP(false)} value={form.floor} onChange={e=>set("floor",Number(e.target.value))}>
                {[1,2,3,4,5].map(f=><option key={f} value={f}>{FLOOR_LABELS[f]}</option>)}
              </select>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label style={LBL}>Room Type <span style={{color:"#EF4444"}}>*</span></label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
              {RoomType.map(t=>{
                const cfg=TYPE_CFG[t]; const active=form.type===t;
                return (
                  <button key={t} onClick={()=>set("type",t)} style={{
                    padding:"9px 4px", fontSize:11.5, fontWeight:active?700:500, borderRadius:10, cursor:"pointer",
                    border:`1.5px solid ${active?cfg.border:"#E2E8F0"}`,
                    background:active?cfg.bg:"#F8FAFC", color:active?cfg.color:"#64748B",
                    boxShadow:active?`0 0 0 3px ${cfg.border}66`:"none",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:4, transition:"all .15s",
                  }}>
                    <span style={{fontSize:18}}>{cfg.icon}</span>{t}
                  </button>
                );
              })}
            </div>
            {errs.type && <p style={{fontSize:11.5,color:"#EF4444",margin:"4px 0 0"}}>{errs.type}</p>}
          </div>

          {/* Status */}
          <div>
            <label style={LBL}>Status <span style={{color:"#EF4444"}}>*</span></label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
              {RoomStatus.map(s=>{
                const cfg=STATUS_CFG[s]; const active=form.status===s;
                return (
                  <button key={s} onClick={()=>set("status",s)} style={{
                    padding:"9px 12px", fontSize:12.5, fontWeight:active?700:500, borderRadius:10, cursor:"pointer",
                    border:`1.5px solid ${active?cfg.border:"#E2E8F0"}`,
                    background:active?cfg.bg:"#F8FAFC", color:active?cfg.color:"#64748B",
                    boxShadow:active?`0 0 0 3px ${cfg.border}55`:"none",
                    display:"flex", alignItems:"center", gap:7, transition:"all .15s",
                  }}>
                    <span style={{width:8,height:8,borderRadius:"50%",background:active?cfg.dot:"#CBD5E1",display:"inline-block"}}/>
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row: capacity, occupied, price, wing */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
            <div>
              <label style={LBL}>Capacity <span style={{color:"#EF4444"}}>*</span></label>
              <input type="number" min={1} max={20} style={INP(errs.capacity)} value={form.capacity}
                onChange={e=>set("capacity",Number(e.target.value))} />
              {errs.capacity && <p style={{fontSize:11.5,color:"#EF4444",margin:"4px 0 0"}}>{errs.capacity}</p>}
            </div>
            <div>
              <label style={LBL}>Occupied Beds</label>
              <input type="number" min={0} max={form.capacity} style={INP(errs.occupied)} value={form.occupied}
                onChange={e=>set("occupied",Number(e.target.value))} />
              {errs.occupied && <p style={{fontSize:11.5,color:"#EF4444",margin:"4px 0 0"}}>{errs.occupied}</p>}
            </div>
            <div>
              <label style={LBL}>Price / Day ($) <span style={{color:"#EF4444"}}>*</span></label>
              <input type="number" min={1} style={INP(errs.pricePerDay)} value={form.pricePerDay}
                onChange={e=>set("pricePerDay",Number(e.target.value))} />
              {errs.pricePerDay && <p style={{fontSize:11.5,color:"#EF4444",margin:"4px 0 0"}}>{errs.pricePerDay}</p>}
            </div>
            <div>
              <label style={LBL}>Wing</label>
              <select style={INP(false)} value={form.wing} onChange={e=>set("wing",e.target.value)}>
                {["North","South","East","West"].map(w=><option key={w}>{w}</option>)}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end", marginTop:4 }}>
            <button onClick={onClose} style={{ padding:"10px 20px", fontSize:13.5, fontWeight:600,
                border:"1.5px solid #E2E8F0", borderRadius:9, background:"white", color:"#475569", cursor:"pointer" }}>Cancel</button>
            <button onClick={submit} style={{ padding:"10px 26px", fontSize:13.5, fontWeight:700,
                border:"none", borderRadius:9, cursor:"pointer", color:"white",
                background: mode==="edit" ? "linear-gradient(135deg,#0F172A,#1E3A5F)" : "linear-gradient(135deg,#1D4ED8,#2563EB)",
                boxShadow: mode==="edit" ? "0 3px 10px rgba(15,23,42,.35)" : "0 3px 10px rgba(37,99,235,.35)" }}>
              {mode==="edit" ? "💾 Save Changes" : "✓ Add Room"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
function DeleteModal({ room, onConfirm, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.6)", zIndex:200,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:16,
                  backdropFilter:"blur(3px)", animation:"fadeIn .18s ease" }}>
      <div style={{ background:"white", borderRadius:16, width:"100%", maxWidth:360, padding:"32px 28px",
                    boxShadow:"0 28px 72px rgba(0,0,0,.2)", textAlign:"center",
                    animation:"slideUp .22s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ width:58, height:58, borderRadius:"50%", background:"#FEE2E2", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:26 }}>🗑️</div>
        <h3 style={{ fontSize:17, fontWeight:800, color:"#0F172A", margin:"0 0 8px" }}>Delete Room</h3>
        <p style={{ fontSize:13.5, color:"#64748B", margin:"0 0 4px", lineHeight:1.6 }}>You're about to permanently delete</p>
        <p style={{ fontSize:15, fontWeight:800, color:"#DC2626", margin:"0 0 24px" }}>Room {room.roomNumber}</p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", fontSize:13.5, fontWeight:600, border:"1.5px solid #E2E8F0", borderRadius:9, background:"white", color:"#475569", cursor:"pointer" }}>Cancel</button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px", fontSize:13.5, fontWeight:700, border:"none", borderRadius:9, background:"linear-gradient(135deg,#DC2626,#EF4444)", color:"white", cursor:"pointer" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ── View Modal ─────────────────────────────────────────────────────────────
function ViewModal({ room, onClose, onEdit }) {
  const tc = TYPE_CFG[room.type]   || {};
  const sc = STATUS_CFG[room.status] || {};
  const pct = occupancyPct(room);
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,.6)", zIndex:200,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:16,
                  backdropFilter:"blur(3px)", animation:"fadeIn .18s ease" }}>
      <div style={{ background:"white", borderRadius:18, width:"100%", maxWidth:420,
                    boxShadow:"0 28px 72px rgba(0,0,0,.2)", overflow:"hidden",
                    animation:"slideUp .22s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ background:"linear-gradient(135deg,#0F172A,#1E293B)", padding:"28px 26px", textAlign:"center", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,.1)", border:"none", color:"white", width:30, height:30, borderRadius:8, cursor:"pointer", fontSize:15, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ width:64, height:64, borderRadius:"50%", background:tc.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 12px", border:`2px solid ${tc.border}` }}>{tc.icon}</div>
          <h2 style={{ color:"white", fontSize:20, fontWeight:800, margin:"0 0 4px" }}>Room {room.roomNumber}</h2>
          <p style={{ color:"rgba(255,255,255,.5)", fontSize:12.5, margin:"0 0 12px" }}>{FLOOR_LABELS[room.floor]} · {room.wing} Wing</p>
          <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap" }}>
            <span style={{ fontSize:12, fontWeight:700, background:tc.bg, color:tc.color, border:`1px solid ${tc.border}`, padding:"3px 12px", borderRadius:20 }}>{tc.icon} {room.type}</span>
            <span style={{ fontSize:12, fontWeight:700, background:sc.bg, color:sc.color, padding:"3px 12px", borderRadius:20 }}>{room.status}</span>
          </div>
        </div>
        <div style={{ padding:"20px 26px" }}>
          {/* Occupancy bar */}
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
              <span style={{ fontSize:12, fontWeight:600, color:"#64748B" }}>Occupancy</span>
              <span style={{ fontSize:12, fontWeight:700, color:"#0F172A" }}>{room.occupied}/{room.capacity} beds ({pct}%)</span>
            </div>
            <div style={{ height:8, background:"#F1F5F9", borderRadius:8, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background: pct>80?"#DC2626":pct>50?"#D97706":"#059669", borderRadius:8, transition:"width .6s ease" }} />
            </div>
          </div>
          {[["Room ID",`#${room.roomId}`],["Room Number",room.roomNumber],["Floor",FLOOR_LABELS[room.floor]],["Wing",`${room.wing} Wing`],["Type",room.type],["Status",room.status],["Capacity",`${room.capacity} beds`],["Price/Day",`$${room.pricePerDay.toLocaleString()}`]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid #F1F5F9" }}>
              <span style={{ fontSize:11.5, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".05em" }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#0F172A" }}>{v}</span>
            </div>
          ))}
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <button onClick={onClose} style={{ flex:1, padding:"10px", fontSize:13.5, fontWeight:600, border:"1.5px solid #E2E8F0", borderRadius:9, background:"white", color:"#475569", cursor:"pointer" }}>Close</button>
            <button onClick={onEdit} style={{ flex:1, padding:"10px", fontSize:13.5, fontWeight:700, border:"none", borderRadius:9, background:"linear-gradient(135deg,#1D4ED8,#2563EB)", color:"white", cursor:"pointer" }}>✏️ Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Occupancy bar in table ─────────────────────────────────────────────────
function OccBar({ room }) {
  const pct = occupancyPct(room);
  const col = pct>80?"#DC2626":pct>50?"#D97706":"#059669";
  return (
    <div style={{ minWidth:80 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:11, color:"#64748B" }}>{room.occupied}/{room.capacity}</span>
        <span style={{ fontSize:11, fontWeight:700, color:col }}>{pct}%</span>
      </div>
      <div style={{ height:5, background:"#F1F5F9", borderRadius:4, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:col, borderRadius:4, transition:"width .5s ease" }} />
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────
export default function Rooms() {
  const [rooms,        setRooms]        = useState(SEED);
  const [modal,        setModal]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [typeFilter,   setTypeFilter]   = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [floorFilter,  setFloorFilter]  = useState("All");
  const [page,         setPage]         = useState(1);
  const [toast,        setToast]        = useState(null);
  const [view,         setView]         = useState("table"); // "table" | "grid"
  const PAGE = 8;

  const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  // CRUD
  const handleCreate = (form) => { setRooms(r=>[{...form,roomId:nextId++},...r]); setModal(null); showToast(`Room ${form.roomNumber} added.`); };
  const handleUpdate = (form) => { setRooms(r=>r.map(x=>x.roomId===modal.room.roomId?{...x,...form}:x)); setModal(null); showToast(`Room ${form.roomNumber} updated.`); };
  const handleDelete = ()     => { showToast(`Room ${modal.room.roomNumber} deleted.`,false); setRooms(r=>r.filter(x=>x.roomId!==modal.room.roomId)); setModal(null); };

  // Filtered
  const filtered = useMemo(() => rooms.filter(r=>{
    const q=search.toLowerCase();
    const mQ=!q||r.roomNumber.toLowerCase().includes(q)||r.type.toLowerCase().includes(q)||r.wing.toLowerCase().includes(q)||String(r.roomId).includes(q);
    const mT=typeFilter==="All"||r.type===typeFilter;
    const mS=statusFilter==="All"||r.status===statusFilter;
    const mF=floorFilter==="All"||r.floor===Number(floorFilter);
    return mQ&&mT&&mS&&mF;
  }),[rooms,search,typeFilter,statusFilter,floorFilter]);

  const totalPages = Math.max(1,Math.ceil(filtered.length/PAGE));
  const paginated  = filtered.slice((page-1)*PAGE, page*PAGE);
  const sp = (p)  => setPage(Math.min(Math.max(1,p),totalPages));

  // Analytics data
  const statusData = useMemo(()=>RoomStatus.map(s=>({ name:s, value:rooms.filter(r=>r.status===s).length })),[rooms]);
  const typeData   = useMemo(()=>RoomType.map(t=>({ name:t, count:rooms.filter(r=>r.type===t).length, occupied:rooms.filter(r=>r.type===t&&r.status==="Occupied").length })),[rooms]);
  const floorData  = useMemo(()=>[1,2,3,4,5].map(f=>({ floor:FLOOR_LABELS[f].replace(" Floor","").replace("Ground","G"), available:rooms.filter(r=>r.floor===f&&r.status==="Available").length, occupied:rooms.filter(r=>r.floor===f&&r.status==="Occupied").length, maintenance:rooms.filter(r=>r.floor===f&&r.status==="Under Maintenance").length, reserved:rooms.filter(r=>r.floor===f&&r.status==="Reserved").length })),[rooms]);
  const revenueData= useMemo(()=>RoomType.map(t=>({ name:t.replace("-"," ").replace("Semi Private","Semi-Priv"), revenue:rooms.filter(r=>r.type===t&&r.status==="Occupied").reduce((s,r)=>s+r.pricePerDay*r.occupied,0) })).filter(d=>d.revenue>0),[rooms]);

  const totalRooms    = rooms.length;
  const availableRooms= rooms.filter(r=>r.status==="Available").length;
  const occupiedRooms = rooms.filter(r=>r.status==="Occupied").length;
  const totalBeds     = rooms.reduce((s,r)=>s+r.capacity,0);
  const occupiedBeds  = rooms.reduce((s,r)=>s+r.occupied,0);
  const dailyRevenue  = rooms.filter(r=>r.status==="Occupied").reduce((s,r)=>s+r.pricePerDay*r.occupied,0);

  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("Rooms");
  const [activeTab, setActiveTab] = useState("All");
  const [mobileOpen,setMobileOpen] = useState(false);


  return (
    <div style={{ minHeight:"100vh", display:"flex", justifyContent:"space-between", background:"#F1F5F9", fontFamily:"'Plus Jakarta Sans','DM Sans',sans-serif" }}>
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {/* Modals */}
      {modal?.type==="add"    && <RoomModal mode="add"  onSave={handleCreate} onClose={()=>setModal(null)}/>}
      {modal?.type==="edit"   && <RoomModal mode="edit" initial={modal.room}  onSave={handleUpdate} onClose={()=>setModal(null)}/>}
      {modal?.type==="delete" && <DeleteModal room={modal.room} onConfirm={handleDelete} onClose={()=>setModal(null)}/>}
      {modal?.type==="view"   && <ViewModal   room={modal.room} onClose={()=>setModal(null)} onEdit={()=>setModal({type:"edit",room:modal.room})}/>}

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", top:20, right:20, zIndex:300, padding:"12px 20px", borderRadius:12,
                      fontSize:13.5, fontWeight:600, background:toast.ok?"#0F172A":"#DC2626", color:"white",
                      boxShadow:"0 8px 28px rgba(0,0,0,.25)", display:"flex", alignItems:"center", gap:10,
                      animation:"slideLeft .25s cubic-bezier(.16,1,.3,1)" }}>
          {toast.ok?"✓":"🗑"} {toast.msg}
        </div>
      )}
      {/* Page header */}
      <div style={{width:"100%"}}>
      <TopBar onMenuClick={() => setMobileOpen(true)} />
      <div style={{ background:"white", borderBottom:"1px solid #E2E8F0", padding:"18px 24px",
                    display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#1D4ED8,#0EA5E9)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏨</div>
          <div>
            <h1 style={{ fontSize:20, fontWeight:800, color:"#0F172A", margin:0, letterSpacing:"-.4px" }}>Room Management</h1>
            <p style={{ fontSize:12.5, color:"#64748B", margin:0 }}>{rooms.length} rooms · {occupiedBeds}/{totalBeds} beds occupied</p>
          </div>
        </div>
        <button onClick={()=>setModal({type:"add"})} style={{ padding:"10px 20px", fontSize:13.5, fontWeight:700, border:"none", borderRadius:10, background:"linear-gradient(135deg,#1D4ED8,#2563EB)", color:"white", cursor:"pointer", display:"flex", alignItems:"center", gap:8, boxShadow:"0 3px 12px rgba(37,99,235,.35)" }}>
          <span style={{fontSize:18}}>+</span> Add Room
        </button>
      </div>

      <div style={{ padding:"20px 24px" }}>

        {/* ── Stat Cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))", gap:14, marginBottom:24 }}>
          <StatCard delay={0}   icon="🏨" label="Total Rooms"     value={<AnimNum val={totalRooms}/>}     sub={`${rooms.filter(r=>r.status==="Under Maintenance").length} under maintenance`} color="#1D4ED8" bg="#EFF6FF"/>
          <StatCard delay={60}  icon="✅" label="Available"       value={<AnimNum val={availableRooms}/>}  sub="Ready to assign"        color="#059669" bg="#ECFDF5"/>
          <StatCard delay={120} icon="🛏" label="Occupied"        value={<AnimNum val={occupiedRooms}/>}   sub={`${Math.round(occupiedRooms/totalRooms*100)||0}% occupancy rate`} color="#2563EB" bg="#DBEAFE"/>
          <StatCard delay={180} icon="👥" label="Beds Occupied"   value={<AnimNum val={occupiedBeds}/>}    sub={`of ${totalBeds} total beds`} color="#7C3AED" bg="#F5F3FF"/>
          <StatCard delay={240} icon="💰" label="Daily Revenue"   value={<><AnimNum val={dailyRevenue} prefix="$"/></>} sub="From occupied rooms"     color="#059669" bg="#ECFDF5"/>
        </div>

        {/* ── Analytics ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:16, marginBottom:24 }}>

          {/* Status Donut */}
          <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <h3 style={{ fontSize:13.5, fontWeight:700, color:"#0F172A", margin:"0 0 4px" }}>Room Status</h3>
            <p style={{ fontSize:12, color:"#94A3B8", margin:"0 0 14px" }}>Current distribution</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {statusData.map((_,i)=><Cell key={i} fill={[STATUS_CFG.Available.dot,STATUS_CFG.Occupied.dot,STATUS_CFG["Under Maintenance"].dot,STATUS_CFG.Reserved.dot][i]}/>)}
                </Pie>
                <Tooltip content={<TT/>}/>
                <Legend wrapperStyle={{fontSize:11.5}}/>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Floor breakdown */}
          <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <h3 style={{ fontSize:13.5, fontWeight:700, color:"#0F172A", margin:"0 0 4px" }}>Rooms by Floor</h3>
            <p style={{ fontSize:12, color:"#94A3B8", margin:"0 0 14px" }}>Status breakdown per floor</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={floorData} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                <XAxis dataKey="floor" tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                <Tooltip content={<TT/>}/>
                <Bar dataKey="available"   name="Available"   fill="#059669" radius={[4,4,0,0]}/>
                <Bar dataKey="occupied"    name="Occupied"    fill="#2563EB" radius={[4,4,0,0]}/>
                <Bar dataKey="maintenance" name="Maintenance" fill="#D97706" radius={[4,4,0,0]}/>
                <Bar dataKey="reserved"    name="Reserved"    fill="#9333EA" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by type */}
          <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <h3 style={{ fontSize:13.5, fontWeight:700, color:"#0F172A", margin:"0 0 4px" }}>Daily Revenue by Type</h3>
            <p style={{ fontSize:12, color:"#94A3B8", margin:"0 0 14px" }}>Revenue from occupied rooms ($)</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={revenueData} layout="vertical" barSize={12}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false}/>
                <XAxis type="number" tick={{fontSize:10,fill:"#94A3B8"}} axisLine={false} tickLine={false} tickFormatter={v=>`$${v}`}/>
                <YAxis type="category" dataKey="name" tick={{fontSize:10.5,fill:"#64748B"}} axisLine={false} tickLine={false} width={60}/>
                <Tooltip content={<TT/>} formatter={v=>`$${v}`}/>
                <Bar dataKey="revenue" name="Revenue" radius={[0,6,6,0]}>
                  {revenueData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%CHART_COLORS.length]}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Occupancy % by type */}
          <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <h3 style={{ fontSize:13.5, fontWeight:700, color:"#0F172A", margin:"0 0 4px" }}>Rooms per Type</h3>
            <p style={{ fontSize:12, color:"#94A3B8", margin:"0 0 14px" }}>Total vs occupied rooms</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeData} barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9"/>
                <XAxis dataKey="name" tick={{fontSize:9.5,fill:"#94A3B8"}} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={36}/>
                <YAxis tick={{fontSize:11,fill:"#94A3B8"}} axisLine={false} tickLine={false}/>
                <Tooltip content={<TT/>}/>
                <Bar dataKey="count"    name="Total"    fill="#CBD5E1" radius={[4,4,0,0]}/>
                <Bar dataKey="occupied" name="Occupied" fill="#2563EB" radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Table Section ── */}
        {/* Filter bar */}
        <div style={{ background:"white", borderRadius:12, border:"1px solid #E2E8F0", padding:"14px 16px", marginBottom:14, display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          {/* Search */}
          <div style={{ flex:"1 1 200px", position:"relative" }}>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#9CA3AF", fontSize:15 }}>🔍</span>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Search room, type, wing…"
              style={{ width:"100%", padding:"8px 12px 8px 34px", fontSize:13, border:"1.5px solid #E2E8F0", borderRadius:9, background:"#F8FAFC", color:"#0F172A", outline:"none", boxSizing:"border-box", fontFamily:"inherit" }}/>
            {search&&<button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#9CA3AF", fontSize:15 }}>✕</button>}
          </div>
          {/* Type */}
          <select value={typeFilter} onChange={e=>{setTypeFilter(e.target.value);setPage(1);}} style={{ padding:"8px 12px", fontSize:12.5, border:"1.5px solid #E2E8F0", borderRadius:9, background:"white", color:"#374151", outline:"none", fontFamily:"inherit" }}>
            <option value="All">All Types</option>
            {RoomType.map(t=><option key={t}>{t}</option>)}
          </select>
          {/* Status */}
          <select value={statusFilter} onChange={e=>{setStatusFilter(e.target.value);setPage(1);}} style={{ padding:"8px 12px", fontSize:12.5, border:"1.5px solid #E2E8F0", borderRadius:9, background:"white", color:"#374151", outline:"none", fontFamily:"inherit" }}>
            <option value="All">All Statuses</option>
            {RoomStatus.map(s=><option key={s}>{s}</option>)}
          </select>
          {/* Floor */}
          <select value={floorFilter} onChange={e=>{setFloorFilter(e.target.value);setPage(1);}} style={{ padding:"8px 12px", fontSize:12.5, border:"1.5px solid #E2E8F0", borderRadius:9, background:"white", color:"#374151", outline:"none", fontFamily:"inherit" }}>
            <option value="All">All Floors</option>
            {[1,2,3,4,5].map(f=><option key={f} value={f}>{FLOOR_LABELS[f]}</option>)}
          </select>
          {/* View toggle */}
          <div style={{ display:"flex", border:"1.5px solid #E2E8F0", borderRadius:9, overflow:"hidden", flexShrink:0 }}>
            {[{id:"table",icon:"☰"},{id:"grid",icon:"⊞"}].map(({id,icon})=>(
              <button key={id} onClick={()=>setView(id)} style={{ padding:"7px 13px", fontSize:15, border:"none", cursor:"pointer", background:view===id?"#EFF6FF":"white", color:view===id?"#1D4ED8":"#94A3B8", transition:"all .15s" }}>{icon}</button>
            ))}
          </div>
          <span style={{ fontSize:12, color:"#94A3B8", whiteSpace:"nowrap" }}>{filtered.length} results</span>
        </div>

        {/* Table or Grid */}
        {view==="table" ? (
          <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0", overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <thead>
                  <tr style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
                    {["ID","Room","Floor","Type","Status","Occupancy","Price/Day","Wing","Actions"].map(h=>(
                      <th key={h} style={{ padding:"11px 14px", textAlign:"left", fontWeight:700, color:"#64748B", fontSize:11, textTransform:"uppercase", letterSpacing:".06em", whiteSpace:"nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.length===0?(
                    <tr><td colSpan={9} style={{ padding:"56px", textAlign:"center", color:"#94A3B8" }}>
                      <div style={{fontSize:32,marginBottom:10}}>🔍</div>
                      <div style={{fontSize:14,fontWeight:700,color:"#64748B"}}>No rooms found</div>
                    </td></tr>
                  ):paginated.map((r,i)=>{
                    const tc=TYPE_CFG[r.type]||{}; const sc=STATUS_CFG[r.status]||{};
                    return (
                      <tr key={r.roomId} style={{ borderTop:"1px solid #F1F5F9", transition:"background .1s", animation:`fadeIn .22s ease both`, animationDelay:`${i*28}ms` }}
                        onMouseOver={e=>e.currentTarget.style.background="#F8FAFC"}
                        onMouseOut={e=>e.currentTarget.style.background="transparent"}
                      >
                        <td style={{padding:"12px 14px"}}><span style={{ fontSize:12, fontWeight:700, color:"#2563EB", fontFamily:"monospace", background:"#EFF6FF", padding:"3px 8px", borderRadius:6 }}>#{r.roomId}</span></td>
                        <td style={{padding:"12px 14px"}}><span style={{fontWeight:700,color:"#0F172A"}}>{r.roomNumber}</span></td>
                        <td style={{padding:"12px 14px",color:"#64748B",fontSize:12.5}}>{FLOOR_LABELS[r.floor]}</td>
                        <td style={{padding:"12px 14px"}}>
                          <span style={{ fontSize:12, fontWeight:600, background:tc.bg, color:tc.color, border:`1px solid ${tc.border}`, padding:"3px 10px", borderRadius:20, display:"inline-flex", alignItems:"center", gap:5 }}>
                            {tc.icon} {r.type}
                          </span>
                        </td>
                        <td style={{padding:"12px 14px"}}>
                          <span style={{ display:"inline-flex", alignItems:"center", gap:5, fontSize:12, fontWeight:600, background:sc.bg, color:sc.color, padding:"3px 10px", borderRadius:20 }}>
                            <span style={{width:6,height:6,borderRadius:"50%",background:sc.dot,display:"inline-block"}}/>
                            {r.status}
                          </span>
                        </td>
                        <td style={{padding:"12px 14px"}}><OccBar room={r}/></td>
                        <td style={{padding:"12px 14px",fontWeight:700,color:"#0F172A"}}>${r.pricePerDay}</td>
                        <td style={{padding:"12px 14px",color:"#64748B",fontSize:12.5}}>{r.wing}</td>
                        <td style={{padding:"12px 14px"}}>
                          <div style={{display:"flex",gap:5}}>
                            {[
                              {icon:"👁",title:"View",bg:"#EFF6FF",border:"#BFDBFE",color:"#1D4ED8",fn:()=>setModal({type:"view",room:r})},
                              {icon:"✏️",title:"Edit",bg:"#F0FDF4",border:"#BBF7D0",color:"#166534",fn:()=>setModal({type:"edit",room:r})},
                              {icon:"🗑",title:"Delete",bg:"#FEF2F2",border:"#FECACA",color:"#DC2626",fn:()=>setModal({type:"delete",room:r})},
                            ].map(({icon,title,bg,border,color,fn})=>(
                              <button key={title} onClick={fn} title={title} style={{ width:28,height:28,borderRadius:7,border:`1px solid ${border}`,background:bg,color,cursor:"pointer",fontSize:12,display:"flex",alignItems:"center",justifyContent:"center",transition:"transform .12s" }}
                                onMouseOver={e=>e.currentTarget.style.transform="scale(1.12)"}
                                onMouseOut={e=>e.currentTarget.style.transform="none"}
                              >{icon}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div style={{ padding:"12px 16px", borderTop:"1px solid #F1F5F9", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
              <span style={{fontSize:12.5,color:"#64748B"}}>
                Showing <strong style={{color:"#0F172A"}}>{Math.min((page-1)*PAGE+1,filtered.length)}–{Math.min(page*PAGE,filtered.length)}</strong> of <strong style={{color:"#0F172A"}}>{filtered.length}</strong>
              </span>
              <div style={{display:"flex",gap:5}}>
                {[{l:"«",fn:()=>sp(1),d:page===1},{l:"‹",fn:()=>sp(page-1),d:page===1},
                  ...Array.from({length:totalPages},(_,i)=>({l:String(i+1),fn:()=>sp(i+1),cur:page===i+1})),
                  {l:"›",fn:()=>sp(page+1),d:page===totalPages},{l:"»",fn:()=>sp(totalPages),d:page===totalPages}
                ].map((b,i)=>(
                  <button key={i} onClick={b.fn} disabled={b.d} style={{ minWidth:30,height:30,padding:"0 6px",fontSize:12.5,fontWeight:b.cur?700:500,border:"1px solid #E2E8F0",borderRadius:7,background:b.cur?"#2563EB":b.d?"#F8FAFC":"white",color:b.cur?"white":b.d?"#CBD5E1":"#374151",cursor:b.d?"default":"pointer" }}>{b.l}</button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Grid view
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:14 }}>
            {paginated.length===0?(
              <div style={{ gridColumn:"1/-1", padding:"56px", textAlign:"center", color:"#94A3B8", background:"white", borderRadius:14, border:"1px solid #E2E8F0" }}>
                <div style={{fontSize:32,marginBottom:10}}>🔍</div>
                <div style={{fontSize:14,fontWeight:700,color:"#64748B"}}>No rooms found</div>
              </div>
            ):paginated.map((r,i)=>{
              const tc=TYPE_CFG[r.type]||{}; const sc=STATUS_CFG[r.status]||{};
              const pct=occupancyPct(r);
              return (
                <div key={r.roomId} style={{ background:"white", borderRadius:14, border:`1px solid ${tc.border||"#E2E8F0"}`, overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)", animation:`fadeIn .25s ease both`, animationDelay:`${i*30}ms`, transition:"box-shadow .2s,transform .2s" }}
                  onMouseOver={e=>{ e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,.1)"; e.currentTarget.style.transform="translateY(-2px)"; }}
                  onMouseOut={e=>{ e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.04)"; e.currentTarget.style.transform="none"; }}
                >
                  <div style={{ background:tc.bg, padding:"16px 16px 12px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <span style={{ fontSize:22 }}>{tc.icon}</span>
                      <p style={{ fontSize:16, fontWeight:800, color:"#0F172A", margin:"6px 0 2px" }}>{r.roomNumber}</p>
                      <p style={{ fontSize:11.5, color:tc.color, fontWeight:600, margin:0 }}>{r.type}</p>
                    </div>
                    <span style={{ display:"inline-flex", alignItems:"center", gap:4, fontSize:11, fontWeight:700, background:sc.bg, color:sc.color, padding:"3px 9px", borderRadius:20 }}>
                      <span style={{width:5,height:5,borderRadius:"50%",background:sc.dot,display:"inline-block"}}/>
                      {r.status}
                    </span>
                  </div>
                  <div style={{ padding:"12px 16px" }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
                      {[["🏢",FLOOR_LABELS[r.floor]],["🧭",`${r.wing} Wing`],["👥",`${r.capacity} beds`],["💰",`$${r.pricePerDay}/day`]].map(([icon,val])=>(
                        <div key={val} style={{ fontSize:11.5, color:"#64748B", display:"flex", alignItems:"center", gap:4 }}><span>{icon}</span>{val}</div>
                      ))}
                    </div>
                    <OccBar room={r}/>
                    <div style={{ display:"flex", gap:6, marginTop:12 }}>
                      <button onClick={()=>setModal({type:"view",room:r})} style={{ flex:1, padding:"7px", fontSize:12, fontWeight:600, border:"1px solid #BFDBFE", borderRadius:8, background:"#EFF6FF", color:"#1D4ED8", cursor:"pointer" }}>View</button>
                      <button onClick={()=>setModal({type:"edit",room:r})} style={{ flex:1, padding:"7px", fontSize:12, fontWeight:600, border:"1px solid #BBF7D0", borderRadius:8, background:"#F0FDF4", color:"#166534", cursor:"pointer" }}>Edit</button>
                      <button onClick={()=>setModal({type:"delete",room:r})} style={{ padding:"7px 10px", fontSize:13, border:"1px solid #FECACA", borderRadius:8, background:"#FEF2F2", color:"#DC2626", cursor:"pointer" }}>🗑</button>
                    </div>
                  </div>
                </div>
              );
            })}
            {/* Grid pagination */}
            {totalPages>1&&(
              <div style={{ gridColumn:"1/-1", display:"flex", justifyContent:"center", gap:6, marginTop:4 }}>
                {Array.from({length:totalPages},(_,i)=>(
                  <button key={i} onClick={()=>sp(i+1)} style={{ width:32,height:32,fontSize:12.5,fontWeight:page===i+1?700:500,border:"1px solid #E2E8F0",borderRadius:7,background:page===i+1?"#2563EB":"white",color:page===i+1?"white":"#374151",cursor:"pointer" }}>{i+1}</button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes slideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:none} }
        @keyframes slideLeft{from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:none} }
        *{box-sizing:border-box;margin:0;padding:0;}
        input::placeholder{color:#CBD5E1;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:4px;}
        select{appearance:auto;}
      `}</style>
    </div>
    </div>
  );
}