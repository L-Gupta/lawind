import Link from "next/link";
import InfiniteGallery from "@/components/ui/3d-gallery-photography";

const galleryImages = [
  { src: "https://images.unsplash.com/photo-1741332966416-414d8a5b8887?w=900&auto=format&fit=crop&q=60", alt: "Law library" },
  { src: "https://images.unsplash.com/photo-1754769440490-2eb64d715775?w=900&auto=format&fit=crop&q=60", alt: "Courthouse architecture" },
  { src: "https://images.unsplash.com/photo-1758640920659-0bb864175983?w=900&auto=format&fit=crop&q=60", alt: "Legal documents" },
  { src: "https://plus.unsplash.com/premium_photo-1758367454070-731d3cc11774?w=900&auto=format&fit=crop&q=60", alt: "Courtroom" },
  { src: "https://images.unsplash.com/photo-1746023841657-e5cd7cc90d2c?w=900&auto=format&fit=crop&q=60", alt: "Legal practice" },
  { src: "https://images.unsplash.com/photo-1741715661559-6149723ea89a?w=900&auto=format&fit=crop&q=60", alt: "Statute books" },
  { src: "https://images.unsplash.com/photo-1725878746053-407492aa4034?w=900&auto=format&fit=crop&q=60", alt: "Legal research" },
  { src: "https://images.unsplash.com/photo-1752588975168-d2d7965a6d64?w=900&auto=format&fit=crop&q=60", alt: "Indian judiciary" },
];

const whatWeDo = [
  {
    title: "Legal Research",
    description:
      "Natural language search across Supreme Court judgments, High Court decisions, statutes, and regulations — with sources you can verify.",
  },
  {
    title: "AI Drafting Studio",
    description:
      "Generate NDAs, agreements, notices, and petitions from plain English instructions, in minutes instead of hours.",
  },
  {
    title: "Contract Review",
    description:
      "Clause extraction, risk identification, redline suggestions, and compliance analysis on every document you upload.",
  },
  {
    title: "Matter Management",
    description:
      "Case tracking, hearing schedules, client management, and team collaboration in one place.",
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

      <section className="section">
        <p className="ey" style={{ textAlign: "center" }}>
          What we do
        </p>
        <h2 className="section-title">
          One platform for every part of
          <br />
          <em>Indian legal work</em>
        </h2>
        <p className="section-sub">
          Instead of stitching together disconnected tools for research,
          drafting, contract review, and matter management, LawInd combines
          artificial intelligence with Indian legal knowledge to make legal
          work faster, more accurate, and more accessible.
        </p>
        <div className="card-grid">
          {whatWeDo.map((item) => (
            <div key={item.title} className="feature-card">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-gallery-section">
        <p className="ey" style={{ textAlign: "center" }}>
          A closer look
        </p>
        <h2 className="section-title">
          Depth of practice, <em>depth of research</em>
        </h2>
        <InfiniteGallery images={galleryImages} className="about-gallery" />
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
