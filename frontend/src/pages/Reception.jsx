import { useState, useMemo, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// DATA SEEDS
// ─────────────────────────────────────────────────────────────────────────────

const DOCTORS = [
  { id:"D01", name:"Dr. Rajan Patel",   dept:"Cardiology",    fee:150, avatar:"RP", color:"#2563EB" },
  { id:"D02", name:"Dr. Linda Chen",    dept:"Neurology",     fee:180, avatar:"LC", color:"#7C3AED" },
  { id:"D03", name:"Dr. Thomas Weiss",  dept:"Orthopedics",   fee:130, avatar:"TW", color:"#059669" },
  { id:"D04", name:"Dr. Aisha Nkosi",   dept:"Oncology",      fee:200, avatar:"AN", color:"#DC2626" },
  { id:"D05", name:"Dr. Mei Suzuki",    dept:"Pediatrics",    fee:120, avatar:"MS", color:"#EA580C" },
  { id:"D06", name:"Dr. Carlos Rivera", dept:"Gastroenterology",fee:140,avatar:"CR",color:"#0891B2"},
];

const ROOMS = [
  { id:"R01", number:"G-101", type:"General",   floor:1, pricePerDay:120, status:"Available" },
  { id:"R02", number:"G-102", type:"General",   floor:1, pricePerDay:120, status:"Available" },
  { id:"R03", number:"ICU-1", type:"ICU",        floor:3, pricePerDay:850, status:"Available" },
  { id:"R04", number:"PR-01", type:"Private",    floor:2, pricePerDay:280, status:"Available" },
  { id:"R05", number:"EM-01", type:"Emergency",  floor:1, pricePerDay:400, status:"Occupied"  },
  { id:"R06", number:"M-501", type:"Maternity",  floor:4, pricePerDay:350, status:"Available" },
  { id:"R07", number:"P-401", type:"Pediatric",  floor:3, pricePerDay:220, status:"Available" },
  { id:"R08", number:"S-301", type:"Semi-Private",floor:2,pricePerDay:180, status:"Available" },
];

const TREATMENTS_CATALOG = [
  { id:"T01", name:"Blood Panel",         cost:85  },
  { id:"T02", name:"X-Ray",               cost:120 },
  { id:"T03", name:"MRI Scan",            cost:450 },
  { id:"T04", name:"ECG",                 cost:60  },
  { id:"T05", name:"CT Scan",             cost:380 },
  { id:"T06", name:"Ultrasound",          cost:150 },
  { id:"T07", name:"Physiotherapy",       cost:90  },
  { id:"T08", name:"IV Drip",             cost:45  },
  { id:"T09", name:"Surgical Procedure",  cost:1200},
  { id:"T10", name:"Vaccination",         cost:35  },
];

let nextPid = 5;
const SEED_PATIENTS = [
  {
    pid:"P-10001", name:"Sarah Mitchell",  gender:"Female", age:34, phone:"+1 415-882-3301",
    email:"s.mitchell@email.com", blood:"A+", address:"12 Oak St, San Francisco",
    doctorId:"D01", roomId:"R04", admitDate:"2026-05-01", status:"Admitted",
    treatments:[
      { txId:"TX-001", treatmentId:"T01", name:"Blood Panel", cost:85,  date:"2026-05-02", paid:true  },
      { txId:"TX-002", treatmentId:"T03", name:"MRI Scan",    cost:450, date:"2026-05-04", paid:true  },
      { txId:"TX-003", treatmentId:"T04", name:"ECG",         cost:60,  date:"2026-05-06", paid:false },
    ],
    notes:"Hypertension monitoring",
  },
  {
    pid:"P-10002", name:"James Okoye",    gender:"Male",   age:52, phone:"+1 312-774-5590",
    email:"j.okoye@email.com", blood:"O-", address:"88 Lakeview Ave, Chicago",
    doctorId:"D02", roomId:"R03", admitDate:"2026-05-03", status:"Admitted",
    treatments:[
      { txId:"TX-004", treatmentId:"T05", name:"CT Scan",  cost:380, date:"2026-05-04", paid:true  },
      { txId:"TX-005", treatmentId:"T07", name:"Physiotherapy",cost:90,date:"2026-05-07",paid:false},
    ],
    notes:"Post-stroke recovery",
  },
  {
    pid:"P-10003", name:"Maria Vasquez",  gender:"Female", age:28, phone:"+1 702-991-4423",
    email:"m.vasquez@email.com", blood:"B+", address:"55 Desert Rd, Las Vegas",
    doctorId:"D05", roomId:null, admitDate:"2026-05-08", status:"Outpatient",
    treatments:[
      { txId:"TX-006", treatmentId:"T10", name:"Vaccination", cost:35, date:"2026-05-08", paid:true },
    ],
    notes:"Pediatric referral",
  },
  {
    pid:"P-10004", name:"David Park",     gender:"Male",   age:61, phone:"+1 206-338-7761",
    email:"d.park@email.com", blood:"AB+", address:"34 Rainy Ln, Seattle",
    doctorId:"D04", roomId:"R01", admitDate:"2026-04-28", status:"Critical",
    treatments:[
      { txId:"TX-007", treatmentId:"T09", name:"Surgical Procedure",cost:1200,date:"2026-04-30",paid:true },
      { txId:"TX-008", treatmentId:"T01", name:"Blood Panel",cost:85,date:"2026-05-02",paid:true },
      { txId:"TX-009", treatmentId:"T08", name:"IV Drip",cost:45,date:"2026-05-05",paid:false },
    ],
    notes:"Oncology — Stage 2",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const avatarPalette = ["#2563EB","#7C3AED","#059669","#DC2626","#EA580C","#0891B2","#DB2777","#065F46"];
const avatarColor = (s) => { let h=0; for(const c of (s||"")) h=(h*31+c.charCodeAt(0))&0xFFFF; return avatarPalette[Math.abs(h)%avatarPalette.length]; };
const initials    = (n) => n?.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase() || "??";
const fmt$        = (v) => `$${Number(v).toLocaleString("en-US",{minimumFractionDigits:2})}`;

const STATUS_CFG = {
  Admitted:   { bg:"#DBEAFE", color:"#1D4ED8", dot:"#2563EB" },
  Outpatient: { bg:"#DCFCE7", color:"#15803D", dot:"#16A34A" },
  Critical:   { bg:"#FEE2E2", color:"#B91C1C", dot:"#DC2626" },
  Discharged: { bg:"#F3F4F6", color:"#374151", dot:"#9CA3AF" },
};

const TYPE_CFG = {
  General:      { bg:"#EFF6FF", color:"#1D4ED8" },
  ICU:          { bg:"#FEF2F2", color:"#B91C1C" },
  Private:      { bg:"#F5F3FF", color:"#6D28D9" },
  Emergency:    { bg:"#FFF7ED", color:"#92400E" },
  Maternity:    { bg:"#F0FDF4", color:"#14532D" },
  Pediatric:    { bg:"#FDF2F8", color:"#831843" },
  "Semi-Private":{ bg:"#ECFEFF", color:"#164E63"},
};

function calcPatientTotal(p, rooms) {
  const room       = rooms.find(r=>r.id===p.roomId);
  const doctor     = DOCTORS.find(d=>d.id===p.doctorId);
  const admitDays  = p.admitDate
    ? Math.max(1, Math.ceil((new Date()-new Date(p.admitDate))/(1000*60*60*24)))
    : 0;
  const roomCost     = room   ? room.pricePerDay * admitDays : 0;
  const doctorFee    = doctor ? doctor.fee : 0;
  const treatmentSum = (p.treatments||[]).reduce((s,t)=>s+t.cost,0);
  const paidSum      = (p.treatments||[]).filter(t=>t.paid).reduce((s,t)=>s+t.cost,0);
  return { roomCost, doctorFee, treatmentSum, admitDays, total: roomCost+doctorFee+treatmentSum, paidSum };
}

// ─────────────────────────────────────────────────────────────────────────────
// SMALL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

function Badge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.Outpatient;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
                   fontSize:11.5, fontWeight:700, background:cfg.bg, color:cfg.color,
                   padding:"3px 10px", borderRadius:20 }}>
      <span style={{ width:6,height:6,borderRadius:"50%",background:cfg.dot,display:"inline-block" }}/>
      {status}
    </span>
  );
}

