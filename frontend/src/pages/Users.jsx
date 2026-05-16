import { useState, useMemo , useEffect } from "react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
// ── Enums (mirroring C# MyApi.Backend.Enum) ───────────────────────────────
const Role   = { Admin: "ADMIN", Doctor: "DOCTOR", Receptionist: "RECEPTIONIST", Clinic: "CLINIC" };
const Gender = { Male: "Male", Female: "Female", Other: "Other" };

// ── Seed data ─────────────────────────────────────────────────────────────
let nextId = 7;
const SEED = [
  { userId:1, userName:"Dr. Rajan Patel",     userEmail:"r.patel@medicore.io",    userRole:Role.Doctor,        userGender:Gender.Male   },
  { userId:2, userName:"Linda Chen",           userEmail:"l.chen@medicore.io",     userRole:Role.Admin,         userGender:Gender.Female  },
  { userId:3, userName:"Thomas Weiss",         userEmail:"t.weiss@medicore.io",    userRole:Role.Nurse,         userGender:Gender.Male   },
  { userId:4, userName:"Aisha Nkosi",          userEmail:"a.nkosi@medicore.io",    userRole:Role.Receptionist,  userGender:Gender.Female  },
  { userId:5, userName:"Mei Suzuki",           userEmail:"m.suzuki@medicore.io",   userRole:Role.Pharmacist,    userGender:Gender.Female  },
  { userId:6, userName:"Carlos Rivera",        userEmail:"c.rivera@medicore.io",   userRole:Role.LabTechnician, userGender:Gender.Male   },
];

// ── Style tokens ──────────────────────────────────────────────────────────
const ROLE_CFG = {
  Admin:         { bg:"#EFF6FF", color:"#1E40AF", border:"#BFDBFE" },
  Doctor:        { bg:"#F0FDF4", color:"#14532D", border:"#BBF7D0" },
  Clinic:         { bg:"#FFF7ED", color:"#92400E", border:"#FED7AA" },
  Receptionist:  { bg:"#F5F3FF", color:"#4C1D95", border:"#DDD6FE" },
};
const GENDER_CFG = {
  Male:   { icon:"♂", color:"#1D4ED8", bg:"#EFF6FF" },
  Female: { icon:"♀", color:"#BE185D", bg:"#FDF2F8" },
  Other:  { icon:"⚥", color:"#6D28D9", bg:"#F5F3FF" },
};
const avatarPalette = ["#2563EB","#059669","#DC2626","#7C3AED","#EA580C","#0891B2","#DB2777","#065F46"];
const avatarColor = (name) => { let h=0; for(const c of name) h=(h*31+c.charCodeAt(0))&0xFFFF; return avatarPalette[Math.abs(h)%avatarPalette.length]; };
const initials    = (name) => name.split(" ").slice(0,2).map(w=>w[0]).join("").toUpperCase();

// ── Shared input style ─────────────────────────────────────────────────────
const inp = (err) => ({
  width:"100%", padding:"9px 13px", fontSize:"13.5px", boxSizing:"border-box",
  border:`1.5px solid ${err?"#FCA5A5":"#E2E8F0"}`, borderRadius:"9px",
  background: err?"#FFF5F5":"#F8FAFC", color:"#0F172A", outline:"none",
  fontFamily:"inherit", transition:"border-color .18s",
});
const LBL = { fontSize:"11.5px", fontWeight:700, color:"#475569", display:"block",
               marginBottom:"5px", textTransform:"uppercase", letterSpacing:"0.06em" };

// ── Validate ──────────────────────────────────────────────────────────────
function validate(form) {
  const e = {};
  if (!form.UserName.trim())        e.UserName  = "Name is required";
  if (!form.Email.trim())       e.Email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.Email)) e.Email = "Invalid email";
  if (!form.Role)               e.Role  = "Role is required";
  if (!form.userGender)             e.userGender= "Gender is required";
  return e;
}

