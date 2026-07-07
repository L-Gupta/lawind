import Link from "next/link";

const links = [
  { href: "/#platform", label: "Platform" },
  { href: "/#segments", label: "Who it's for" },
  { href: "/roi", label: "ROI Calculator" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/resources", label: "Resources" },
];

export function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="logo">
        LawInd
      </Link>
      <div className="nav-links">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="nav-link">
            {link.label}
          </Link>
        ))}
        <Link href="/login" className="nav-link">
          Sign in
        </Link>
      </div>
      <div className="nav-actions">
        <Link href="/signup" className="btn-primary">
          Sign up
        </Link>
        <Link href="/#contact" className="btn-outline">
          Request access
        </Link>
      </div>
    </nav>
  );
}
