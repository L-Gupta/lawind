import Link from "next/link";

const founders = [
  {
    initials: "SN",
    name: "Sannah Nagpal",
    title: "Chief Executive Officer & Co-Founder",
    description:
      "Sannah leads LawInd's vision, strategy, and operations. With a deep understanding of the Indian legal market and a passion for making legal intelligence accessible, she is building LawInd into India's default legal operating system.",
  },
  {
    initials: "SM",
    name: "Shlok Maurya",
    title: "Founder & IP Originator",
    description:
      "Shlok conceived and originated the LawInd platform — its architecture, positioning, and product vision. As the intellectual property originator and strategic advisor, he shapes the long-term direction of the company.",
  },
];

const missionPoints = [
  {
    title: "India-first",
    text: "Built on Indian statutes, Supreme Court and High Court judgments, and the regulatory frameworks that Indian lawyers actually use.",
  },
  {
    title: "Accessible to all",
    text: "From NLU students to senior partners at Tier-1 firms. Every Indian lawyer deserves powerful legal intelligence.",
  },
  {
    title: "Built to last",
    text: "A platform so deeply embedded in how Indian lawyers work that switching becomes unthinkable. That is the goal.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="about-hero">
        <div className="rule" />
        <p className="ey">Our story</p>
        <h1 className="section-title">
          Built by lawyers, for lawyers — powered by India
        </h1>
        <p className="section-sub">
          LawInd was founded on a simple belief: that every Indian lawyer
          deserves access to institutional-grade legal intelligence,
          regardless of firm size or budget.
        </p>
      </section>

      <section className="section" style={{ maxWidth: "none" }}>
        <p className="ey" style={{ textAlign: "center" }}>
          The founding team
        </p>
        <div className="founders-grid">
          {founders.map((founder) => (
            <div key={founder.name} className="founder-card">
              <div className="founder-avatar">
                <span>{founder.initials}</span>
              </div>
              <h3 className="founder-name">{founder.name}</h3>
              <p className="founder-title">{founder.title}</p>
              <p className="founder-desc">{founder.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mission-section">
        <p className="ey" style={{ color: "rgba(255,255,255,0.45)" }}>
          Our mission
        </p>
        <h2>
          Win India before the world <em>notices</em>
        </h2>
        <div className="mission-grid">
          {missionPoints.map((point) => (
            <div key={point.title}>
              <p className="mission-point-title">{point.title}</p>
              <p className="mission-point-text">{point.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-contact">
        <p className="section-sub" style={{ marginBottom: "1.5rem" }}>
          Want to work with us or learn more?
        </p>
        <Link href="mailto:hello@lawind.ai" className="btn-primary">
          hello@lawind.ai
        </Link>
      </section>
    </>
  );
}
