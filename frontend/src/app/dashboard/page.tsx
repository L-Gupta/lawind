"use client";
import { useEffect, useState } from "react";
import { getUser, logout, PLAN_FEATURES, UserOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

const PLATFORM_FEATURES = [
  { key: "research", title: "Legal Research", desc: "Search SC, HC judgments, statutes, SEBI & RBI circulars", plans: ["student", "individual", "firm", "enterprise"] },
  { key: "drafting", title: "AI Drafting Studio", desc: "Generate petitions, contracts and notices from plain English", plans: ["individual", "firm", "enterprise"] },
  { key: "contracts", title: "Contract Intelligence", desc: "Review, redline and benchmark contracts automatically", plans: ["firm", "enterprise"] },
  { key: "matters", title: "Matter Management", desc: "Cases, clients, deadlines and documents in one place", plans: ["individual", "firm", "enterprise"] },
  { key: "diligence", title: "Due Diligence", desc: "Bulk-analyze data rooms and produce deal-ready reports", plans: ["firm", "enterprise"] },
  { key: "agents", title: "Workflow Agents", desc: "End-to-end automation for regulatory filings and briefs", plans: ["enterprise"] },
];

const PLAN_LABELS: Record<string, string> = {
  free: "Free",
  student: "Student",
  individual: "Individual",
  firm: "Firm",
  enterprise: "Enterprise",
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserOut | null>(null);

  useEffect(() => {
    const u = getUser();
    if (!u) { router.push("/login"); return; }
    setUser(u);
  }, [router]);

  if (!user) return null;

  const planFeatures = PLAN_FEATURES[user.plan] || [];

  return (
    <div className="dashboard">
      <div className="dash-header">
        <div>
          <p className="ey">Dashboard</p>
          <h1 className="dash-title">Welcome, <em>{user.full_name.split(" ")[0]}</em></h1>
        </div>
        <div className="dash-plan-badge">
          <span className="plan-label">{PLAN_LABELS[user.plan]} Plan</span>
          <button onClick={logout} className="btn-outline" style={{ fontSize: "11px", padding: "0.35rem 1rem" }}>Sign out</button>
        </div>
      </div>

      <div className="dash-body">
        <div className="dash-section">
          <h2 className="dash-section-title">Your plan includes</h2>
          <ul className="plan-features">
            {planFeatures.map(f => (
              <li key={f}><span className="check">✓</span>{f}</li>
            ))}
          </ul>
          {user.plan === "free" && (
            <div className="upgrade-banner">
              <p>Upgrade to unlock full legal research, drafting, and more.</p>
              <a href="/#pricing" className="btn-primary" style={{ fontSize: "12px", padding: "0.6rem 1.4rem" }}>View plans</a>
            </div>
          )}
        </div>

        <div className="dash-section">
          <h2 className="dash-section-title">Platform features</h2>
          <div className="feature-grid">
            {PLATFORM_FEATURES.map(f => {
              const unlocked = f.plans.includes(user.plan);
              return (
                <div key={f.key} className={`dash-feature-card ${unlocked ? "unlocked" : "locked"}`}>
                  <div className="dash-feature-top">
                    <h3>{f.title}</h3>
                    <span className={`access-badge ${unlocked ? "access-yes" : "access-no"}`}>
                      {unlocked ? "Available" : "Upgrade"}
                    </span>
                  </div>
                  <p>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
