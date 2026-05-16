import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeartbeatIcon = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 14h4l3-8 4 16 3-10 2 2h8" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22"/>
    </svg>
  );

const ShieldIcon = () => (
  <svg width="13" height="13" fill="none" stroke="#6B7280" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async(e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    const response = await fetch(`http://localhost:5002/api/auth`,{
      method:'POST',
      headers:{'Content-Type':"application/json"},
      body:JSON.stringify({"email":email,"password":password})
    })

    if(response.status==200){
      const user = await response.json();
      if(user.userRole == 0){ // 0 IS STORED ad admin
         navigate("/dashboard");
      }else if(user.userRole == 1){
        navigate("/reception");
      }
    }
    setError("");
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  const inputBase = {
    width: "100%",
    padding: "11px 14px",
    fontSize: "14px",
    borderRadius: "10px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    backgroundColor: "#F9FAFB",
    color: "#111827",
    boxSizing: "border-box",
  };

  const getInputStyle = (name) => ({
    ...inputBase,
    border: focused === name ? "1.5px solid #2563EB" : "1.5px solid #E5E7EB",
    boxShadow: focused === name ? "0 0 0 3px rgba(37,99,235,0.1)" : "none",
  });

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 50%, #F0FDF4 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "24px",
    }}>
      {/* Background pattern */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0
      }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(37,99,235,0.04)" : "rgba(16,185,129,0.04)",
            width: `${180 + i * 80}px`,
            height: `${180 + i * 80}px`,
            top: `${[10, 60, 30, 70, 5, 80][i]}%`,
            left: `${[5, 80, 45, 20, 70, 55][i]}%`,
            transform: "translate(-50%, -50%)",
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "440px" }}>
        {/* Card */}
        <div style={{
          background: "#FFFFFF",
          borderRadius: "20px",
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07), 0 20px 60px -10px rgba(37,99,235,0.12)",
          border: "1px solid rgba(229,231,235,0.8)",
          overflow: "hidden",
        }}>
          {/* Header stripe */}
          <div style={{
            background: "linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #0EA5E9 100%)",
            padding: "32px 40px 28px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-20px", right: "-20px",
              width: "120px", height: "120px", borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
            }} />
            <div style={{
              position: "absolute", bottom: "-30px", left: "30%",
              width: "80px", height: "80px", borderRadius: "50%",
              background: "rgba(255,255,255,0.04)",
            }} />

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{
                width: "46px", height: "46px", borderRadius: "12px",
                background: "rgba(255,255,255,0.18)",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.25)",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 2H15V7H20V9H15V22H9V9H4V7H9V2Z" fill="white" fillOpacity="0.9"/>
                  <path d="M2 14h4l2-5 3 11 2-7 1.5 1.5H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                </svg>
              </div>
              <div>
                <div style={{ color: "white", fontWeight: 700, fontSize: "17px", letterSpacing: "-0.3px" }}>
                  MediCore HMS
                </div>
                <div style={{ color: "rgba(255,255,255,0.65)", fontSize: "11.5px", marginTop: "1px" }}>
                  Hospital Management System
                </div>
              </div>
            </div>

            <div style={{ color: "white", fontSize: "20px", fontWeight: 600, letterSpacing: "-0.4px" }}>
              Welcome back
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "13.5px", marginTop: "4px" }}>
              Sign in to your account to continue
            </div>
          </div>

          {/* Form */}
          <div style={{ padding: "32px 40px 36px" }}>
            {error && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "10px",
                padding: "10px 14px", marginBottom: "20px",
                display: "flex", alignItems: "center", gap: "8px",
                color: "#DC2626", fontSize: "13px",
              }}>
                <svg width="15" height="15" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>
                  Email address
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
                    color: focused === "email" ? "#2563EB" : "#9CA3AF", transition: "color 0.2s",
                  }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="you@hospital.org"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    style={{ ...getInputStyle("email"), paddingLeft: "40px" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "7px" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)",
                    color: focused === "password" ? "#2563EB" : "#9CA3AF", transition: "color 0.2s",
                  }}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    style={{ ...getInputStyle("password"), paddingLeft: "40px", paddingRight: "44px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: "#9CA3AF", padding: "2px", display: "flex", alignItems: "center",
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <div
                    onClick={() => setRememberMe(v => !v)}
                    style={{
                      width: "17px", height: "17px", borderRadius: "5px", cursor: "pointer",
                      border: rememberMe ? "2px solid #2563EB" : "2px solid #D1D5DB",
                      background: rememberMe ? "#2563EB" : "white",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.15s", flexShrink: 0,
                    }}
                  >
                    {rememberMe && (
                      <svg width="10" height="10" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 12 12">
                        <polyline points="2,6 5,9 10,3"/>
                      </svg>
                    )}
                  </div>
                  <span style={{ fontSize: "13px", color: "#4B5563", userSelect: "none" }}>Remember me</span>
                </label>
                <a href="#" style={{ fontSize: "13px", color: "#2563EB", textDecoration: "none", fontWeight: 500 }}
                  onMouseOver={e => e.target.style.textDecoration = "underline"}
                  onMouseOut={e => e.target.style.textDecoration = "none"}
                >
                  Forgot password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "12px",
                  fontSize: "14.5px",
                  fontWeight: 600,
                  borderRadius: "10px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  background: loading
                    ? "linear-gradient(135deg, #93C5FD, #60A5FA)"
                    : "linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #0EA5E9 100%)",
                  color: "white",
                  letterSpacing: "0.01em",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                }}
                onMouseOver={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; }}
              >
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
                    <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0 0" }}>
              <div style={{ flex: 1, height: "1px", background: "#F3F4F6" }} />
              <span style={{ fontSize: "12px", color: "#9CA3AF" }}>Secure access</span>
              <div style={{ flex: 1, height: "1px", background: "#F3F4F6" }} />
            </div>

            {/* Trust badges */}
            <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "14px" }}>
              {[
                { icon: "🔒", label: "256-bit SSL" },
                { icon: "🏥", label: "HIPAA Compliant" },
                { icon: "✓", label: "SOC 2 Certified" },
              ].map(({ icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                  <span style={{ fontSize: "11px" }}>{icon}</span>
                  <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <p style={{ fontSize: "12px", color: "#9CA3AF" }}>
            Having trouble? Contact{" "}
            <a href="#" style={{ color: "#2563EB", textDecoration: "none" }}>IT Support</a>
            {" "}or call ext. 1200
          </p>
          <p style={{ fontSize: "11.5px", color: "#D1D5DB", marginTop: "4px" }}>
            © 2026 MediCore Health Systems · v4.2.1
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        input::placeholder { color: #C4C9D4; }
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px #F9FAFB inset !important; }
      `}</style>
    </div>
  );
}