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
  { key: "contracts", label: "Contract Review", locked: false },
  { key: "matters", label: "Matter Management", locked: false },
  { key: "diligence", label: "Due Diligence", locked: false },
  { key: "agents", label: "Workflow Agents", locked: false },
];

const EXAMPLE_QUERIES = [
  "What are the grounds for anticipatory bail under BNSS?",
  "Landmark SC judgments on Section 138 NI Act",
  "SEBI insider trading regulations 2015",
];

const COMING_SOON_COPY: Record<Exclude<PanelKey, "research" | "drafting">, { title: string }> = {
  contracts: { title: "Contract Intelligence" },
  matters: { title: "Matter Management" },
  diligence: { title: "Due Diligence" },
  agents: { title: "Workflow Agents" },
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

function ComingSoonPanel({ panelKey }: { panelKey: Exclude<PanelKey, "research" | "drafting"> }) {
  const copy = COMING_SOON_COPY[panelKey];
  return (
    <div className="dash-panel">
      <div className="locked-panel">
        <h2>{copy.title}</h2>
        <p>Coming soon</p>
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
          <p className="sidebar-user-name">Admin</p>
          <span className="sidebar-plan-badge">All Plans</span>
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
          <ComingSoonPanel panelKey={activePanel} />
        )}
      </main>
    </div>
  );
}