// ── Modal ─────────────────────────────────────────────────────────────────
function UserModal({ mode, initial, onSave, onClose }) {
  const blank = { UserName:"", Email:"", Role:"", userGender:"" , Password:"", };
  const [form, setForm]   = useState(mode==="edit" ? { ...initial } : blank);
  const [errs, setErrs]   = useState({});
  const [focused, setFocused] = useState(null);

  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrs(e=>({...e,[k]:""})); };

  const submit = async() => {
    const e = validate(form);
    form.Role = form.Role.toUpperCase();
    form.userGender = form.userGender.toUpperCase();
    form.Password = `${form.UserName.replaceAll(" ","").toLowerCase()}@123`;
    
    if (Object.keys(e).length) { setErrs(e); return; }
    onSave(form);
  };

  const isEdit = mode === "edit";
  const title  = isEdit ? "Edit User" : "Add New User";

  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:100,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:"20px",
                  backdropFilter:"blur(2px)", animation:"fadeIn .18s ease" }}>
      <div style={{ background:"#fff", borderRadius:"18px", width:"100%", maxWidth:"500px",
                    boxShadow:"0 30px 80px rgba(0,0,0,.22)", overflow:"hidden",
                    animation:"slideUp .22s cubic-bezier(.16,1,.3,1)" }}>

        {/* Header */}
        <div style={{ background: isEdit
            ? "linear-gradient(135deg,#0F172A,#1E3A5F)"
            : "linear-gradient(135deg,#1D4ED8,#2563EB,#0EA5E9)",
            padding:"22px 28px", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <p style={{ margin:0, fontSize:"10.5px", fontWeight:700, color:"rgba(255,255,255,0.5)",
                        textTransform:"uppercase", letterSpacing:".1em", marginBottom:4 }}>
              {isEdit ? `USER #${initial.userId}` : "NEW RECORD"}
            </p>
            <h2 style={{ margin:0, color:"#fff", fontSize:"18px", fontWeight:800, letterSpacing:"-.3px" }}>{title}</h2>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.12)", border:"none",
              color:"white", width:"32px", height:"32px", borderRadius:"8px", cursor:"pointer",
              fontSize:"17px", display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ padding:"24px 28px" }}>
          {/* userName */}
          <div style={{ marginBottom:16 }}>
            <label style={LBL}>Full Name <span style={{color:"#EF4444"}}>*</span></label>
            <input value={form.userName} placeholder="e.g. Dr. Jane Smith"
              style={{ ...inp(errs.userName), borderColor: focused==="name"?"#2563EB": errs.userName?"#FCA5A5":"#E2E8F0",
                       boxShadow: focused==="name"?"0 0 0 3px rgba(37,99,235,.1)":"none" }}
              onFocus={()=>setFocused("name")} onBlur={()=>setFocused(null)}
              onChange={e=>set("UserName",e.target.value)} />
            {errs.userName && <p style={{fontSize:"11.5px",color:"#EF4444",margin:"4px 0 0"}}>{errs.userName}</p>}
          </div>

          {/* userEmail */}
          <div style={{ marginBottom:16 }}>
            <label style={LBL}>Email Address <span style={{color:"#EF4444"}}>*</span></label>
            <input value={form.Email} placeholder="user@hospital.org" type="email"
              style={{ ...inp(errs.Email), borderColor: focused==="email"?"#2563EB": errs.Email?"#FCA5A5":"#E2E8F0",
                       boxShadow: focused==="email"?"0 0 0 3px rgba(37,99,235,.1)":"none" }}
              onFocus={()=>setFocused("email")} onBlur={()=>setFocused(null)}
              onChange={e=>set("Email",e.target.value)} />
            {errs.userEmail && <p style={{fontSize:"11.5px",color:"#EF4444",margin:"4px 0 0"}}>{errs.userEmail}</p>}
          </div>

          {/* userRole */}
          <div style={{ marginBottom:16 }}>
            <label style={LBL}>Role <span style={{color:"#EF4444"}}>*</span></label>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {Object.keys(Role).map(r => {
                const cfg = ROLE_CFG[r];
                const active = form.Role == r;
                return (
                  <button key={r} onClick={()=>set("Role",r)} style={{
                    padding:"8px 6px", fontSize:"12px", fontWeight: active?700:500,
                    borderRadius:"9px", cursor:"pointer", transition:"all .15s",
                    border:`1.5px solid ${active ? cfg.border : "#E2E8F0"}`,
                    background: active ? cfg.bg : "#F8FAFC",
                    color: active ? cfg.color : "#64748B",
                    boxShadow: active ? `0 0 0 3px ${cfg.border}55` : "none",
                  }}>{r}</button>
                );
              })}
            </div>
            {errs.userRole && <p style={{fontSize:"11.5px",color:"#EF4444",margin:"4px 0 0"}}>{errs.userRole}</p>}
          </div>

          {/* userGender */}
          <div style={{ marginBottom:22 }}>
            <label style={LBL}>Gender <span style={{color:"#EF4444"}}>*</span></label>
            <div style={{ display:"flex", gap:10 }}>
              {Object.keys(Gender).map(g => {
                const cfg = GENDER_CFG[g];
                const active = form.userGender === g;
                return (
                  <button key={g} onClick={()=>set("userGender",g)} style={{
                    flex:1, padding:"9px 8px", fontSize:"13px", fontWeight: active?700:500,
                    borderRadius:"10px", cursor:"pointer", transition:"all .15s",
                    border:`1.5px solid ${active ? cfg.color+"55" : "#E2E8F0"}`,
                    background: active ? cfg.bg : "#F8FAFC",
                    color: active ? cfg.color : "#64748B",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                    boxShadow: active ? `0 0 0 3px ${cfg.color}18` : "none",
                  }}>
                    <span style={{fontSize:15}}>{cfg.icon}</span> {g}
                  </button>
                );
              })}
            </div>
            {errs.userGender && <p style={{fontSize:"11.5px",color:"#EF4444",margin:"4px 0 0"}}>{errs.userGender}</p>}
          </div>

          {/* Actions */}
          <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
            <button onClick={onClose} style={{ padding:"10px 20px", fontSize:"13.5px", fontWeight:600,
                border:"1.5px solid #E2E8F0", borderRadius:"9px", background:"#fff", color:"#475569", cursor:"pointer" }}>
              Cancel
            </button>
            <button onClick={submit} style={{ padding:"10px 26px", fontSize:"13.5px", fontWeight:700,
                border:"none", borderRadius:"9px", cursor:"pointer", color:"white",
                background: isEdit
                  ? "linear-gradient(135deg,#0F172A,#1E3A5F)"
                  : "linear-gradient(135deg,#1D4ED8,#2563EB)",
                boxShadow: isEdit ? "0 3px 10px rgba(15,23,42,.35)" : "0 3px 10px rgba(37,99,235,.35)" }}>
              {isEdit ? "💾 Save Changes" : "✓ Create User"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete Confirm Modal ───────────────────────────────────────────────────
function DeleteModal({ user, onConfirm, onClose }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:100,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:"20px",
                  backdropFilter:"blur(2px)", animation:"fadeIn .18s ease" }}>
      <div style={{ background:"#fff", borderRadius:"16px", width:"100%", maxWidth:"380px",
                    padding:"32px 28px", boxShadow:"0 30px 80px rgba(0,0,0,.2)", textAlign:"center",
                    animation:"slideUp .22s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ width:58, height:58, borderRadius:"50%", background:"#FEE2E2",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      margin:"0 auto 16px", fontSize:26 }}>🗑️</div>
        <h3 style={{ fontSize:17, fontWeight:800, color:"#0F172A", margin:"0 0 8px", letterSpacing:"-.3px" }}>
          Delete User
        </h3>
        <p style={{ fontSize:13.5, color:"#64748B", margin:"0 0 6px", lineHeight:1.6 }}>
          You're about to permanently delete
        </p>
        <p style={{ fontSize:14, fontWeight:700, color:"#0F172A", margin:"0 0 24px" }}>
          {user.userName}
        </p>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} style={{ flex:1, padding:"10px", fontSize:13.5, fontWeight:600,
              border:"1.5px solid #E2E8F0", borderRadius:"9px", background:"#fff", color:"#475569", cursor:"pointer" }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{ flex:1, padding:"10px", fontSize:13.5, fontWeight:700,
              border:"none", borderRadius:"9px", background:"linear-gradient(135deg,#DC2626,#EF4444)",
              color:"white", cursor:"pointer", boxShadow:"0 3px 10px rgba(220,38,38,.3)" }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── View Modal ────────────────────────────────────────────────────────────
function ViewModal({ user, onClose, onEdit }) {
  const rc  = ROLE_CFG[user.userRole]   || {};
  const gc  = GENDER_CFG[user.userGender] || {};
  const ac  = avatarColor(user.userName);
  const Gender =["MALE","FEMALE","OTHER"];
  const userrole = [ "ADMIN","RECEPTIONIST","CLINIC","DOCTOR"];
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(15,23,42,0.55)", zIndex:100,
                  display:"flex", alignItems:"center", justifyContent:"center", padding:"20px",
                  backdropFilter:"blur(2px)", animation:"fadeIn .18s ease" }}>
      <div style={{ background:"#fff", borderRadius:"18px", width:"100%", maxWidth:"400px",
                    boxShadow:"0 30px 80px rgba(0,0,0,.2)", overflow:"hidden",
                    animation:"slideUp .22s cubic-bezier(.16,1,.3,1)" }}>
        <div style={{ background:"linear-gradient(135deg,#0F172A 0%,#1E293B 100%)", padding:"30px 26px", textAlign:"center", position:"relative" }}>
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14,
              background:"rgba(255,255,255,0.1)", border:"none", color:"white",
              width:30, height:30, borderRadius:8, cursor:"pointer", fontSize:15,
              display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ width:64, height:64, borderRadius:"50%", background:ac,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"white", fontWeight:800, fontSize:22, margin:"0 auto 12px",
                        border:"3px solid rgba(255,255,255,0.15)" }}>{initials(user.userName)}</div>
          <h2 style={{ color:"white", fontSize:17, fontWeight:800, margin:"0 0 6px", letterSpacing:"-.3px" }}>{user.userName}</h2>
          <p style={{ color:"rgba(255,255,255,0.5)", fontSize:12.5, margin:"0 0 14px" }}>{user.userEmail}</p>
          <div style={{ display:"flex", gap:8, justifyContent:"center" }}>
            <span style={{ fontSize:12, fontWeight:700, background:rc.bg, color:rc.color,
                           border:`1px solid ${rc.border}`, padding:"3px 12px", borderRadius:20 }}>{userrole[user.userRole]}</span>
            <span style={{ fontSize:12, fontWeight:600, background:gc.bg, color:gc.color,
                           padding:"3px 12px", borderRadius:20 }}>{gc.icon} {Gender[user.userGender]}</span>
          </div>
        </div>
        <div style={{ padding:"20px 26px" }}>
          {[["User ID",`#${user.userId}`],["Username",user.userName],["Email",user.userEmail],["Role",userrole[user.userRole]],["Gender",Gender[user.userGender]]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                                  padding:"10px 0", borderBottom:"1px solid #F1F5F9" }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:".06em" }}>{l}</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#0F172A" }}>{v}</span>
            </div>
          ))}
          <div style={{ display:"flex", gap:10, marginTop:18 }}>
            <button onClick={onClose} style={{ flex:1, padding:"10px", fontSize:13.5, fontWeight:600,
                border:"1.5px solid #E2E8F0", borderRadius:"9px", background:"#fff", color:"#475569", cursor:"pointer" }}>Close</button>
            <button onClick={onEdit} style={{ flex:1, padding:"10px", fontSize:13.5, fontWeight:700,
                border:"none", borderRadius:"9px", background:"linear-gradient(135deg,#1D4ED8,#2563EB)",
                color:"white", cursor:"pointer", boxShadow:"0 3px 10px rgba(37,99,235,.3)" }}>✏️ Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────
