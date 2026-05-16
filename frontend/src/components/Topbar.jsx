import { useState, useEffect, useRef } from "react";

// ── Sample notifications ───────────────────────────────────────────────────
const INITIAL_NOTIFS = [
  { id:1, icon:"🚨", title:"Emergency in Room EM-01",      time:"2 min ago",  color:"#FEF2F2", border:"#FECACA", dot:"#DC2626", read:false },
  { id:2, icon:"💊", title:"Amoxicillin stock critical",   time:"15 min ago", color:"#FFF7ED", border:"#FED7AA", dot:"#EA580C", read:false },
  { id:3, icon:"📅", title:"APT-4821 confirmed",           time:"1 hr ago",   color:"#ECFDF5", border:"#A7F3D0", dot:"#059669", read:false },
  { id:4, icon:"👤", title:"New patient registered",       time:"2 hr ago",   color:"#EFF6FF", border:"#BFDBFE", dot:"#2563EB", read:true  },
  { id:5, icon:"🧪", title:"Lab results ready — P-10024", time:"3 hr ago",   color:"#F5F3FF", border:"#DDD6FE", dot:"#7C3AED", read:true  },
];

// ── Hooks ──────────────────────────────────────────────────────────────────
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return w;
}

function useClickOutside(ref, cb) {
  useEffect(() => {
    const fn = (e) => { if (ref.current && !ref.current.contains(e.target)) cb(); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [ref, cb]);
}

// ── TopBar ─────────────────────────────────────────────────────────────────
export default function TopBar({ onMenuClick }) {
  const width    = useWindowWidth();
  const isMobile = width < 768;
  const isTablet = width < 1100;

  const [today,         setToday]         = useState("");
  const [notifOpen,     setNotifOpen]     = useState(false);
  const [profileOpen,   setProfileOpen]   = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFS);
  const [searchFocused, setSearchFocused] = useState(false);

  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  useClickOutside(notifRef,   () => setNotifOpen(false));
  useClickOutside(profileRef, () => setProfileOpen(false));

  const unread = notifications.filter(n => !n.read).length;

  // ── Live date + shift ──────────────────────────────────────────────────
  useEffect(() => {
    const fmt = () => {
      const d      = new Date();
      const DAYS   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const h      = d.getHours();
      const shift  = h >= 18 ? "🌙 Evening" : h >= 12 ? "☀ Afternoon" : "🌅 Morning";
      setToday(`${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()} ${d.getFullYear()} · ${shift}`);
    };
    fmt();
    const t = setInterval(fmt, 60_000);
    return () => clearInterval(t);
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────
  const markAllRead  = () => setNotifications(n => n.map(x => ({ ...x, read:true })));
  const markOneRead  = (id) => setNotifications(n => n.map(x => x.id===id ? { ...x, read:true } : x));
  const closeAll     = () => { setNotifOpen(false); setProfileOpen(false); };

  // ── Shared icon-button style ───────────────────────────────────────────
  const iconBtn = (active) => ({
    width:36, height:36, borderRadius:9,
    border:"1px solid #E5E7EB",
    background: active ? "#EFF6FF" : "white",
    cursor:"pointer", fontSize:17, flexShrink:0,
    display:"flex", alignItems:"center", justifyContent:"center",
    transition:"background .15s, border-color .15s",
  });

  return (
    <>
      <header style={{
        height:       60,
        background:   "white",
        borderBottom: "1px solid #E5E7EB",
        display:      "flex",
        alignItems:   "center",
        padding:      `0 ${isMobile ? 14 : 22}px`,
        gap:          isMobile ? 8 : 12,
        position:     "sticky",
        top:          0,
        zIndex:       30,
        boxShadow:    "0 1px 0 #F1F5F9",
        boxSizing:    "border-box",
      }}>

        {/* ── Hamburger ────────────────────────────────────────────────── */}
        {(isMobile || isTablet) && (
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            style={{ ...iconBtn(false), color:"black", border:"1px solid #E5E7EB" }}
            onMouseOver={e => {e.currentTarget.style.background="black";e.currentTarget.style.color="#F1F5F9"}}
            onMouseOut={e  => {e.currentTarget.style.background="#F1F5F9";e.currentTarget.style.color="black"}}
          >☰</button>
        )}

        {/* ── Logo (mobile only — sidebar is hidden) ────────────────────── */}
        {isMobile && (
          <div style={{ display:"flex", alignItems:"center", gap:7, flexShrink:0 }}>
            <div style={{
              width:32, height:32, borderRadius:8,
              background:"linear-gradient(135deg,#2563EB,#0EA5E9)",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 2H15V7H20V9H15V22H9V9H4V7H9V2Z" fill="white"/>
              </svg>
            </div>
            <span style={{ fontWeight:800, fontSize:14, color:"#0F172A", letterSpacing:"-.3px" }}>
              MediCore
            </span>
          </div>
        )}

        {/* ── Search bar (hidden on mobile — icon instead) ──────────────── */}
        {!isMobile && (
          <div style={{ flex:1, maxWidth:380, position:"relative" }}>
            <span style={{
              position:"absolute", left:11, top:"50%", transform:"translateY(-50%)",
              color: searchFocused ? "#2563EB" : "#9CA3AF", fontSize:15, transition:"color .2s",
              pointerEvents:"none",
            }}>🔍</span>
            <input
              placeholder="Search patients, doctors, appointments…"
              onFocus={() => setSearchFocused(true)}
              onBlur={()  => setSearchFocused(false)}
              style={{
                width:        "100%",
                padding:      "8px 12px 8px 36px",
                fontSize:     13,
                border:       `1.5px solid ${searchFocused ? "#2563EB" : "#E5E7EB"}`,
                borderRadius: 10,
                background:   "#F9FAFB",
                color:        "#111827",
                outline:      "none",
                boxSizing:    "border-box",
                boxShadow:    searchFocused ? "0 0 0 3px rgba(37,99,235,.1)" : "none",
                transition:   "border-color .2s, box-shadow .2s",
                fontFamily:   "inherit",
              }}
            />
          </div>
        )}

        <div style={{ flex:1 }} />

        {/* ── Date chip (desktop only) ──────────────────────────────────── */}
        {!isTablet && (
          <div style={{
            fontSize:12, color:"#6B7280", whiteSpace:"nowrap",
            background:"#F8FAFC", border:"1px solid #F1F5F9",
            borderRadius:8, padding:"5px 12px", fontWeight:500,
          }}>
            {today}
          </div>
        )}

        {/* ── Search icon (mobile only) ─────────────────────────────────── */}
        {isMobile && (
          <button style={iconBtn(false)}>🔍</button>
        )}

        {/* ── Notification bell ─────────────────────────────────────────── */}
        <div ref={notifRef} style={{ position:"relative", flexShrink:0 }}>
          <button
            onClick={() => { setNotifOpen(v => !v); setProfileOpen(false); }}
            style={iconBtn(notifOpen)}
            onMouseOver={e => { if(!notifOpen) e.currentTarget.style.background="#F8FAFC"; }}
            onMouseOut={e  => { if(!notifOpen) e.currentTarget.style.background="white"; }}
          >🔔</button>

          {/* Badge */}
          {unread > 0 && (
            <span style={{
              position:"absolute", top:-5, right:-5,
              minWidth:18, height:18, borderRadius:20,
              background:"#DC2626", border:"2.5px solid white",
              color:"white", fontSize:10, fontWeight:700,
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:"0 4px", pointerEvents:"none",
            }}>{unread}</span>
          )}

          {/* ── Notification panel ── */}
          {notifOpen && (
            <div style={{
              position:     "absolute",
              top:          "calc(100% + 10px)",
              right:        isMobile ? -70 : 0,
              width:        isMobile ? "calc(100vw - 28px)" : 320,
              maxWidth:     340,
              background:   "white",
              borderRadius: 14,
              border:       "1px solid #E5E7EB",
              boxShadow:    "0 20px 60px rgba(0,0,0,.15)",
              zIndex:       50,
              overflow:     "hidden",
              animation:    "hmsDropIn .22s cubic-bezier(.16,1,.3,1)",
            }}>
              {/* Header */}
              <div style={{
                padding:"13px 16px", borderBottom:"1px solid #F1F5F9",
                display:"flex", justifyContent:"space-between", alignItems:"center",
              }}>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#0F172A" }}>Notifications</span>
                  {unread > 0 && (
                    <span style={{ fontSize:11, fontWeight:700, background:"#FEE2E2",
                                   color:"#DC2626", padding:"2px 7px", borderRadius:20 }}>
                      {unread} new
                    </span>
                  )}
                </div>
                {unread > 0 && (
                  <button onClick={markAllRead} style={{
                    fontSize:12, fontWeight:600, color:"#2563EB",
                    background:"none", border:"none", cursor:"pointer",
                  }}>Mark all read</button>
                )}
              </div>

              {/* Items */}
              <div style={{ maxHeight:300, overflowY:"auto" }}>
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markOneRead(n.id)}
                    style={{
                      display:"flex", alignItems:"flex-start", gap:10,
                      padding:"11px 16px", borderBottom:"1px solid #F8FAFC",
                      cursor:"pointer",
                      background: n.read ? "white" : "#FAFBFF",
                      transition:"background .12s",
                    }}
                    onMouseOver={e => e.currentTarget.style.background="#F8FAFC"}
                    onMouseOut={e  => e.currentTarget.style.background = n.read ? "white" : "#FAFBFF"}
                  >
                    <div style={{
                      width:34, height:34, borderRadius:9, flexShrink:0,
                      background:n.color, border:`1px solid ${n.border}`,
                      display:"flex", alignItems:"center", justifyContent:"center", fontSize:16,
                    }}>{n.icon}</div>

                    <div style={{ flex:1, minWidth:0 }}>
                      <p style={{
                        fontSize:12.5, fontWeight: n.read ? 500 : 700, color:"#0F172A",
                        margin:"0 0 3px", overflow:"hidden",
                        textOverflow:"ellipsis", whiteSpace:"nowrap",
                      }}>{n.title}</p>
                      <p style={{ fontSize:11, color:"#94A3B8", margin:0 }}>{n.time}</p>
                    </div>

                    {!n.read && (
                      <span style={{
                        width:8, height:8, borderRadius:"50%",
                        background:n.dot, flexShrink:0, marginTop:5,
                      }}/>
                    )}
                  </div>
                ))}
              </div>

              <div style={{ padding:"10px 16px", borderTop:"1px solid #F1F5F9", textAlign:"center" }}>
                <button style={{
                  fontSize:12.5, fontWeight:600, color:"#2563EB",
                  background:"none", border:"none", cursor:"pointer",
                }}>View all notifications →</button>
              </div>
            </div>
          )}
        </div>

        {/* ── Profile ───────────────────────────────────────────────────── */}
        <div ref={profileRef} style={{ position:"relative", flexShrink:0 }}>
          <button
            onClick={() => { setProfileOpen(v => !v); setNotifOpen(false); }}
            style={{
              display:"flex", alignItems:"center", gap:8,
              paddingLeft:12, borderLeft:"1px solid #E5E7EB",
              background:"none", border:"none",
              borderLeft:"1px solid #E5E7EB",
              cursor:"pointer",
            }}
          >
            {/* Avatar */}
            <div style={{
              width:35, height:35, borderRadius:"50%",
              background:"linear-gradient(135deg,#2563EB,#0EA5E9)",
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"white", fontWeight:800, fontSize:12, flexShrink:0,
              boxShadow: profileOpen ? "0 0 0 3px rgba(37,99,235,.25)" : "none",
              transition:"box-shadow .2s",
            }}>AD</div>

            {/* Name (hidden mobile) */}
            {!isMobile && (
              <>
                <div style={{ textAlign:"left" }}>
                  <div style={{ fontSize:13, fontWeight:700, color:"#111827", whiteSpace:"nowrap" }}>Dr. Admin</div>
                  <div style={{ fontSize:11, color:"#9CA3AF" }}>Super Admin</div>
                </div>
                <span style={{
                  color:"#9CA3AF", fontSize:11,
                  transform: profileOpen ? "rotate(180deg)" : "none",
                  transition:"transform .2s", display:"inline-block",
                }}>▾</span>
              </>
            )}
          </button>

          {/* ── Profile dropdown ── */}
          {profileOpen && (
            <div style={{
              position:"absolute",
              top:"calc(100% + 10px)",
              right:0,
              width:210,
              background:"white",
              borderRadius:14,
              border:"1px solid #E5E7EB",
              boxShadow:"0 20px 60px rgba(0,0,0,.14)",
              zIndex:50,
              overflow:"hidden",
              animation:"hmsDropIn .22s cubic-bezier(.16,1,.3,1)",
            }}>
              {/* User chip */}
              <div style={{ padding:"14px 16px", borderBottom:"1px solid #F1F5F9" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{
                    width:38, height:38, borderRadius:"50%",
                    background:"linear-gradient(135deg,#2563EB,#0EA5E9)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:"white", fontWeight:800, fontSize:13,
                  }}>AD</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:"#0F172A" }}>Dr. Admin</div>
                    <div style={{ fontSize:11, color:"#64748B" }}>admin@medicore.io</div>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              {[
                { icon:"👤", label:"My Profile"       },
                { icon:"⚙️", label:"Account Settings" },
                { icon:"🔒", label:"Change Password"  },
                { icon:"🌐", label:"Language"          },
              ].map(({ icon, label }) => (
                <button key={label} style={{
                  width:"100%", display:"flex", alignItems:"center", gap:10,
                  padding:"10px 16px", background:"none", border:"none",
                  cursor:"pointer", fontSize:13, color:"#374151", fontWeight:500,
                  transition:"background .12s", textAlign:"left",
                  fontFamily:"inherit",
                }}
                  onMouseOver={e => e.currentTarget.style.background="#F8FAFC"}
                  onMouseOut={e  => e.currentTarget.style.background="none"}
                >
                  <span style={{ fontSize:15 }}>{icon}</span>{label}
                </button>
              ))}

              <div style={{ height:1, background:"#F1F5F9", margin:"4px 0" }}/>

              <button style={{
                width:"100%", display:"flex", alignItems:"center", gap:10,
                padding:"10px 16px", background:"none", border:"none",
                cursor:"pointer", fontSize:13, color:"#DC2626", fontWeight:700,
                transition:"background .12s", textAlign:"left",
                fontFamily:"inherit",
              }}
                onMouseOver={e => e.currentTarget.style.background="#FEF2F2"}
                onMouseOut={e  => e.currentTarget.style.background="none"}
              >
                <span style={{ fontSize:15 }}>🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      <style>{`
        @keyframes hmsDropIn {
          from { opacity:0; transform:translateY(-8px) scale(.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}