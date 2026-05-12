import { useState ,useEffect } from "react";
export default function TopBar() {
    const [notif, setNotif] = useState(false);
    const [today,setToday] = useState("");

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
      
      setToday(`${day},${month} ${date}, ${year} `);
    }, []);

    return (
      <header style={{
        height: "60px", background: "white",
        borderBottom: "1px solid #E5E7EB",
        display: "flex", alignItems: "center",
        padding: "0 24px", gap: "16px",
        position: "sticky", top: 0, zIndex: 9,
      }}>
        {/* Search */}
        <div style={{ flex: 1, maxWidth: "360px", position: "relative" }}>
          <span style={{ position: "absolute", left: "11px", top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", fontSize: "15px" }}>🔍</span>
          <input
            placeholder="Search patients, doctors, appointments…"
            style={{
              width: "100%", padding: "8px 12px 8px 34px", fontSize: "13px",
              border: "1px solid #E5E7EB", borderRadius: "9px",
              background: "#F9FAFB", color: "#111827", outline: "none",
            }}
          />
        </div>
  
        <div style={{ flex: 1 }} />
  
        {/* Date */}
        <div style={{ fontSize: "12.5px", color: "#6B7280", whiteSpace: "nowrap" }}>
          {today}
        </div>
  
        {/* Notification bell */}
        <div style={{ position: "relative" }}>
          <button onClick={() => setNotif(v => !v)} style={{
            width: "38px", height: "38px", borderRadius: "9px", border: "1px solid #E5E7EB",
            background: "white", cursor: "pointer", fontSize: "17px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>🔔</button>
          <span style={{
            position: "absolute", top: "6px", right: "6px",
            width: "8px", height: "8px", borderRadius: "50%",
            background: "#DC2626", border: "2px solid white",
          }} />
        </div>
  
        {/* Avatar */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingLeft: "8px", borderLeft: "1px solid #E5E7EB" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "linear-gradient(135deg,#2563EB,#0EA5E9)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: "13px",
          }}>AD</div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "#111827" }}>Dr. Admin</div>
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>Super Admin</div>
          </div>
          <span style={{ color: "#9CA3AF", fontSize: "12px" }}>▾</span>
        </div>
      </header>
    );
  }