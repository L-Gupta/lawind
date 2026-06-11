import Link from "next/link";

const links = [
  { href: "/#platform", label: "Platform" },
  { href: "/#segments", label: "Who it's for" },
  { href: "/roi", label: "ROI Calculator" },
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
      </div>
      <Link href="/#contact" className="btn-outline">
        Request access
      </Link>
    </nav>
  );
}
