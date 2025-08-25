import React from "react";

const icons = {
  orders: (
    <svg viewBox="0 0 24 24" >
      <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" >
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" fill="none"/>
      <path d="M4 20c0-4 8-4 8-4s8 0 8 4" stroke="currentColor" strokeWidth="2" fill="none"/>
    </svg>
  ),
};

export default function Sidebar({ activeView, setView }) {
  return (
    <nav className="sidebar">
      <h2>LaundryMan</h2>
      <button
        className={activeView === "orders" ? "active" : ""}
        onClick={() => setView("orders")}
        aria-label="Assigned Orders"
      >
        {icons.orders}
        <span>Assigned Orders</span>
      </button>
      <button
        className={activeView === "profile" ? "active" : ""}
        onClick={() => setView("profile")}
        aria-label="Profile"
      >
        {icons.profile}
        <span>Profile</span>
      </button>
    </nav>
  );
}
// 