export default function Users() {
  const [users,      setUsers]      = useState([]);
  const [search,     setSearch]     = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [modal,      setModal]      = useState(null); // null | {type:"add"} | {type:"edit",user} | {type:"delete",user} | {type:"view",user}
  const [page,       setPage]       = useState(1);
  const [toast,      setToast]      = useState(null);
  const [loading, setLoading] = useState(true);
  const PAGE = 8;

  const showToast = (msg, ok=true) => {
    setToast({ msg, ok });
    setTimeout(()=>setToast(null), 3000);
  };

  // ── CRUD ops ─────────────────────────────────────────────────────────
  const handleCreate = async(form) => {

    const response = await fetch('http://localhost:5002/api/user',{
      method:"POST",
      headers:{"Content-Type" :"application/json"},
      body:JSON.stringify(form)
    })
    if(response.status){
      setModal(null);
      showToast(`User "${form.UserName}" created successfully.`);
    }
  };

  const handleUpdate = (form) => {
    setUsers(u => u.map(x => x.userId === modal.user.userId ? { ...x, ...form } : x));
    setModal(null);
    showToast(`User "${form.userName}" updated successfully.`);
  };

  const handleDelete = () => {
    setUsers(u => u.filter(x => x.userId !== modal.user.userId));
    showToast(`User "${modal.user.userName}" deleted.`, false);
    setModal(null);
  };

  // ── Filter / paginate ─────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(u => {
      const mQ = !q || u.userName.toLowerCase().includes(q) || u.userEmail.toLowerCase().includes(q) || String(u.userId).includes(q);
      const mR = roleFilter === "All" || u.userRole === roleFilter;
      return mQ && mR;
    });
  }, [users, search, roleFilter]);

  const totalPages  = Math.max(1, Math.ceil(filtered.length / PAGE));
  const paginated   = filtered.slice((page-1)*PAGE, page*PAGE);
  const safePage    = (p) => setPage(Math.min(Math.max(1,p), totalPages));

  const roleCounts = useMemo(() => {
    const c = { All: users.length };
    users.forEach(u => c[u.userRole] = (c[u.userRole]||0)+1);
    return c;
  }, [users]);

  // ── Open edit from view modal ─────────────────────────────────────────
  const openEditFromView = () => {
    const u = modal.user;
    setModal({ type:"edit", user:u });
  };
  
  const [collapsed, setCollapsed] = useState(false);
  const [activePage, setActivePage] = useState("Users");
  const [activeTab, setActiveTab] = useState("All");
  const [mobileOpen,setMobileOpen] = useState(false);

  const usersFetch = async()=>{
    setLoading(true);
    const response = await fetch('http://localhost:5002/api/user/all',{
      method:"GET",
    })
    if(response.status==200){
      const datas = await response.json();
      setUsers(datas);
    }
    setLoading(false);
  }

  const Gender =["MALE","FEMALE","OTHER"];
  const userrole = [ "ADMIN","RECEPTIONIST","CLINIC","DOCTOR"];



  useEffect(()=>{
    usersFetch();
  },[])

  return (
    <div style={{ minHeight:"100vh",display:"flex",padding:"0",justifyContent:"space-between", background:"#F1F5F9", fontFamily:"'Sora','DM Sans',sans-serif" }}>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      {/* ── Modals ── */}
      {modal?.type === "add"    && <UserModal   mode="add"  onSave={handleCreate} onClose={()=>setModal(null)} />}
      {modal?.type === "edit"   && <UserModal   mode="edit" initial={modal.user} onSave={handleUpdate} onClose={()=>setModal(null)} />}
      {modal?.type === "delete" && <DeleteModal user={modal.user} onConfirm={handleDelete} onClose={()=>setModal(null)} />}
      {modal?.type === "view"   && <ViewModal   user={modal.user} onClose={()=>setModal(null)} onEdit={openEditFromView} />}

      {/* ── Toast ── */}

      {toast && (
        <div style={{ position:"fixed", top:22, right:22, zIndex:200,
                      padding:"12px 20px", borderRadius:"12px", fontSize:13.5, fontWeight:600,
                      background: toast.ok ? "#0F172A" : "#DC2626", color:"white",
                      boxShadow:"0 8px 28px rgba(0,0,0,.25)",
                      display:"flex", alignItems:"center", gap:10,
                      animation:"slideLeft .25s cubic-bezier(.16,1,.3,1)" }}>
          <span>{toast.ok ? "✓" : "🗑"}</span> {toast.msg}
        </div>
      )}

      {/* ── Page header ── */}
      <div style={{width:"100%"}}>
      <TopBar onMenuClick={() => setMobileOpen(true)} />
      <div style={{ background:"white", borderBottom:"1px solid #E2E8F0", padding:"20px 28px",
                    display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:3 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:"linear-gradient(135deg,#1D4ED8,#0EA5E9)",
                          display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>👤</div>
            <h1 style={{ fontSize:20, fontWeight:800, color:"#0F172A", margin:0, letterSpacing:"-.4px" }}>
              User Management
            </h1>
          </div>
          <p style={{ fontSize:12.5, color:"#64748B", margin:0 }}>
            {filtered.length} user{filtered.length!==1?"s":""} · Page {page} of {totalPages}
          </p>
        </div>
        <button onClick={()=>setModal({type:"add"})} style={{
          padding:"10px 20px", fontSize:13.5, fontWeight:700, border:"none", borderRadius:10,
          background:"linear-gradient(135deg,#1D4ED8,#2563EB)", color:"white", cursor:"pointer",
          display:"flex", alignItems:"center", gap:8,
          boxShadow:"0 3px 12px rgba(37,99,235,.35)", transition:"transform .15s",
        }}
          onMouseOver={e=>e.currentTarget.style.transform="translateY(-1px)"}
          onMouseOut={e=>e.currentTarget.style.transform="none"}
        >
          <span style={{fontSize:18}}>+</span> Add User
        </button>
      </div>

      <div style={{ padding:"24px 28px" }}>

        {/* ── Role filter pills ── */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:18 }}>
          {["All", ...Object.keys(Role)].map(r => {
            const cfg = r!=="All" ? ROLE_CFG[r] : null;
            const active = roleFilter === r;
            return (
              <button key={r} onClick={()=>{ setRoleFilter(r); setPage(1); }} style={{
                padding:"6px 14px", fontSize:12.5, fontWeight:active?700:500, borderRadius:30,
                border: active && cfg ? `1.5px solid ${cfg.border}` : "1px solid #E2E8F0",
                background: active ? (cfg ? cfg.bg : "#DBEAFE") : "white",
                color: active ? (cfg ? cfg.color : "#1D4ED8") : "#64748B",
                cursor:"pointer", transition:"all .15s",
                boxShadow: active ? "0 1px 4px rgba(0,0,0,.07)" : "none",
              }}>
                {r}
                <span style={{ marginLeft:6, fontSize:11, fontWeight:700,
                               background:"rgba(0,0,0,0.08)", padding:"1px 6px", borderRadius:20 }}>
                  {roleCounts[r]||0}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Search bar ── */}
        <div style={{ background:"white", borderRadius:12, border:"1px solid #E2E8F0",
                      padding:"12px 16px", marginBottom:16, display:"flex", gap:12, alignItems:"center" }}>
          <div style={{ flex:1, position:"relative" }}>
            <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#9CA3AF", fontSize:15 }}>🔍</span>
            <input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}}
              placeholder="Search by name, email or user ID…"
              style={{ width:"100%", padding:"8px 12px 8px 34px", fontSize:13, border:"1.5px solid #E2E8F0",
                       borderRadius:9, background:"#F8FAFC", color:"#0F172A", outline:"none",
                       boxSizing:"border-box", fontFamily:"inherit" }} />
            {search && (
              <button onClick={()=>setSearch("")} style={{ position:"absolute", right:10, top:"50%",
                  transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer",
                  color:"#9CA3AF", fontSize:16 }}>✕</button>
            )}
          </div>
          <span style={{ fontSize:12.5, color:"#94A3B8", whiteSpace:"nowrap" }}>
            {filtered.length} result{filtered.length!==1?"s":""}
          </span>
        </div>

        {/* ── Table ── */}
        <div style={{ background:"white", borderRadius:14, border:"1px solid #E2E8F0",
                      overflow:"hidden", boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13.5 }}>
              <thead>
                <tr style={{ background:"#F8FAFC", borderBottom:"1px solid #E2E8F0" }}>
                  {["User ID","Name","Email","Role","Gender","Actions"].map(h=>(
                    <th key={h} style={{ padding:"12px 16px", textAlign:"center", fontWeight:700,
                        color:"#64748B", fontSize:11, textTransform:"uppercase",
                        letterSpacing:".07em", whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
              {loading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i} style={{ borderTop: "1px solid #F1F5F9" }}>
                      {[...Array(6)].map((_, j) => (
                        <td key={j} style={{ padding: "16px" }}>
                          <div
                            style={{
                              height: "14px",
                              width: j === 1 ? "140px" : "80px",
                              borderRadius: "8px",
                              background:
                                "linear-gradient(90deg,#E2E8F0 25%,#F8FAFC 50%,#E2E8F0 75%)",
                              backgroundSize: "200% 100%",
                              animation: "shimmer 1.2s infinite",
                            }}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) :  paginated.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding:"64px", textAlign:"center", color:"#94A3B8" }}>
                    <div style={{fontSize:34,marginBottom:12}}>👥</div>
                    <div style={{fontSize:15,fontWeight:700,color:"#64748B"}}>No users found</div>
                    <div style={{fontSize:13,marginTop:5}}>Try adjusting your search or filters</div>
                  </td></tr>
                ) : paginated.map((u,i) => {
                  const rc  = ROLE_CFG[u.userRole]    || {};
                  const gc  = GENDER_CFG[u.userGender] || {};
                  const ac  = avatarColor(u.userName);
                  return (
                    <tr key={u.userId}
                      style={{ borderTop:"1px solid #F1F5F9", transition:"background .1s",
                               animation:`fadeIn .22s ease both`, animationDelay:`${i*30}ms` }}
                      onMouseOver={e=>e.currentTarget.style.background="#F8FAFC"}
                      onMouseOut={e=>e.currentTarget.style.background="transparent"}
                    >
                      {/* USER_ID */}
                      <td style={{padding:"13px 16px"}}>
                        <span style={{ fontSize:12, fontWeight:700, color:"#2563EB", fontFamily:"monospace",
                                       background:"#EFF6FF", padding:"3px 9px", borderRadius:6 }}>
                          #{u.userId}
                        </span>
                      </td>
                      {/* USER_NAME */}
                      <td style={{padding:"13px 16px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          <div style={{ width:34, height:34, borderRadius:"50%", background:ac, flexShrink:0,
                                        display:"flex", alignItems:"center", justifyContent:"center",
                                        color:"white", fontWeight:800, fontSize:12 }}>{initials(u.userName)}</div>
                          <span style={{fontWeight:600,color:"#0F172A"}}>{u.userName}</span>
                        </div>
                      </td>
                      {/* USER_EMAIL */}
                      <td style={{padding:"13px 16px",color:"#475569"}}>{u.userEmail}</td>
                      {/* USER_ROLE */}
                      <td style={{padding:"13px 16px"}}>
                        <span style={{ fontSize:12, fontWeight:700, background:rc.bg, color:rc.color,
                                       border:`1px solid ${rc.border}`, padding:"3px 11px", borderRadius:20 }}>
                          {userrole[u.userRole]}
                        </span>
                      </td>
                      {/* USER_GENDER */}
                      <td style={{padding:"13px 16px"}}>
                        <span style={{ fontSize:12.5, fontWeight:600, background:gc.bg, color:gc.color,
                                       padding:"3px 11px", borderRadius:20 }}>
                          {gc.icon} {Gender[u.userGender]}
                        </span>
                      </td>
                      {/* Actions */}
                      <td style={{padding:"13px 16px"}}>
                        <div style={{display:"flex",gap:6}}>
                          {[
                            { icon:"👁", title:"View",   bg:"#EFF6FF", border:"#BFDBFE", color:"#1D4ED8", fn:()=>setModal({type:"view",user:u}) },
                            { icon:"✏️", title:"Edit",   bg:"#F0FDF4", border:"#BBF7D0", color:"#166534", fn:()=>setModal({type:"edit",user:u}) },
                            { icon:"🗑", title:"Delete", bg:"#FEF2F2", border:"#FECACA", color:"#DC2626", fn:()=>setModal({type:"delete",user:u}) },
                          ].map(({icon,title,bg,border,color,fn})=>(
                            <button key={title} onClick={fn} title={title} style={{
                              width:30, height:30, borderRadius:7, border:`1px solid ${border}`,
                              background:bg, color, cursor:"pointer", fontSize:13,
                              display:"flex", alignItems:"center", justifyContent:"center",
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

          {/* ── Pagination ── */}
          <div style={{ padding:"13px 18px", borderTop:"1px solid #F1F5F9",
                        display:"flex", justifyContent:"space-between", alignItems:"center",
                        flexWrap:"wrap", gap:10 }}>
            <span style={{fontSize:12.5,color:"#64748B"}}>
              Showing <strong style={{color:"#0F172A"}}>{Math.min((page-1)*PAGE+1,filtered.length)}–{Math.min(page*PAGE,filtered.length)}</strong> of <strong style={{color:"#0F172A"}}>{filtered.length}</strong> users
            </span>
            <div style={{display:"flex",gap:5}}>
              {[
                { label:"«", fn:()=>safePage(1),        dis:page===1 },
                { label:"‹", fn:()=>safePage(page-1),   dis:page===1 },
                ...Array.from({length:totalPages},(_,i)=>({ label:String(i+1), fn:()=>safePage(i+1), cur:page===i+1 })),
                { label:"›", fn:()=>safePage(page+1),   dis:page===totalPages },
                { label:"»", fn:()=>safePage(totalPages),dis:page===totalPages },
              ].map((b,i)=>(
                <button key={i} onClick={b.fn} disabled={b.dis} style={{
                  minWidth:30, height:30, padding:"0 6px", fontSize:12.5,
                  fontWeight: b.cur?700:500,
                  border:"1px solid #E2E8F0", borderRadius:7,
                  background: b.cur?"#2563EB": b.dis?"#F8FAFC":"white",
                  color: b.cur?"white": b.dis?"#CBD5E1":"#374151",
                  cursor: b.dis?"default":"pointer",
                  boxShadow: b.cur?"0 1px 4px rgba(37,99,235,.3)":"none",
                }}>{b.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        @keyframes fadeIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:none} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }
        @keyframes slideLeft{ from{opacity:0;transform:translateX(20px)} to{opacity:1;transform:none} }
        *{box-sizing:border-box;margin:0;padding:0;}
        input::placeholder{color:#CBD5E1;}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:#E2E8F0;border-radius:4px;}
      `}</style>
    </div>
    </div>
  );
}