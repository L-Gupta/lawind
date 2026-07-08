import Image from "next/image";
import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import RotatingEarth from "@/components/ui/wireframe-dotted-globe";

const platformFeatures = [
  {
    title: "Legal Research",
    description:
      "Natural language search across Supreme Court judgments, High Court decisions, statutes, and regulations.",
  },
  {
    title: "AI Drafting Studio",
    description:
      "Generate NDAs, agreements, notices, and petitions from plain English instructions.",
  },
  {
    title: "Contract Review",
    description:
      "Clause extraction, risk identification, redline suggestions, and compliance analysis.",
  },
  {
    title: "Matter Management",
    description:
      "Case tracking, hearing schedules, client management, and team collaboration.",
  },
];

const segments = [
  {
    title: "Law Firms",
    description: "From Tier-1 full-service firms to specialized boutiques. Scale the expertise of your best partners across every matter, every team, every associate.",
  },
  {
    title: "Solo Advocates",
    description: "India's 1.3 million solo practitioners who can't afford SCC Online at ₹80,000/year. Affordable, powerful research at a fraction of the cost.",
  },
  {
    title: "Law Students",
    description: "Research that takes 8 hours now takes 45 minutes. Built for NLU students, moot court competitors, and the next generation of Indian advocates.",
  },
  {
    title: "In-House Legal",
    description: "GCs at listed companies, MNCs, and funded startups. Reduce external counsel spend and free your team for strategic work.",
  },
];

export default function Home() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-left">
          <div className="hero-rule" />
          <p className="ey">Indian legal intelligence</p>
          <h1>
            The operating system for
            <br />
            <em>Indian legal practice</em>
          </h1>
          <p>
            LawInd combines artificial intelligence with Indian legal knowledge —
            judgments, statutes, and workflows — to make legal work faster, more
            accurate, and more accessible.
          </p>
          <div className="hero-actions">
            <Link href="/#contact" className="btn-primary">
              Request access
            </Link>
            <Link href="/roi" className="btn-outline">
              Calculate your ROI
            </Link>
          </div>
        </div>
        <div className="home-hero-right">
          <Image
            src="/ladyjustice.png"
            alt="Lady Justice"
            width={1024}
            height={1536}
            priority
          />
        </div>
      </section>

      <section id="platform" className="section">
        <p className="ey" style={{ textAlign: "center" }}>
          Platform
        </p>
        <h2 className="section-title">
          Everything legal teams need,
          <br />
          <em>in one place</em>
        </h2>
        <p className="section-sub">
          Instead of disconnected tools for research, drafting, contract review,
          and matter management — perform all legal work from a single platform.
        </p>
        <div className="card-grid">
          {platformFeatures.map((feature) => (
            <div key={feature.title} className="feature-card">
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="segments" className="segments-section">
        <div className="segments-left">
          <p className="ey">Who it&apos;s for</p>
          <h2 className="section-title" style={{ textAlign: "left" }}>
            Built for every lawyer <em>in India</em>
          </h2>
          <p className="section-sub" style={{ textAlign: "left", margin: "0 0 2.5rem" }}>
            From the Supreme Court to your first moot — LawInd is built for
            the full breadth of Indian legal practice.
          </p>
          <ul className="segments-list">
            {segments.map((segment) => (
              <li key={segment.title}>
                <h3>{segment.title}</h3>
                <p>{segment.description}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="segments-right">
          <RotatingEarth width={480} height={480} />
        </div>
      </section>

      <section id="contact" className="contact-section">
        <p className="ey" style={{ color: "rgba(255,255,255,0.45)" }}>
          Early access
        </p>
        <h2>
          Request access to
          <br />
          <em>LawInd</em>
        </h2>
        <p>
          We&apos;re onboarding law firms and in-house teams across India. Join
          the waitlist to be first when we launch.
        </p>
        <WaitlistForm />
      </section>
    </>
  );
}