function Avatar({ name, size=34 }) {
  return (
    <div style={{ width:size, height:size, borderRadius:"50%", background:avatarColor(name),
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"white", fontWeight:800, fontSize:size*0.35, flexShrink:0 }}>
      {initials(name)}
    </div>
  );
}

function StatCard({ icon, label, value, sub, bg, color, delay=0 }) {
  return (
    <div style={{ background:"white", borderRadius:14, border:"1px solid #F1F5F9",
                  padding:"18px 20px", boxShadow:"0 1px 3px rgba(0,0,0,.04)",
                  animation:`fadeUp .4s ease both`, animationDelay:`${delay}ms`,
                  transition:"box-shadow .2s, transform .2s", cursor:"default" }}
      onMouseOver={e=>{e.currentTarget.style.boxShadow="0 8px 28px rgba(0,0,0,.09)";e.currentTarget.style.transform="translateY(-2px)"}}
      onMouseOut={e=>{e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.04)";e.currentTarget.style.transform="none"}}
    >
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <p style={{fontSize:11,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 6px"}}>{label}</p>
          <p style={{fontSize:26,fontWeight:800,color:"#0F172A",letterSpacing:"-.5px",lineHeight:1.1,margin:"0 0 4px"}}>{value}</p>
          <p style={{fontSize:11.5,color:"#94A3B8",margin:0}}>{sub}</p>
        </div>
        <div style={{width:46,height:46,borderRadius:12,background:bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{icon}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL — Add / Edit Patient
// ─────────────────────────────────────────────────────────────────────────────

function PatientModal({ mode, initial, rooms, onSave, onClose }) {
  const availRooms = rooms.filter(r=>r.status==="Available"||(initial&&r.id===initial.roomId));
  const blank = { name:"", gender:"Female", age:"", phone:"", email:"", blood:"A+",
                  address:"", doctorId:"", roomId:"", admitDate: new Date().toISOString().split("T")[0],
                  status:"Outpatient", notes:"" };
  const [form, setForm] = useState(mode==="edit" ? {...initial} : blank);
  const [errs, setErrs] = useState({});
  const set = (k,v)=>{ setForm(f=>({...f,[k]:v})); setErrs(e=>({...e,[k]:""})); };

  const validate = () => {
    const e={};
    if(!form.name.trim())  e.name="Name required";
    if(!form.phone.trim()) e.phone="Phone required";
    if(!form.doctorId)     e.doctorId="Assign a doctor";
    return e;
  };
  const submit = () => { const e=validate(); if(Object.keys(e).length){setErrs(e);return;} onSave(form); };

  const LBL = { fontSize:11, fontWeight:700, color:"#475569", display:"block",
                marginBottom:5, textTransform:"uppercase", letterSpacing:".07em" };
  const INP = (err) => ({
    width:"100%", padding:"9px 12px", fontSize:13.5, fontFamily:"inherit",
    border:`1.5px solid ${err?"#FCA5A5":"#E2E8F0"}`, borderRadius:9,
    background:err?"#FFF5F5":"#F8FAFC", color:"#0F172A", outline:"none", boxSizing:"border-box",
  });

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,.55)",zIndex:200,
                  display:"flex",alignItems:"center",justifyContent:"center",padding:16,
                  backdropFilter:"blur(3px)",animation:"fadeIn .18s ease" }}>
      <div style={{ background:"white",borderRadius:18,width:"100%",maxWidth:580,
                    maxHeight:"92vh",overflowY:"auto",
                    boxShadow:"0 32px 80px rgba(0,0,0,.22)",
                    animation:"slideUp .25s cubic-bezier(.16,1,.3,1)" }}>
        {/* Header */}
        <div style={{ background: mode==="edit"
            ? "linear-gradient(135deg,#0F172A,#1E3A5F)"
            : "linear-gradient(135deg,#1D4ED8,#2563EB,#0EA5E9)",
            padding:"22px 28px", display:"flex", justifyContent:"space-between",
            alignItems:"flex-start", position:"sticky", top:0, zIndex:5 }}>
          <div>
            <p style={{margin:"0 0 2px",fontSize:10.5,fontWeight:700,color:"rgba(255,255,255,.5)",textTransform:"uppercase",letterSpacing:".1em"}}>
              {mode==="edit" ? initial.pid : "NEW PATIENT"}
            </p>
            <h2 style={{margin:0,color:"white",fontSize:18,fontWeight:800,letterSpacing:"-.3px"}}>
              {mode==="edit" ? "Edit Patient" : "Register Patient"}
            </h2>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.15)",border:"none",color:"white",
              width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:17,
              display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        <div style={{padding:"24px 28px",display:"flex",flexDirection:"column",gap:16}}>
          {/* Name + Gender */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <label style={LBL}>Full Name <span style={{color:"#EF4444"}}>*</span></label>
              <input style={INP(errs.name)} value={form.name} placeholder="e.g. Sarah Mitchell"
                onChange={e=>set("name",e.target.value)}/>
              {errs.name&&<p style={{fontSize:11.5,color:"#EF4444",margin:"4px 0 0"}}>{errs.name}</p>}
            </div>
            <div>
              <label style={LBL}>Gender</label>
              <div style={{display:"flex",gap:8}}>
                {["Female","Male","Other"].map(g=>(
                  <button key={g} onClick={()=>set("gender",g)} style={{
                    flex:1, padding:"9px 4px", fontSize:12, fontWeight:form.gender===g?700:500,
                    borderRadius:9, border:`1.5px solid ${form.gender===g?"#2563EB":"#E2E8F0"}`,
                    background:form.gender===g?"#EFF6FF":"#F8FAFC",
                    color:form.gender===g?"#1D4ED8":"#64748B", cursor:"pointer",
                  }}>{g==="Female"?"♀":g==="Male"?"♂":"⚥"} {g}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Age + Blood + Phone + Email */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <label style={LBL}>Age</label>
              <input type="number" style={INP()} value={form.age} placeholder="e.g. 35"
                onChange={e=>set("age",e.target.value)}/>
            </div>
            <div>
              <label style={LBL}>Blood Group</label>
              <select style={INP()} value={form.blood} onChange={e=>set("blood",e.target.value)}>
                {["A+","A-","B+","B-","O+","O-","AB+","AB-"].map(b=><option key={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label style={LBL}>Phone <span style={{color:"#EF4444"}}>*</span></label>
              <input style={INP(errs.phone)} value={form.phone} placeholder="+1 (555) 000-0000"
                onChange={e=>set("phone",e.target.value)}/>
              {errs.phone&&<p style={{fontSize:11.5,color:"#EF4444",margin:"4px 0 0"}}>{errs.phone}</p>}
            </div>
            <div>
              <label style={LBL}>Email</label>
              <input type="email" style={INP()} value={form.email} placeholder="patient@email.com"
                onChange={e=>set("email",e.target.value)}/>
            </div>
          </div>

          {/* Address */}
          <div>
            <label style={LBL}>Address</label>
            <input style={INP()} value={form.address} placeholder="Street, City, State"
              onChange={e=>set("address",e.target.value)}/>
          </div>

          {/* Assign Doctor */}
          <div>
            <label style={LBL}>Assign Doctor <span style={{color:"#EF4444"}}>*</span></label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
              {DOCTORS.map(d=>{
                const active=form.doctorId===d.id;
                return (
                  <button key={d.id} onClick={()=>set("doctorId",d.id)} style={{
                    padding:"10px 8px",fontSize:11.5,fontWeight:active?700:500,borderRadius:10,
                    cursor:"pointer",border:`1.5px solid ${active?d.color+"55":"#E2E8F0"}`,
                    background:active?d.color+"0F":"#F8FAFC",color:active?d.color:"#64748B",
                    boxShadow:active?`0 0 0 3px ${d.color}22`:"none",
                    display:"flex",flexDirection:"column",alignItems:"center",gap:5,transition:"all .15s",
                  }}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:d.color,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:11}}>{d.avatar}</div>
                    <span style={{fontSize:11,lineHeight:1.2,textAlign:"center"}}>{d.name.replace("Dr. ","")}</span>
                    <span style={{fontSize:10,opacity:.7}}>{d.dept}</span>
                    <span style={{fontSize:10.5,fontWeight:700,color:active?d.color:"#94A3B8"}}>${d.fee}/visit</span>
                  </button>
                );
              })}
            </div>
            {errs.doctorId&&<p style={{fontSize:11.5,color:"#EF4444",margin:"4px 0 0"}}>{errs.doctorId}</p>}
          </div>

          {/* Assign Room */}
          <div>
            <label style={LBL}>Assign Room <span style={{fontSize:10,color:"#94A3B8",fontWeight:400,textTransform:"none"}}>(optional for outpatients)</span></label>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
              <button onClick={()=>set("roomId","")} style={{
                padding:"8px",fontSize:11.5,fontWeight:!form.roomId?700:500,borderRadius:9,
                cursor:"pointer",border:`1.5px solid ${!form.roomId?"#E2E8F0":"#E2E8F0"}`,
                background:!form.roomId?"#F1F5F9":"#F8FAFC",color:!form.roomId?"#374151":"#9CA3AF",
              }}>None</button>
              {availRooms.map(r=>{
                const cfg=TYPE_CFG[r.type]||{bg:"#F1F5F9",color:"#374151"};
                const active=form.roomId===r.id;
                return (
                  <button key={r.id} onClick={()=>set("roomId",r.id)} style={{
                    padding:"8px",fontSize:11,fontWeight:active?700:500,borderRadius:9,cursor:"pointer",
                    border:`1.5px solid ${active?cfg.color+"55":"#E2E8F0"}`,
                    background:active?cfg.bg:"#F8FAFC",color:active?cfg.color:"#64748B",
                    boxShadow:active?`0 0 0 3px ${cfg.color}18`:"none",transition:"all .12s",
                  }}>
                    <div style={{fontWeight:700,fontSize:12}}>{r.number}</div>
                    <div style={{fontSize:10,opacity:.8}}>{r.type}</div>
                    <div style={{fontSize:10.5,fontWeight:700,marginTop:2}}>${r.pricePerDay}/day</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status + Admit Date */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div>
              <label style={LBL}>Status</label>
              <select style={INP()} value={form.status} onChange={e=>set("status",e.target.value)}>
                {["Admitted","Outpatient","Critical","Discharged"].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={LBL}>Admit Date</label>
              <input type="date" style={INP()} value={form.admitDate}
                onChange={e=>set("admitDate",e.target.value)}/>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label style={LBL}>Clinical Notes</label>
            <textarea style={{...INP(),resize:"none",minHeight:64}} value={form.notes}
              placeholder="Any relevant notes…" onChange={e=>set("notes",e.target.value)}/>
          </div>

          {/* Actions */}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:4}}>
            <button onClick={onClose} style={{padding:"10px 20px",fontSize:13.5,fontWeight:600,
                border:"1.5px solid #E2E8F0",borderRadius:9,background:"white",color:"#475569",cursor:"pointer"}}>
              Cancel
            </button>
            <button onClick={submit} style={{padding:"10px 28px",fontSize:13.5,fontWeight:700,
                border:"none",borderRadius:9,cursor:"pointer",color:"white",
                background: mode==="edit"
                  ? "linear-gradient(135deg,#0F172A,#1E3A5F)"
                  : "linear-gradient(135deg,#1D4ED8,#2563EB)",
                boxShadow: mode==="edit" ? "0 3px 10px rgba(15,23,42,.35)" : "0 3px 10px rgba(37,99,235,.35)"}}>
              {mode==="edit" ? "💾 Save Changes" : "✓ Register Patient"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODAL — Patient Detail / Bill
// ─────────────────────────────────────────────────────────────────────────────

function BillModal({ patient, rooms, onClose, onAddTreatment, onTogglePaid, onDischarge }) {
  const [addTx, setAddTx] = useState(false);
  const [selTx, setSelTx] = useState("");
  const doctor  = DOCTORS.find(d=>d.id===patient.doctorId);
  const room    = rooms.find(r=>r.id===patient.roomId);
  const { roomCost, doctorFee, treatmentSum, admitDays, total, paidSum } = calcPatientTotal(patient, rooms);
  const outstanding = total - paidSum - doctorFee; // doctor fee billed at discharge
  const sc = STATUS_CFG[patient.status] || STATUS_CFG.Outpatient;

  const handleAddTx = () => {
    if(!selTx) return;
    const cat = TREATMENTS_CATALOG.find(t=>t.id===selTx);
    onAddTreatment(patient.pid, {
      txId: "TX-"+Date.now(), treatmentId:cat.id, name:cat.name,
      cost:cat.cost, date:new Date().toISOString().split("T")[0], paid:false,
    });
    setSelTx(""); setAddTx(false);
  };

  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,.6)",zIndex:200,
                  display:"flex",alignItems:"center",justifyContent:"center",padding:16,
                  backdropFilter:"blur(3px)",animation:"fadeIn .2s ease" }}>
      <div style={{ background:"white",borderRadius:18,width:"100%",maxWidth:620,
                    maxHeight:"93vh",overflowY:"auto",
                    boxShadow:"0 32px 80px rgba(0,0,0,.22)",
                    animation:"slideUp .25s cubic-bezier(.16,1,.3,1)" }}>

        {/* Header */}
        <div style={{ background:"linear-gradient(135deg,#0F172A,#1E293B)",padding:"22px 26px",
                      display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Avatar name={patient.name} size={46}/>
            <div>
              <p style={{margin:"0 0 2px",fontSize:10.5,fontWeight:700,color:"rgba(255,255,255,.4)",letterSpacing:".1em"}}>{patient.pid}</p>
              <h2 style={{margin:0,color:"white",fontSize:17,fontWeight:800}}>{patient.name}</h2>
              <div style={{display:"flex",alignItems:"center",gap:8,marginTop:5}}>
                <Badge status={patient.status}/>
                {patient.blood && <span style={{fontSize:12,fontWeight:700,background:"rgba(255,255,255,.1)",color:"white",padding:"2px 9px",borderRadius:20}}>{patient.blood}</span>}
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"none",color:"white",
              width:32,height:32,borderRadius:8,cursor:"pointer",fontSize:17,
              display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>

        <div style={{padding:"22px 26px",display:"flex",flexDirection:"column",gap:18}}>

          {/* Doctor + Room info */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            {/* Doctor */}
            <div style={{background:"#F8FAFC",borderRadius:12,padding:"14px 16px",border:"1px solid #F1F5F9"}}>
              <p style={{fontSize:10.5,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 10px"}}>Assigned Doctor</p>
              {doctor ? (
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:"50%",background:doctor.color,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:12,flexShrink:0}}>{doctor.avatar}</div>
                  <div>
                    <div style={{fontWeight:700,color:"#0F172A",fontSize:13}}>{doctor.name}</div>
                    <div style={{fontSize:11.5,color:"#64748B"}}>{doctor.dept}</div>
                    <div style={{fontSize:11.5,fontWeight:700,color:"#2563EB"}}>${doctor.fee} consultation</div>
                  </div>
                </div>
              ) : <p style={{color:"#94A3B8",fontSize:13,margin:0}}>Not assigned</p>}
            </div>

            {/* Room */}
            <div style={{background:"#F8FAFC",borderRadius:12,padding:"14px 16px",border:"1px solid #F1F5F9"}}>
              <p style={{fontSize:10.5,fontWeight:700,color:"#94A3B8",textTransform:"uppercase",letterSpacing:".07em",margin:"0 0 10px"}}>Room</p>
              {room ? (
                <>
                  <div style={{fontWeight:700,color:"#0F172A",fontSize:14}}>{room.number}</div>
                  <div style={{fontSize:11.5,color:"#64748B",marginTop:2}}>{room.type} · Floor {room.floor}</div>
                  <div style={{fontSize:11.5,fontWeight:700,color:"#2563EB",marginTop:2}}>${room.pricePerDay}/day × {admitDays} day{admitDays!==1?"s":""}</div>
                  <div style={{fontSize:12,fontWeight:700,color:"#0F172A",marginTop:4}}>= {fmt$(roomCost)}</div>
                </>
              ) : <p style={{color:"#94A3B8",fontSize:13,margin:0}}>No room assigned</p>}
            </div>
          </div>

          {/* Treatments */}
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <p style={{fontSize:13,fontWeight:700,color:"#0F172A",margin:0}}>🧪 Treatments & Transactions</p>
              <button onClick={()=>setAddTx(v=>!v)} style={{
                padding:"6px 14px",fontSize:12,fontWeight:700,border:"none",borderRadius:8,
                background:addTx?"#F1F5F9":"#EFF6FF",color:addTx?"#374151":"#2563EB",cursor:"pointer",
              }}>
                {addTx ? "✕ Cancel" : "+ Add Treatment"}
              </button>
            </div>

            {addTx && (
              <div style={{display:"flex",gap:8,marginBottom:12,padding:"12px",background:"#EFF6FF",borderRadius:10,border:"1px solid #BFDBFE"}}>
                <select value={selTx} onChange={e=>setSelTx(e.target.value)} style={{
                  flex:1,padding:"8px 12px",fontSize:13,border:"1.5px solid #BFDBFE",borderRadius:8,
                  background:"white",color:"#0F172A",outline:"none",fontFamily:"inherit",
                }}>
                  <option value="">— Select treatment —</option>
                  {TREATMENTS_CATALOG.map(t=><option key={t.id} value={t.id}>{t.name} — ${t.cost}</option>)}
                </select>
                <button onClick={handleAddTx} disabled={!selTx} style={{
                  padding:"8px 18px",fontSize:13,fontWeight:700,border:"none",borderRadius:8,
                  background:selTx?"#2563EB":"#93C5FD",color:"white",cursor:selTx?"pointer":"not-allowed",
                }}>Add</button>
              </div>
            )}

            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              {(patient.treatments||[]).length===0 && (
                <p style={{textAlign:"center",color:"#94A3B8",fontSize:13,padding:"20px 0"}}>No treatments recorded yet.</p>
              )}
              {(patient.treatments||[]).map(tx=>(
                <div key={tx.txId} style={{
                  display:"flex",alignItems:"center",gap:12,padding:"11px 14px",
                  borderRadius:10,border:`1px solid ${tx.paid?"#BBF7D0":"#FDE68A"}`,
                  background:tx.paid?"#F0FDF4":"#FFFBEB",
                }}>
                  <div style={{width:32,height:32,borderRadius:8,background:tx.paid?"#DCFCE7":"#FEF9C3",
                                display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>
                    {tx.paid?"✅":"⏳"}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,color:"#0F172A",fontSize:13}}>{tx.name}</div>
                    <div style={{fontSize:11,color:"#64748B"}}>{tx.txId} · {tx.date}</div>
                  </div>
                  <div style={{fontWeight:800,color:"#0F172A",fontSize:14,flexShrink:0}}>{fmt$(tx.cost)}</div>
                  <button onClick={()=>onTogglePaid(patient.pid,tx.txId)} style={{
                    padding:"5px 11px",fontSize:11.5,fontWeight:700,borderRadius:7,border:"none",cursor:"pointer",
                    background:tx.paid?"#FEE2E2":"#DCFCE7",color:tx.paid?"#DC2626":"#15803D",flexShrink:0,
                  }}>{tx.paid?"Unpay":"Mark Paid"}</button>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Summary */}
          <div style={{background:"linear-gradient(135deg,#0F172A,#1E293B)",borderRadius:14,padding:"18px 20px",color:"white"}}>
            <p style={{fontSize:13,fontWeight:700,margin:"0 0 14px",display:"flex",alignItems:"center",gap:8}}>
              💰 Bill Summary
            </p>
            {[
              ["Room Charges", `${admitDays} day${admitDays!==1?"s":""} × $${room?.pricePerDay||0}`, fmt$(roomCost)],
              ["Doctor Fee",   doctor?.name||"—",                                                     fmt$(doctorFee)],
              ["Treatments",   `${(patient.treatments||[]).length} item(s)`,                           fmt$(treatmentSum)],
            ].map(([l,sub,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                                   padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.08)",fontSize:13}}>
                <div>
                  <span style={{color:"rgba(255,255,255,.8)"}}>{l}</span>
                  <span style={{color:"rgba(255,255,255,.35)",fontSize:11,marginLeft:8}}>{sub}</span>
                </div>
                <span style={{fontWeight:700}}>{v}</span>
              </div>
            ))}

            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                         padding:"12px 0 4px",marginTop:4}}>
              <span style={{fontSize:16,fontWeight:800}}>Total</span>
              <span style={{fontSize:20,fontWeight:800,color:"#60A5FA"}}>{fmt$(total)}</span>
            </div>
            <div style={{display:"flex",gap:16,fontSize:12,marginTop:6}}>
              <span style={{color:"#34D399"}}>✓ Paid: {fmt$(paidSum)}</span>
              <span style={{color:"#FBBF24"}}>⏳ Outstanding: {fmt$(Math.max(0,total-paidSum))}</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
            <button onClick={onClose} style={{padding:"10px 20px",fontSize:13.5,fontWeight:600,
                border:"1.5px solid #E2E8F0",borderRadius:9,background:"white",color:"#475569",cursor:"pointer"}}>
              Close
            </button>
            {patient.status !== "Discharged" && (
              <button onClick={()=>{onDischarge(patient.pid);onClose();}} style={{
                padding:"10px 22px",fontSize:13.5,fontWeight:700,border:"none",borderRadius:9,cursor:"pointer",
                background:"linear-gradient(135deg,#059669,#10B981)",color:"white",
                boxShadow:"0 3px 10px rgba(5,150,105,.3)",
              }}>🏠 Discharge Patient</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN — Receptionist Dashboard
// ─────────────────────────────────────────────────────────────────────────────

export default function Reception() {
  const [patients,   setPatients]   = useState(SEED_PATIENTS);
  const [rooms,      setRooms]      = useState(ROOMS);
  const [modal,      setModal]      = useState(null);
  const [search,     setSearch]     = useState("");
  const [statusF,    setStatusF]    = useState("All");
  const [page,       setPage]       = useState(1);
  const [toast,      setToast]      = useState(null);
  const [today,      setToday]      = useState("");
  const PAGE = 6;

  useEffect(()=>{
    const d=new Date();
    const DAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const h=d.getHours();
    const shift=h>=18?"🌙 Evening":h>=12?"☀ Afternoon":"🌅 Morning";
    setToday(`${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()} ${d.getFullYear()} · ${shift} Shift`);
  },[]);

  const showToast = (msg, ok=true) => { setToast({msg,ok}); setTimeout(()=>setToast(null),3000); };

  // ── CRUD ─────────────────────────────────────────────────────────────────
  const createPatient = (form) => {
    const newP = { ...form, pid:`P-1000${nextPid++}`, treatments:[] };
    setPatients(p=>[newP,...p]);
    // mark room occupied
    if(form.roomId) setRooms(r=>r.map(x=>x.id===form.roomId?{...x,status:"Occupied"}:x));
    setModal(null);
    showToast(`Patient ${form.name} registered successfully.`);
  };

  const updatePatient = (form) => {
    const prev = patients.find(p=>p.pid===modal.patient.pid);
    // free old room if changed
    if(prev.roomId && prev.roomId!==form.roomId)
      setRooms(r=>r.map(x=>x.id===prev.roomId?{...x,status:"Available"}:x));
    // occupy new room
    if(form.roomId && form.roomId!==prev.roomId)
      setRooms(r=>r.map(x=>x.id===form.roomId?{...x,status:"Occupied"}:x));
    setPatients(p=>p.map(x=>x.pid===prev.pid?{...x,...form}:x));
    setModal(null);
    showToast(`Patient ${form.name} updated.`);
  };

  const dischargePatient = (pid) => {
    const p = patients.find(x=>x.pid===pid);
    if(p?.roomId) setRooms(r=>r.map(x=>x.id===p.roomId?{...x,status:"Available"}:x));
    setPatients(ps=>ps.map(x=>x.pid===pid?{...x,status:"Discharged",roomId:null}:x));
    showToast(`Patient discharged.`, true);
  };

  const addTreatment = (pid, tx) => {
    setPatients(ps=>ps.map(p=>p.pid===pid?{...p,treatments:[...(p.treatments||[]),tx]}:p));
    // update modal patient reference
    if(modal?.type==="bill") setModal(m=>({...m,patient:{...m.patient,treatments:[...(m.patient.treatments||[]),tx]}}));
    showToast(`Treatment "${tx.name}" added.`);
  };

  const togglePaid = (pid, txId) => {
    setPatients(ps=>ps.map(p=>p.pid===pid
      ? {...p, treatments:p.treatments.map(t=>t.txId===txId?{...t,paid:!t.paid}:t)}
      : p
    ));
    if(modal?.type==="bill") setModal(m=>({...m,patient:{...m.patient,treatments:m.patient.treatments.map(t=>t.txId===txId?{...t,paid:!t.paid}:t)}}));
  };

  // ── Filtered list ─────────────────────────────────────────────────────────
  const filtered = useMemo(()=>{
    const q=search.toLowerCase();
    return patients.filter(p=>{
      const mQ=!q||p.name.toLowerCase().includes(q)||p.pid.toLowerCase().includes(q)||p.phone.includes(q);
      const mS=statusF==="All"||p.status===statusF;
      return mQ&&mS;
    });
  },[patients,search,statusF]);

  const totalPages = Math.max(1,Math.ceil(filtered.length/PAGE));
  const paginated  = filtered.slice((page-1)*PAGE,page*PAGE);

  // ── KPIs ──────────────────────────────────────────────────────────────────
  const kpis = useMemo(()=>{
    const admitted    = patients.filter(p=>p.status==="Admitted").length;
    const outpatient  = patients.filter(p=>p.status==="Outpatient").length;
    const critical    = patients.filter(p=>p.status==="Critical").length;
    const totalRev    = patients.reduce((s,p)=>{ const {total}=calcPatientTotal(p,rooms); return s+total; },0);
    const outstanding = patients.reduce((s,p)=>{ const {total,paidSum}=calcPatientTotal(p,rooms); return s+(total-paidSum); },0);
    return { admitted, outpatient, critical, totalRev, outstanding, total:patients.length };
  },[patients,rooms]);

  const statusCounts = useMemo(()=>{
    const c={All:patients.length};
    patients.forEach(p=>c[p.status]=(c[p.status]||0)+1);
    return c;
  },[patients]);

  // ── open bill modal with live patient ─────────────────────────────────────
  const openBill = (patient) => {
    const live = patients.find(p=>p.pid===patient.pid);
    setModal({type:"bill", patient: live});
  };

  return (
    <div style={{ minHeight:"100vh", background:"#F1F5F9",
                  fontFamily:"'Plus Jakarta Sans','DM Sans',sans-serif" }}>

      {/* ── Modals ── */}
      {modal?.type==="add"  && <PatientModal mode="add"  rooms={rooms} onSave={createPatient} onClose={()=>setModal(null)}/>}
      {modal?.type==="edit" && <PatientModal mode="edit" initial={modal.patient} rooms={rooms} onSave={updatePatient} onClose={()=>setModal(null)}/>}
      {modal?.type==="bill" && (
        <BillModal
          patient={patients.find(p=>p.pid===modal.patient.pid)||modal.patient}
          rooms={rooms}
          onClose={()=>setModal(null)}
          onAddTreatment={addTreatment}
          onTogglePaid={togglePaid}
          onDischarge={dischargePatient}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div style={{ position:"fixed",top:20,right:20,zIndex:300,padding:"12px 20px",borderRadius:12,
                      fontSize:13.5,fontWeight:600,background:toast.ok?"#0F172A":"#DC2626",color:"white",
                      boxShadow:"0 8px 28px rgba(0,0,0,.25)",display:"flex",alignItems:"center",gap:10,
                      animation:"slideLeft .25s cubic-bezier(.16,1,.3,1)" }}>
          {toast.ok?"✓":"⚠"} {toast.msg}
        </div>
      )}

      {/* ── Page Header ── */}
      <div style={{ background:"linear-gradient(135deg,#1D4ED8 0%,#2563EB 60%,#0EA5E9 100%)",
                    padding:"22px 24px", boxShadow:"0 2px 12px rgba(37,99,235,.3)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12 }}>
          <div>
            <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
              <div style={{ width:38,height:38,borderRadius:10,background:"rgba(255,255,255,.15)",
                            display:"flex",alignItems:"center",justifyContent:"center",fontSize:20 }}>🏥</div>
              <div>
                <h1 style={{ fontSize:20,fontWeight:800,color:"white",margin:0,letterSpacing:"-.4px" }}>
                  Receptionist Portal
                </h1>
                <p style={{ fontSize:12,color:"rgba(255,255,255,.65)",margin:0 }}>MediCore HMS · {today}</p>
              </div>
            </div>
          </div>
          <div style={{ display:"flex",gap:10,alignItems:"center" }}>
            <div style={{ background:"rgba(255,255,255,.12)",borderRadius:10,padding:"8px 16px",border:"1px solid rgba(255,255,255,.2)" }}>
              <div style={{ fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:600,letterSpacing:".05em" }}>OUTSTANDING</div>
              <div style={{ fontSize:16,fontWeight:800,color:"#FBBF24" }}>{fmt$(kpis.outstanding)}</div>
            </div>
            <div style={{ background:"rgba(255,255,255,.12)",borderRadius:10,padding:"8px 16px",border:"1px solid rgba(255,255,255,.2)" }}>
              <div style={{ fontSize:11,color:"rgba(255,255,255,.6)",fontWeight:600,letterSpacing:".05em" }}>TOTAL BILLED</div>
              <div style={{ fontSize:16,fontWeight:800,color:"#34D399" }}>{fmt$(kpis.totalRev)}</div>
            </div>
            <button onClick={()=>setModal({type:"add"})} style={{
              padding:"10px 20px",fontSize:13.5,fontWeight:700,border:"none",borderRadius:10,
              background:"white",color:"#1D4ED8",cursor:"pointer",
              display:"flex",alignItems:"center",gap:8,
              boxShadow:"0 3px 12px rgba(0,0,0,.15)",
            }}>
              <span style={{fontSize:18}}>+</span> New Patient
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding:"20px 24px" }}>

        {/* ── KPI Cards ── */}
        <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:22 }}>
          <StatCard delay={0}   icon="👥" label="Total Patients"  value={kpis.total}     sub="All records"             bg="#EFF6FF" color="#2563EB"/>
          <StatCard delay={60}  icon="🛏" label="Admitted"        value={kpis.admitted}  sub="Inpatients"              bg="#DBEAFE" color="#1D4ED8"/>
          <StatCard delay={120} icon="🚑" label="Outpatient"      value={kpis.outpatient}sub="Walk-in / referral"      bg="#ECFDF5" color="#059669"/>
          <StatCard delay={180} icon="🚨" label="Critical"        value={kpis.critical}  sub="Requires attention"      bg="#FEF2F2" color="#DC2626"/>
          <StatCard delay={240} icon="💰" label="Total Billed"    value={fmt$(kpis.totalRev)}      sub="All patients" bg="#F5F3FF" color="#7C3AED"/>
          <StatCard delay={300} icon="⏳" label="Outstanding"     value={fmt$(kpis.outstanding)}    sub="Awaiting payment" bg="#FFF7ED" color="#EA580C"/>
        </div>

        {/* ── Quick Room Status ── */}
        <div style={{ background:"white",borderRadius:14,border:"1px solid #E2E8F0",padding:"16px 20px",
                      marginBottom:18,boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
            <h3 style={{ fontSize:13.5,fontWeight:700,color:"#0F172A",margin:0 }}>🏨 Room Availability</h3>
            <span style={{ fontSize:12,color:"#94A3B8" }}>
              {rooms.filter(r=>r.status==="Available").length} available · {rooms.filter(r=>r.status==="Occupied").length} occupied
            </span>
          </div>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {rooms.map(r=>{
              const cfg=TYPE_CFG[r.type]||{bg:"#F1F5F9",color:"#374151"};
              const occ=r.status==="Occupied";
              return (
                <div key={r.id} style={{
                  padding:"8px 12px",borderRadius:9,fontSize:12,fontWeight:600,
                  background:occ?"#FEF2F2":cfg.bg,
                  color:occ?"#B91C1C":cfg.color,
                  border:`1px solid ${occ?"#FECACA":"transparent"}`,
                  display:"flex",flexDirection:"column",alignItems:"center",gap:2,minWidth:72,
                }}>
                  <span style={{ fontSize:11,fontWeight:700 }}>{r.number}</span>
                  <span style={{ fontSize:10,opacity:.8 }}>{r.type}</span>
                  <span style={{ width:8,height:8,borderRadius:"50%",background:occ?"#DC2626":"#16A34A",display:"inline-block",marginTop:2 }}/>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Filter bar ── */}
        <div style={{ background:"white",borderRadius:12,border:"1px solid #E2E8F0",
                      padding:"12px 16px",marginBottom:14,display:"flex",gap:10,alignItems:"center",flexWrap:"wrap" }}>
          {/* Status pills */}
          <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
            {["All","Admitted","Outpatient","Critical","Discharged"].map(s=>{
              const cfg=STATUS_CFG[s]; const active=statusF===s;
              return (
                <button key={s} onClick={()=>{setStatusF(s);setPage(1);}} style={{
                  padding:"6px 13px",fontSize:12,fontWeight:active?700:500,borderRadius:20,
                  border:active&&cfg?`1.5px solid ${cfg.dot}33`:"1px solid #E2E8F0",
                  background:active?(cfg?cfg.bg:"#DBEAFE"):"white",
                  color:active?(cfg?cfg.color:"#1D4ED8"):"#64748B",
                  cursor:"pointer",transition:"all .15s",
                }}>
                  {s}
                  <span style={{ marginLeft:5,fontSize:10.5,fontWeight:700,
                                  background:"rgba(0,0,0,.07)",padding:"1px 6px",borderRadius:20 }}>
                    {statusCounts[s]||0}
                  </span>
                </button>
              );
            })}
          </div>

          <div style={{ flex:1 }}/>

          {/* Search */}
          <div style={{ position:"relative",minWidth:220 }}>
            <span style={{ position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF",fontSize:14 }}>🔍</span>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
              placeholder="Search name, ID, phone…"
              style={{ width:"100%",padding:"8px 12px 8px 30px",fontSize:13,border:"1.5px solid #E2E8F0",
                       borderRadius:9,background:"#F8FAFC",color:"#0F172A",outline:"none",
                       boxSizing:"border-box",fontFamily:"inherit" }}/>
            {search && <button onClick={()=>setSearch("")} style={{ position:"absolute",right:9,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",cursor:"pointer",color:"#9CA3AF",fontSize:14 }}>✕</button>}
          </div>
          <span style={{ fontSize:12,color:"#94A3B8",whiteSpace:"nowrap" }}>{filtered.length} patients</span>
        </div>

        {/* ── Patient Table ── */}
        <div style={{ background:"white",borderRadius:14,border:"1px solid #E2E8F0",
                      overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%",borderCollapse:"collapse",fontSize:13 }}>
              <thead>
                <tr style={{ background:"#F8FAFC",borderBottom:"1px solid #E2E8F0" }}>
                  {["Patient","Contact","Doctor","Room","Status","Total Bill","Actions"].map(h=>(
                    <th key={h} style={{ padding:"11px 15px",textAlign:"left",fontWeight:700,
                        color:"#64748B",fontSize:11,textTransform:"uppercase",
                        letterSpacing:".06em",whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length===0?(
                  <tr><td colSpan={7} style={{ padding:"60px",textAlign:"center",color:"#94A3B8" }}>
                    <div style={{fontSize:32,marginBottom:10}}>👥</div>
                    <div style={{fontSize:14,fontWeight:700,color:"#64748B"}}>No patients found</div>
                  </td></tr>
                ):paginated.map((p,i)=>{
                  const doctor=DOCTORS.find(d=>d.id===p.doctorId);
                  const room=rooms.find(r=>r.id===p.roomId);
                  const {total}=calcPatientTotal(p,rooms);
                  const sc=STATUS_CFG[p.status]||STATUS_CFG.Outpatient;
                  return (
                    <tr key={p.pid}
                      style={{ borderTop:"1px solid #F1F5F9",transition:"background .1s",
                               animation:`fadeIn .22s ease both`,animationDelay:`${i*28}ms` }}
                      onMouseOver={e=>e.currentTarget.style.background="#F8FAFC"}
                      onMouseOut={e=>e.currentTarget.style.background="transparent"}
                    >
                      {/* Patient */}
                      <td style={{padding:"12px 15px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:9}}>
                          <Avatar name={p.name} size={32}/>
                          <div>
                            <div style={{fontWeight:700,color:"#0F172A",fontSize:13}}>{p.name}</div>
                            <div style={{fontSize:11,color:"#94A3B8"}}>{p.pid} · {p.blood||"—"} · Age {p.age||"—"}</div>
                          </div>
                        </div>
                      </td>
                      {/* Contact */}
                      <td style={{padding:"12px 15px"}}>
                        <div style={{fontSize:12.5,color:"#374151"}}>{p.phone}</div>
                        <div style={{fontSize:11,color:"#94A3B8"}}>{p.email||"—"}</div>
                      </td>
                      {/* Doctor */}
                      <td style={{padding:"12px 15px"}}>
                        {doctor?(
                          <div style={{display:"flex",alignItems:"center",gap:7}}>
                            <div style={{width:24,height:24,borderRadius:"50%",background:doctor.color,display:"flex",alignItems:"center",justifyContent:"center",color:"white",fontWeight:800,fontSize:9,flexShrink:0}}>{doctor.avatar}</div>
                            <div>
                              <div style={{fontSize:12.5,fontWeight:600,color:"#374151"}}>{doctor.name}</div>
                              <div style={{fontSize:10.5,color:"#94A3B8"}}>{doctor.dept}</div>
                            </div>
                          </div>
                        ):<span style={{fontSize:12.5,color:"#94A3B8"}}>—</span>}
                      </td>
                      {/* Room */}
                      <td style={{padding:"12px 15px"}}>
                        {room?(
                          <span style={{fontSize:12,fontWeight:600,background:TYPE_CFG[room.type]?.bg||"#F1F5F9",color:TYPE_CFG[room.type]?.color||"#374151",padding:"3px 10px",borderRadius:20}}>
                            {room.number} · {room.type}
                          </span>
                        ):<span style={{fontSize:12,color:"#94A3B8"}}>Outpatient</span>}
                      </td>
                      {/* Status */}
                      <td style={{padding:"12px 15px"}}><Badge status={p.status}/></td>
                      {/* Total */}
                      <td style={{padding:"12px 15px"}}>
                        <div style={{fontWeight:800,color:"#0F172A",fontSize:13.5}}>{fmt$(total)}</div>
                        <div style={{fontSize:11,color:"#94A3B8"}}>{p.admitDate} onward</div>
                      </td>
                      {/* Actions */}
                      <td style={{padding:"12px 15px"}}>
                        <div style={{display:"flex",gap:5}}>
                          {[
                            {icon:"💰",title:"Bill / Treatments",bg:"#F5F3FF",border:"#DDD6FE",color:"#6D28D9",fn:()=>openBill(p)},
                            {icon:"✏️",title:"Edit",bg:"#F0FDF4",border:"#BBF7D0",color:"#166534",fn:()=>setModal({type:"edit",patient:p})},
                          ].map(({icon,title,bg,border,color,fn})=>(
                            <button key={title} onClick={fn} title={title} style={{
                              width:30,height:30,borderRadius:7,border:`1px solid ${border}`,
                              background:bg,color,cursor:"pointer",fontSize:13,
                              display:"flex",alignItems:"center",justifyContent:"center",
                              transition:"transform .12s",
                            }}
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
          <div style={{ padding:"12px 16px",borderTop:"1px solid #F1F5F9",
                        display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10 }}>
            <span style={{fontSize:12.5,color:"#64748B"}}>
              Showing <strong style={{color:"#0F172A"}}>{Math.min((page-1)*PAGE+1,filtered.length)}–{Math.min(page*PAGE,filtered.length)}</strong> of <strong style={{color:"#0F172A"}}>{filtered.length}</strong>
            </span>
            <div style={{display:"flex",gap:5}}>
              {[{l:"‹",fn:()=>setPage(p=>Math.max(1,p-1)),d:page===1},
                ...Array.from({length:totalPages},(_,i)=>({l:String(i+1),fn:()=>setPage(i+1),cur:page===i+1})),
                {l:"›",fn:()=>setPage(p=>Math.min(totalPages,p+1)),d:page===totalPages}
              ].map((b,i)=>(
                <button key={i} onClick={b.fn} disabled={b.d} style={{
                  minWidth:30,height:30,padding:"0 7px",fontSize:12.5,fontWeight:b.cur?700:500,
                  border:"1px solid #E2E8F0",borderRadius:7,
                  background:b.cur?"#2563EB":b.d?"#F8FAFC":"white",
                  color:b.cur?"white":b.d?"#CBD5E1":"#374151",
                  cursor:b.d?"default":"pointer",
                }}>{b.l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes slideUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:none} }
        @keyframes slideLeft{from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:none} }
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        *{box-sizing:border-box;margin:0;padding:0;}
        input::placeholder,textarea::placeholder{color:#CBD5E1;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:4px;}
        select,input,textarea{font-family:inherit;}
      `}</style>
    </div>
  );
}