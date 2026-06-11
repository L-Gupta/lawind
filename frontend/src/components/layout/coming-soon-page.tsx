import Link from "next/link";

interface ComingSoonPageProps {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  ctaLabel?: string;
}

export function ComingSoonPage({
  eyebrow,
  title,
  description,
  ctaLabel = "Get notified at launch",
}: ComingSoonPageProps) {
  return (
    <div className="page-center">
      <div className="rule" />
      <p className="ey">{eyebrow}</p>
      <div className="badge">Coming soon</div>
      <h1>{title}</h1>
      <p>{description}</p>
      <Link href="/#contact" className="btn-primary">
        {ctaLabel}
      </Link>
    </div>
  );
}
