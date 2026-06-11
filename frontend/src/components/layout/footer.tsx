import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <Link href="/">LawInd</Link>
      {" "}&nbsp;·&nbsp; Built in India, for India &nbsp;·&nbsp;{" "}
      <a href="mailto:hello@lawind.ai">hello@lawind.ai</a>
    </footer>
  );
}
