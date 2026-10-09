import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashBoard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  const cards = [
    {
      title: "Sports",
      desc: "Manage academy sports",
      btnText: "Manage Sports",
      btnBg: "#f59e0b",
      path: "/admin/manage-sports",
      icon: (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#f59e0b">
          <circle cx="12" cy="12" r="10" stroke="#f59e0b" strokeWidth="2" fill="#fffbeb" />
          <path d="M12 2a10 10 0 0 0 0 20M2 12a10 10 0 0 0 20 0M5 5l14 14M19 5L5 19" stroke="#f59e0b" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      title: "Branches",
      desc: "Manage academy branches",
      btnText: "Manage Branches",
      btnBg: "#2563eb",
      path: "/admin/manage-branches",
      icon: (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#2563eb">
          <rect x="4" y="2" width="16" height="20" rx="3" fill="#2563eb" />
          <rect x="7" y="5" width="3" height="3" rx="0.5" fill="#ffffff" />
          <rect x="14" y="5" width="3" height="3" rx="0.5" fill="#ffffff" />
          <rect x="7" y="10" width="3" height="3" rx="0.5" fill="#ffffff" />
          <rect x="14" y="10" width="3" height="3" rx="0.5" fill="#ffffff" />
          <rect x="7" y="15" width="3" height="3" rx="0.5" fill="#ffffff" />
          <rect x="14" y="15" width="3" height="3" rx="0.5" fill="#ffffff" />
        </svg>
      )
    },
    {
      title: "Coaches",
      desc: "Manage academy coaches",
      btnText: "Manage Coaches",
      btnBg: "#059669",
      path: "/admin/manage-coaches",
      icon: (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#059669">
          <circle cx="12" cy="7" r="4" fill="#059669" />
          <path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" fill="#059669" />
        </svg>
      )
    },
    {
      title: "Players",
      desc: "Manage academy players",
      btnText: "Manage Players",
      btnBg: "#dc2626",
      path: "/admin/manage-players",
      icon: (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#dc2626">
          <circle cx="14" cy="5" r="2.5" fill="#dc2626" />
          <path d="M7 21l3-6 3 2 2-5-3-2 1-4-3 1-2 4 3 2-2 4z" fill="#dc2626" />
        </svg>
      )
    },
    {
      title: "Training Programs",
      desc: "Manage training programs",
      btnText: "Manage Programs",
      btnBg: "#f59e0b",
      path: "/admin/manage-trainingprograms",
      icon: (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#f59e0b">
          <rect x="2" y="7" width="5" height="10" rx="1" fill="#f59e0b" />
          <rect x="17" y="7" width="5" height="10" rx="1" fill="#f59e0b" />
          <rect x="7" y="10.5" width="10" height="3" rx="0.5" fill="#f59e0b" />
        </svg>
      )
    },
    {
      title: "Batches",
      desc: "Manage player batches",
      btnText: "Manage Batches",
      btnBg: "#06b6d4",
      path: "/admin/manage-batches",
      icon: (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#06b6d4">
          <circle cx="9" cy="7" r="3" fill="#06b6d4" />
          <circle cx="15" cy="7" r="3" fill="#06b6d4" />
          <path d="M4 19v-2a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v2" fill="#06b6d4" />
        </svg>
      )
    },
    {
      title: "Memberships",
      desc: "Manage player memberships",
      btnText: "Manage Memberships",
      btnBg: "#2563eb",
      path: "/admin/manage-memberships",
      icon: (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#2563eb">
          <rect x="3" y="4" width="18" height="16" rx="3" fill="#2563eb" />
          <circle cx="8" cy="11" r="2.5" fill="#ffffff" />
          <rect x="13" y="9.5" width="5" height="1.5" rx="0.75" fill="#ffffff" />
          <rect x="13" y="12.5" width="5" height="1.5" rx="0.75" fill="#ffffff" />
          <path d="M5.5 17a2.5 2.5 0 0 1 5 0" fill="#ffffff" />
        </svg>
      )
    },
    {
      title: "Payments",
      desc: "Manage payment details",
      btnText: "Manage Payments",
      btnBg: "#059669",
      path: "/admin/manage-payments",
      icon: (
        <svg width="44" height="44" viewBox="0 0 24 24" fill="#059669">
          <rect x="2" y="5" width="20" height="14" rx="3" fill="#059669" />
          <rect x="2" y="8" width="20" height="3" fill="#0f172a" />
          <rect x="5" y="14" width="4" height="2" rx="0.5" fill="#ffffff" />
        </svg>
      )
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      padding: "24px 36px",
      fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "32px"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "24px" }}>⚙️</span>
            <h1 style={{ color: "#ffffff", fontSize: "30px", fontWeight: "700", margin: 0 }}>
              Admin Dashboard
            </h1>
          </div>
          <p style={{ color: "#94a3b8", margin: "4px 0 0 34px", fontSize: "14px" }}>
            Ignite Sports Academy Management System
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "transparent",
            color: "#cbd5e1",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "6px",
            padding: "8px 18px",
            fontSize: "14px",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.backgroundColor = "rgba(220, 38, 38, 0.8)";
            e.currentTarget.style.borderColor = "transparent";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = "#cbd5e1";
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
          }}
        >
          Logout
        </button>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
        maxWidth: "1400px",
        margin: "0 auto"
      }}>
        {cards.map((c, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              padding: "30px 20px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: "220px",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.35)"
            }}
          >
            <div style={{ marginBottom: "14px" }}>
              {c.icon}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: "700", color: "#0f172a" }}>
                {c.title}
              </h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#64748b" }}>
                {c.desc}
              </p>
            </div>

            <button
              onClick={() => navigate(c.path)}
              style={{
                width: "80%",
                padding: "10px 14px",
                backgroundColor: c.btnBg,
                color: "#ffffff",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              {c.btnText}
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}