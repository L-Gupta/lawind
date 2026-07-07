"use client";
import { useState } from "react";
import { logout } from "@/lib/auth";

type PanelKey = "research" | "drafting" | "contracts" | "matters" | "diligence" | "agents";

interface NavItem {
  key: PanelKey;
  label: string;
  locked: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { key: "research", label: "Research", locked: false },
  { key: "drafting", label: "Drafting Studio", locked: false },
  { key: "contracts", label: "Contract Review", locked: true },
  { key: "matters", label: "Matter Management", locked: true },
  { key: "diligence", label: "Due Diligence", locked: true },
  { key: "agents", label: "Workflow Agents", locked: true },
];

const EXAMPLE_QUERIES = [
  "What are the grounds for anticipatory bail under BNSS?",
  "Landmark SC judgments on Section 138 NI Act",
  "SEBI insider trading regulations 2015",
];

const LOCKED_PANEL_COPY: Record<Exclude<PanelKey, "research" | "drafting">, { title: string; sub: string }> = {
  contracts: { title: "Contract Intelligence", sub: "Available on Firm plan and above" },
  matters: { title: "Matter Management", sub: "Available on Individual plan and above" },
  diligence: { title: "Due Diligence", sub: "Available on Firm plan and above" },
  agents: { title: "Workflow Agents", sub: "Available on Enterprise plan only" },
};

function ResearchPanel() {
  const [query, setQuery] = useState("");

  return (
    <div className="dash-panel">
      <p className="ey">Research</p>
      <h1 className="panel-title">Legal Research</h1>

      <div className="research-search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask anything about Indian law..."
        />
        <button className="btn-primary">Search</button>
      </div>

      <div className="research-chips">
        {EXAMPLE_QUERIES.map((q) => (
          <button key={q} className="research-chip" onClick={() => setQuery(q)}>
            {q}
          </button>
        ))}
      </div>

      <div className="research-results-empty">
        Your research results will appear here
      </div>
    </div>
  );
}

function DraftingPanel() {
  return (
    <div className="dash-panel">
      <p className="ey">Drafting Studio</p>
      <h1 className="panel-title">AI Drafting Studio</h1>

      <div className="drafting-grid">
        <div className="drafting-form">
          <div className="form-field">
            <label>Document type</label>
            <select defaultValue="Legal Notice">
              <option>Legal Notice</option>
              <option>NDA</option>
              <option>Petition</option>
              <option>Agreement</option>
              <option>Vakalatnama</option>
            </select>
          </div>
          <div className="form-field">
            <label>Description</label>
            <textarea placeholder="Describe what you need in plain English..." />
          </div>
          <button className="btn-primary">Generate</button>
        </div>
        <div className="drafting-preview">
          Your drafted document will appear here
        </div>
      </div>
    </div>
  );
}

function LockedPanel({ panelKey }: { panelKey: Exclude<PanelKey, "research" | "drafting"> }) {
  const copy = LOCKED_PANEL_COPY[panelKey];
  return (
    <div className="dash-panel">
      <div className="locked-panel">
        <h2>{copy.title}</h2>
        <p>{copy.sub}</p>
        <button className="btn-primary">Upgrade plan</button>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState<PanelKey>("research");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function selectPanel(key: PanelKey) {
    setActivePanel(key);
    setSidebarOpen(false);
  }

  return (
    <div className="dashboard-layout">
      <div className="dashboard-topbar">
        <button
          className="sidebar-hamburger"
          aria-label="Toggle menu"
          onClick={() => setSidebarOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
        <span className="dashboard-topbar-logo">LawInd</span>
      </div>

      {sidebarOpen && (
        <div className="dashboard-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-logo">LawInd</div>

        <div className="sidebar-user">
          <p className="sidebar-user-name">Adv. Priya Sharma</p>
          <span className="sidebar-plan-badge">Solo Advocate</span>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`sidebar-nav-item ${activePanel === item.key ? "active" : ""} ${item.locked ? "locked" : ""}`}
              onClick={() => selectPanel(item.key)}
            >
              <span className="sidebar-icon-placeholder" />
              <span className="sidebar-nav-label">{item.label}</span>
              {item.locked && <span className="sidebar-lock">🔒</span>}
            </button>
          ))}
        </nav>

        <button className="sidebar-signout" onClick={logout}>
          Sign out
        </button>
      </aside>

      <main className="dashboard-main">
        {activePanel === "research" && <ResearchPanel />}
        {activePanel === "drafting" && <DraftingPanel />}
        {activePanel !== "research" && activePanel !== "drafting" && (
          <LockedPanel panelKey={activePanel} />
        )}
      </main>
    </div>
  );
}
